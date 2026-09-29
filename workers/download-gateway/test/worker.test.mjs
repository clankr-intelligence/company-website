import assert from 'node:assert/strict';
import { test } from 'node:test';

import { handleRequest } from '../src/worker.mjs';

const ORIGIN = 'https://clankrintelligence.com';
const RELEASE_ID = 'realisticnpcs-local-unreal-v0.5.0-windows-x86_64';
const FORMER_TEST_ID =
  'realisticnpcs-local-unreal-v0.4.0-windows-x86_64-system-test';
const RELEASE_FILE_NAME =
  'RealisticNPCs-Local-Unreal-v0.5.0-Windows-x86_64.zip';
const RELEASE_KEY =
  `releases/0.5.0/unreal/windows-x86_64/${RELEASE_FILE_NAME}`;
const RELEASE_SIZE = 13374069;
const RELEASE_SHA =
  '39c31f215ac38ce8656665a72eea6342c691e6677d5e5b5b358f0a39cfd43e17';
const LICENSE_SHA =
  '8aba5d8ff9d85462229829fbe8b3cf4dff9ed0f0326688b236c092c1b8322fce';
const LICENSE_URL =
  'https://clankrintelligence.com/legal/realisticnpcs-local/0.5.0/LICENSE.txt';
const RELEASE_0_5 = {
  artifactId: RELEASE_ID,
  fileName: RELEASE_FILE_NAME,
  key: RELEASE_KEY,
  size: RELEASE_SIZE,
  artifactSha256: RELEASE_SHA,
  licenseSha256: LICENSE_SHA,
  licenseUrl: LICENSE_URL,
};
const RETIRED_RELEASE_0_4 = {
  artifactId: 'realisticnpcs-local-unreal-v0.4.0-windows-x86_64',
  fileName: 'RealisticNPCs-Local-Unreal-v0.4.0-Windows-x86_64.zip',
  key:
    'releases/0.4.0/unreal/windows-x86_64/RealisticNPCs-Local-Unreal-v0.4.0-Windows-x86_64.zip',
  size: 7853380,
  artifactSha256:
    '5430ed62329c3709f0f1d791bc370725ecf4a2ec44ca151b0b92d8fd33944c42',
  licenseSha256:
    '2b514ea59e74f917fda45607f91b755399f2b7f286b9a6b37e259782391b9dd1',
  licenseUrl:
    'https://clankrintelligence.com/legal/realisticnpcs-local/0.4.0/LICENSE.txt',
};
const RELEASE_BODY = 'zip';
const RELEASE_ETAG = '"release-etag"';
const MAX_FORM_BYTES = 4096;

function releaseObject(release = RELEASE_0_5) {
  return {
    body: RELEASE_BODY,
    size: release.size,
    httpEtag: RELEASE_ETAG,
    httpMetadata: {
      contentType: 'application/zip',
      contentDisposition: `attachment; filename="${release.fileName}"`,
      cacheControl: 'private, no-store',
    },
    customMetadata: {
      'delivery-contract': 'download-page-clickwrap-v1',
      'artifact-id': release.artifactId,
      'artifact-sha256': release.artifactSha256,
      'license-sha256': release.licenseSha256,
      'license-url': release.licenseUrl,
    },
  };
}

function envWith(object, expectedKey) {
  return {
    RELEASE_BUCKET: {
      async get(key) {
        if (expectedKey) {
          assert.equal(key, expectedKey);
        }
        return object;
      },
    },
  };
}

function failingEnv() {
  return {
    RELEASE_BUCKET: {
      async get() {
        throw new Error('R2 unavailable');
      },
    },
  };
}

function post(fields = {}, headers = {}) {
  const body = new URLSearchParams({
    acceptance: 'accepted',
    artifact_id: RELEASE_ID,
    license_sha256: LICENSE_SHA,
    ...fields,
  });
  return new Request('https://downloads.clankrintelligence.com/download', {
    method: 'POST',
    headers: { Origin: ORIGIN, ...headers },
    body,
  });
}

