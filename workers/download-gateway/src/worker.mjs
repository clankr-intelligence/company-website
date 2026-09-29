const GATEWAY_ORIGIN = 'https://downloads.clankrintelligence.com';
const WEBSITE_ORIGIN = 'https://clankrintelligence.com';
const DOWNLOAD_PATH = '/download';
const DELIVERY_CONTRACT = 'download-page-clickwrap-v1';
const MAX_FORM_BYTES = 4096;
const FORM_FIELDS = ['acceptance', 'artifact_id', 'license_sha256'];
const RELEASE_METADATA_FIELDS = [
  'artifact-id',
  'artifact-sha256',
  'delivery-contract',
  'license-sha256',
  'license-url',
];
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

// Add a product release only after its final candidate bytes exist. Each entry
// must pin the exact size, digest, object key, filename, and approved license.
const REALISTICNPCS_LOCAL_UNREAL_0_4_0 = Object.freeze({
  artifactId: 'realisticnpcs-local-unreal-v0.4.0-windows-x86_64',
  key:
    'releases/0.4.0/unreal/windows-x86_64/RealisticNPCs-Local-Unreal-v0.4.0-Windows-x86_64.zip',
  fileName: 'RealisticNPCs-Local-Unreal-v0.4.0-Windows-x86_64.zip',
  contentType: 'application/zip',
  size: 7853380,
  artifactSha256:
    '5430ed62329c3709f0f1d791bc370725ecf4a2ec44ca151b0b92d8fd33944c42',
  licenseSha256:
    '2b514ea59e74f917fda45607f91b755399f2b7f286b9a6b37e259782391b9dd1',
  licenseUrl:
    'https://clankrintelligence.com/legal/realisticnpcs-local/0.4.0/LICENSE.txt',
});

const REALISTICNPCS_LOCAL_UNREAL_0_5_0 = Object.freeze({
  artifactId: 'realisticnpcs-local-unreal-v0.5.0-windows-x86_64',
  key:
    'releases/0.5.0/unreal/windows-x86_64/RealisticNPCs-Local-Unreal-v0.5.0-Windows-x86_64.zip',
  fileName: 'RealisticNPCs-Local-Unreal-v0.5.0-Windows-x86_64.zip',
  contentType: 'application/zip',
  size: 13374069,
  artifactSha256:
    '39c31f215ac38ce8656665a72eea6342c691e6677d5e5b5b358f0a39cfd43e17',
  licenseSha256:
    '8aba5d8ff9d85462229829fbe8b3cf4dff9ed0f0326688b236c092c1b8322fce',
  licenseUrl:
    'https://clankrintelligence.com/legal/realisticnpcs-local/0.5.0/LICENSE.txt',
});

const RELEASES = Object.freeze({
  [REALISTICNPCS_LOCAL_UNREAL_0_4_0.artifactId]:
    REALISTICNPCS_LOCAL_UNREAL_0_4_0,
  [REALISTICNPCS_LOCAL_UNREAL_0_5_0.artifactId]:
    REALISTICNPCS_LOCAL_UNREAL_0_5_0,
});

