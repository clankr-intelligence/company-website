import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NotFound from '../../../NotFound';
import UnrealDocsNavigation from '../../../../components/UnrealDocsNavigation';
import { releases } from './releases';

export default function ChangelogDetail() {
  const { version } = useParams<{ version: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [version]);

  const release = releases.find(r => r.version === version);

  if (!release) {
    return <NotFound />;
  }

  return (
    <div id="top" className="rnpc-docs-page relative min-h-screen pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        backgroundSize: '48px 48px'
      }}></div>

      <UnrealDocsNavigation />
      <div className="relative ml-64">
        <div className="mx-auto px-[8%] py-16">
          <Link
            to="/docs/unrealengine/changelog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Changelog
          </Link>

          <div className="mb-12">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{release.version}</h1>
              <span aria-hidden="true" className="hidden sm:inline text-gray-500">•</span>
              <span className="text-xl text-gray-400">{release.date}</span>
            </div>
          </div>

          {release.content}
        </div>
      </div>
    </div>
  );
}