function streamedPost(chunks, headers = {}) {
  const encodedChunks = chunks.map((chunk) =>
    typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk,
  );
  let chunkIndex = 0;
  let cancelled = false;
  const body = new ReadableStream({
    pull(controller) {
      if (chunkIndex === encodedChunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(encodedChunks[chunkIndex]);
      chunkIndex += 1;
    },
    cancel() {
      cancelled = true;
    },
  });
  return {
    request: new Request('https://downloads.clankrintelligence.com/download', {
      method: 'POST',
      headers: {
        Origin: ORIGIN,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      body,
      duplex: 'half',
    }),
    wasCancelled() {
      return cancelled;
    },
  };
}

function encodedForm(fields = {}) {
  return new URLSearchParams({
    acceptance: 'accepted',
    artifact_id: RELEASE_ID,
    license_sha256: LICENSE_SHA,
    ...fields,
  }).toString();
}

test('rejects non-POST requests and unrelated paths', async () => {
  const env = envWith(null);
  const get = await handleRequest(
    new Request('https://downloads.clankrintelligence.com/download'),
    env,
  );
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('Allow'), 'POST');

  for (const path of [
    '/realisticnpcs-download-test.txt',
    `/${RELEASE_KEY}`,
    `/${RELEASE_KEY}.sha256`,
    `/${RETIRED_RELEASE_0_4.key}`,
    `/${RETIRED_RELEASE_0_4.key}.sha256`,
  ]) {
    const missing = await handleRequest(
      new Request(`https://downloads.clankrintelligence.com${path}`),
      env,
    );
    assert.equal(missing.status, 404);
  }

  assert.equal(
    (await handleRequest(post({ artifact_id: 'toString' }), env)).status,
    404,
  );
  assert.equal(
    (await handleRequest(post({ artifact_id: FORMER_TEST_ID }), env)).status,
    404,
  );

  const acceptedBody = new URLSearchParams({
    acceptance: 'accepted',
    artifact_id: RELEASE_ID,
    license_sha256: LICENSE_SHA,
  });
  for (const url of [
    'http://downloads.clankrintelligence.com/download',
    'https://downloads.clankrintelligence.com:444/download',
  ]) {
    const response = await handleRequest(
      new Request(url, {
        method: 'POST',
        headers: { Origin: ORIGIN },
        body: acceptedBody,
      }),
      env,
    );
    assert.equal(response.status, 404);
  }
});

test('rejects wrong origins and malformed acceptance', async () => {
  const env = envWith(releaseObject());
  assert.equal(
    (await handleRequest(post({}, { Origin: 'https://example.com' }), env)).status,
    403,
  );
  assert.equal((await handleRequest(post({ acceptance: 'no' }), env)).status, 403);
  assert.equal((await handleRequest(post({ license_sha256: '0'.repeat(64) }), env)).status, 403);

  const duplicate = new URLSearchParams({
    acceptance: 'accepted',
    artifact_id: RELEASE_ID,
    license_sha256: LICENSE_SHA,
  });
  duplicate.append('acceptance', 'accepted');
  const duplicateResponse = await handleRequest(
    new Request('https://downloads.clankrintelligence.com/download', {
      method: 'POST',
      headers: { Origin: ORIGIN },
      body: duplicate,
    }),
    env,
  );
  assert.equal(duplicateResponse.status, 400);

  const extraField = await handleRequest(post({ unexpected: 'value' }), env);
  assert.equal(extraField.status, 400);

  const wrongMediaType = await handleRequest(
    post({}, { 'Content-Type': 'text/plain' }),
    env,
  );
  assert.equal(wrongMediaType.status, 415);

  for (const body of [
    new Uint8Array([0xff]),
    'acceptance=accepted&artifact_id=%no&license_sha256=' + LICENSE_SHA,
    'acceptance=accepted&artifact_id=%FF&license_sha256=' + LICENSE_SHA,
  ]) {
    const malformedResponse = await handleRequest(
      new Request('https://downloads.clankrintelligence.com/download', {
        method: 'POST',
        headers: {
          Origin: ORIGIN,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      }),
      env,
    );
    assert.equal(malformedResponse.status, 400);
  }
});

test('enforces the form limit while streaming request bodies', async () => {
  const validBody = encodedForm();
  const streamedValid = streamedPost([
    validBody.slice(0, 17),
    validBody.slice(17, 83),
    validBody.slice(83),
  ]);
  assert.equal(streamedValid.request.headers.get('Content-Length'), null);
  const validResponse = await handleRequest(
    streamedValid.request,
    envWith(releaseObject(), RELEASE_KEY),
  );
  assert.equal(validResponse.status, 200);
  assert.equal(streamedValid.wasCancelled(), false);

  const fixedFormBytes = new TextEncoder().encode(
    `acceptance=accepted&artifact_id=&license_sha256=${LICENSE_SHA}`,
  ).byteLength;
  const boundaryBody = encodedForm({
    artifact_id: 'a'.repeat(MAX_FORM_BYTES - fixedFormBytes),
  });
  assert.equal(new TextEncoder().encode(boundaryBody).byteLength, MAX_FORM_BYTES);
  const boundary = streamedPost([boundaryBody.slice(0, 2048), boundaryBody.slice(2048)]);
  assert.equal((await handleRequest(boundary.request, envWith(null))).status, 404);
  assert.equal(boundary.wasCancelled(), false);

  const oversized = streamedPost(
    ['a'.repeat(2048), 'b'.repeat(2048), 'c'],
    { 'Content-Length': '1' },
  );
  assert.equal((await handleRequest(oversized.request, envWith(null))).status, 413);
  assert.equal(oversized.wasCancelled(), true);

  const declaredOversized = post({}, {
    'Content-Length': String(MAX_FORM_BYTES + 1),
  });
  assert.equal(
    (await handleRequest(declaredOversized, envWith(null))).status,
    413,
  );
});

test('rejects request stream failures as malformed acceptance', async () => {
  const body = new ReadableStream({
    pull(controller) {
      controller.error(new Error('request stream failed'));
    },
  });
  const request = new Request('https://downloads.clankrintelligence.com/download', {
    method: 'POST',
    headers: {
      Origin: ORIGIN,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    duplex: 'half',
  });
  assert.equal((await handleRequest(request, envWith(null))).status, 400);
});

test(`streams ${RELEASE_ID} without a persistent grant`, async () => {
  const release = RELEASE_0_5;
  const response = await handleRequest(
    post({
      artifact_id: release.artifactId,
      license_sha256: release.licenseSha256,
    }),
    envWith(releaseObject(release), release.key),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), RELEASE_BODY);
  assert.equal(response.headers.get('Content-Length'), String(release.size));
  assert.equal(
    response.headers.get('Content-Disposition'),
    `attachment; filename="${release.fileName}"`,
  );
  assert.equal(response.headers.get('Content-Type'), 'application/zip');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('ETag'), RELEASE_ETAG);
  assert.equal(response.headers.get('X-Artifact-SHA256'), null);
  assert.equal(response.headers.get('Set-Cookie'), null);
  assert.equal(response.headers.get('Location'), null);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
});

test('rejects retired 0.4.0 downloads before storage access', async () => {
  let storageReads = 0;
  const env = {
    RELEASE_BUCKET: {
      async get() {
        storageReads += 1;
        return releaseObject(RETIRED_RELEASE_0_4);
      },
    },
  };
  for (const licenseSha of [RETIRED_RELEASE_0_4.licenseSha256, LICENSE_SHA]) {
    const response = await handleRequest(
      post({
        artifact_id: RETIRED_RELEASE_0_4.artifactId,
        license_sha256: licenseSha,
      }),
      env,
    );
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('Content-Disposition'), null);
    assert.equal(response.headers.get('Location'), null);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    assert.equal(await response.text(), 'Download artifact was not found.\n');
  }
  assert.equal(storageReads, 0);
});

