const DOWNLOAD_ORIGIN = 'https://downloads.clankrintelligence.com';

export const LOCAL_RELEASE_LICENSE = {
  label: 'RealisticNPCs Local License Agreement',
  url: '/legal/realisticnpcs-local/0.5.0/LICENSE.txt',
  sha256: '8aba5d8ff9d85462229829fbe8b3cf4dff9ed0f0326688b236c092c1b8322fce',
} as const;

export const LOCAL_DEPLOYMENT_SCOPE =
  'RealisticNPCs Local 0.5.0 is intended for development and developer-controlled environments. Distribution to player machines requires a developer-provided inference service and authentication solution; this player-facing infrastructure is not included with RealisticNPCs.';

export interface LocalDownloadArtifact {
  artifactId: string;
  label: string;
  displayName: string;
  fileName: string;
  downloadEndpoint: string;
  platformLabel: string;
  format: string;
  sizeLabel?: string;
}

export interface LocalRelease {
  productName: string;
  editionName: string;
  version: string;
  summary: string;
  artifacts: LocalDownloadArtifact[];
}

export const localRelease: LocalRelease = {
  productName: 'RealisticNPCs',
  editionName: 'Local',
  version: '0.5.0',
  summary:
    'RealisticNPCs Local 0.5.0 is a developer-facing alpha for Unreal Engine, combining a source-visible adapter with a bundled local daemon.',
  artifacts: [
    {
      artifactId: 'realisticnpcs-local-unreal-v0.5.0-windows-x86_64',
      label: 'I Agree and Download',
      displayName: 'RealisticNPCs Local for Unreal Engine',
      fileName: 'RealisticNPCs-Local-Unreal-v0.5.0-Windows-x86_64.zip',
      downloadEndpoint: DOWNLOAD_ORIGIN + '/download',
      platformLabel: 'Windows 10/11 x86_64',
      format: 'ZIP archive',
      sizeLabel: '13.4 MB',
    },
  ],
};