function errorResponse(status, message) {
  const headers = new Headers({
    'Cache-Control': 'private, no-store',
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  if (status === 405) {
    headers.set('Allow', 'POST');
  }
  return new Response(`${message}\n`, { status, headers });
}

function getRegisteredRelease(releases, artifactId) {
  if (!Object.hasOwn(releases, artifactId)) {
    return null;
  }
  const release = releases[artifactId];
  return release &&
    typeof release === 'object' &&
    release.artifactId === artifactId &&
    Number.isSafeInteger(release.size) &&
    release.size > 0 &&
    SHA256_PATTERN.test(release.artifactSha256 ?? '')
    ? release
    : null;
}

function validateReleaseObject(object, release) {
  const metadata = object.customMetadata ?? {};
  const metadataFields = Object.keys(metadata).sort();
  return (
    object.size === release.size &&
    metadataFields.length === RELEASE_METADATA_FIELDS.length &&
    metadataFields.every(
      (field, index) => field === RELEASE_METADATA_FIELDS[index],
    ) &&
    metadata['delivery-contract'] === DELIVERY_CONTRACT &&
    metadata['artifact-id'] === release.artifactId &&
    metadata['artifact-sha256'] === release.artifactSha256 &&
    metadata['license-sha256'] === release.licenseSha256 &&
    metadata['license-url'] === release.licenseUrl &&
    object.httpMetadata?.contentType === release.contentType &&
    object.httpMetadata?.contentDisposition ===
      `attachment; filename="${release.fileName}"` &&
    object.httpMetadata?.cacheControl === 'private, no-store'
  );
}

function attachmentResponse(object, artifact) {
  const headers = new Headers({
    'Cache-Control': 'private, no-store',
    'Content-Disposition': `attachment; filename="${artifact.fileName}"`,
    'Content-Length': String(object.size),
    'Content-Type': artifact.contentType,
    'X-Content-Type-Options': 'nosniff',
  });
  if (object.httpEtag) {
    headers.set('ETag', object.httpEtag);
  }
  return new Response(object.body, { status: 200, headers });
}

async function cancelReader(reader) {
  try {
    await reader.cancel();
  } catch {
    // The request stream is already unusable, so cancellation is best-effort.
  }
}

async function readBoundedBody(request) {
  if (!request.body) {
    return { bytes: new Uint8Array() };
  }

  const reader = request.body.getReader();
  const chunks = [];
  let byteLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!(value instanceof Uint8Array)) {
        await cancelReader(reader);
        return { malformed: true };
      }
      if (value.byteLength > MAX_FORM_BYTES - byteLength) {
        await cancelReader(reader);
        return { tooLarge: true };
      }
      chunks.push(value);
      byteLength += value.byteLength;
    }
  } catch {
    await cancelReader(reader);
    return { malformed: true };
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { bytes };
}

async function parseForm(request) {
  const contentType = request.headers.get('Content-Type') ?? '';
  const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();
  if (mediaType !== 'application/x-www-form-urlencoded') {
    return { error: errorResponse(415, 'Unsupported media type.') };
  }
  const declaredLength = Number(request.headers.get('Content-Length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_FORM_BYTES) {
    return { error: errorResponse(413, 'Request body is too large.') };
  }
  const body = await readBoundedBody(request);
  if (body.tooLarge) {
    return { error: errorResponse(413, 'Request body is too large.') };
  }
  if (body.malformed) {
    return { error: errorResponse(400, 'Malformed acceptance request.') };
  }
  const bytes = body.bytes;
  let encodedForm;
  try {
    encodedForm = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return { error: errorResponse(400, 'Malformed acceptance request.') };
  }
  try {
    decodeURIComponent(encodedForm.replace(/\+/g, ' '));
  } catch {
    return { error: errorResponse(400, 'Malformed acceptance request.') };
  }
  const form = new URLSearchParams(encodedForm);
  const keys = [...form.keys()].sort();
  if (
    keys.length !== FORM_FIELDS.length ||
    keys.some((key, index) => key !== FORM_FIELDS[index]) ||
    FORM_FIELDS.some((field) => form.getAll(field).length !== 1)
  ) {
    return { error: errorResponse(400, 'Malformed acceptance request.') };
  }
  return { form };
}

async function getArtifact(env, key) {
  try {
    return await env.RELEASE_BUCKET.get(key);
  } catch {
    return null;
  }
}

export async function handleRequest(request, env, releases = RELEASES) {
  const url = new URL(request.url);
  if (url.origin !== GATEWAY_ORIGIN || url.pathname !== DOWNLOAD_PATH || url.search) {
    return errorResponse(404, 'Not found.');
  }
  if (request.method !== 'POST') {
    return errorResponse(405, 'Method not allowed.');
  }
  if (request.headers.get('Origin') !== WEBSITE_ORIGIN) {
    return errorResponse(403, 'Download request is not authorized.');
  }

  const parsed = await parseForm(request);
  if (parsed.error) {
    return parsed.error;
  }
  const artifactId = parsed.form.get('artifact_id');
  const licenseSha256 = parsed.form.get('license_sha256');
  if (
    parsed.form.get('acceptance') !== 'accepted' ||
    !SHA256_PATTERN.test(licenseSha256 ?? '')
  ) {
    return errorResponse(403, 'License acceptance is required.');
  }

  const release = getRegisteredRelease(releases, artifactId ?? '');
  if (!release) {
    return errorResponse(404, 'Download artifact was not found.');
  }
  if (licenseSha256 !== release.licenseSha256) {
    return errorResponse(403, 'License acceptance does not match this artifact.');
  }
  const object = await getArtifact(env, release.key);
  if (!object || !validateReleaseObject(object, release)) {
    return errorResponse(503, 'Download artifact is unavailable.');
  }
  return attachmentResponse(object, release);
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