test('rejects old licenses and unknown artifacts before storage access', async () => {
  let storageReads = 0;
  const env = {
    RELEASE_BUCKET: {
      async get() {
        storageReads += 1;
        return null;
      },
    },
  };
  const wrongLicense = await handleRequest(
    post({ license_sha256: RETIRED_RELEASE_0_4.licenseSha256 }),
    env,
  );
  assert.equal(wrongLicense.status, 403);
  const unknown = await handleRequest(
    post({ artifact_id: 'realisticnpcs-local-unreal-v0.6.0-windows-x86_64' }),
    env,
  );
  assert.equal(unknown.status, 404);
  assert.equal(storageReads, 0);
});

test('rejects unavailable or incorrectly described 0.5.0 release objects', async () => {
  const fields = {
    artifact_id: RELEASE_0_5.artifactId,
    license_sha256: RELEASE_0_5.licenseSha256,
  };
  assert.equal(
    (await handleRequest(post(fields), envWith(null, RELEASE_0_5.key))).status,
    503,
  );
  assert.equal((await handleRequest(post(fields), failingEnv())).status, 503);

  const invalidObjects = [
    ['size', (object) => { object.size -= 1; }],
    ['artifact identity', (object) => { object.customMetadata['artifact-id'] = RETIRED_RELEASE_0_4.artifactId; }],
    ['artifact hash', (object) => { object.customMetadata['artifact-sha256'] = RETIRED_RELEASE_0_4.artifactSha256; }],
    ['license hash', (object) => { object.customMetadata['license-sha256'] = RETIRED_RELEASE_0_4.licenseSha256; }],
    ['license URL', (object) => { object.customMetadata['license-url'] = RETIRED_RELEASE_0_4.licenseUrl; }],
    ['delivery contract', (object) => { object.customMetadata['delivery-contract'] = 'other'; }],
    ['missing metadata', (object) => { delete object.customMetadata['artifact-sha256']; }],
    ['extra metadata', (object) => { object.customMetadata.unexpected = 'value'; }],
    ['content type', (object) => { object.httpMetadata.contentType = 'text/plain'; }],
    ['filename', (object) => {
      object.httpMetadata.contentDisposition = `attachment; filename="${RETIRED_RELEASE_0_4.fileName}"`;
    }],
    ['cache policy', (object) => { object.httpMetadata.cacheControl = 'public'; }],
  ];
  for (const [label, invalidate] of invalidObjects) {
    const object = releaseObject(RELEASE_0_5);
    invalidate(object);
    const response = await handleRequest(
      post(fields),
      envWith(object, RELEASE_0_5.key),
    );
    assert.equal(response.status, 503, label);
  }
});

test('rejects unavailable or incorrectly described release objects', async () => {
  const object = releaseObject();
  assert.equal(
    (
      await handleRequest(
        post({ artifact_id: RELEASE_ID, license_sha256: 'b'.repeat(64) }),
        envWith(object),
      )
    ).status,
    403,
  );

  object.customMetadata['license-sha256'] = 'b'.repeat(64);
  assert.equal(
    (
      await handleRequest(
        post({ artifact_id: RELEASE_ID }),
        envWith(object, RELEASE_KEY),
      )
    ).status,
    503,
  );

  object.customMetadata['license-sha256'] = LICENSE_SHA;
  object.customMetadata.unexpected = 'value';
  assert.equal(
    (
      await handleRequest(
        post({ artifact_id: RELEASE_ID }),
        envWith(object, RELEASE_KEY),
      )
    ).status,
    503,
  );

  delete object.customMetadata.unexpected;
  object.customMetadata['artifact-sha256'] = 'c'.repeat(64);
  assert.equal(
    (
      await handleRequest(
        post({ artifact_id: RELEASE_ID }),
        envWith(object, RELEASE_KEY),
      )
    ).status,
    503,
  );

  object.customMetadata['artifact-sha256'] = RELEASE_SHA;
  object.size = RELEASE_SIZE - 1;
  assert.equal(
    (
      await handleRequest(
        post({ artifact_id: RELEASE_ID }),
        envWith(object, RELEASE_KEY),
      )
    ).status,
    503,
  );

  assert.equal(
    (
      await handleRequest(
        post({ artifact_id: RELEASE_ID }),
        envWith(null, RELEASE_KEY),
      )
    ).status,
    503,
  );
  assert.equal(
    (await handleRequest(post({ artifact_id: RELEASE_ID }), failingEnv())).status,
    503,
  );

  assert.equal(
    (
      await handleRequest(post({ artifact_id: RELEASE_ID }), envWith(object), {
        [RELEASE_ID]: {
          artifactId: RELEASE_ID,
          size: 0,
          artifactSha256: RELEASE_SHA,
        },
      })
    ).status,
    404,
  );
});
