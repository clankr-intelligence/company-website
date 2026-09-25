import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnrealDocsNavigation from '../../../components/UnrealDocsNavigation';

export default function Introduction() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              RealisticNPCs for Unreal Engine
            </h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
            <div className="space-y-6 text-left">
              <p className="text-gray-300 text-xl">
                The RealisticNPCs Unreal Engine plugin provides a framework for a humanlike NPC cognition and behavior layer that allows developers to easily create intelligent NPCs in their Unreal Engine projects. The plugin handles all the complexities of integrating with language models, managing NPC states, and coordinating behavior generation, letting developers focus on creating engaging gameplay experiences.
              </p>
              <p className="text-gray-300 text-xl">
                Author characters, meaningful places, perceivable objects, item knowledge, and gameplay actions. NPCs use their own observations, memories, and relationships to guide behavior and conversation; your game supplies the interactions and presentation. The plugin is in alpha, so its authoring APIs and behavior can change.
              </p>
              <p className="text-gray-300 text-xl">
                Start with the <Link to="/docs/unrealengine/quickstart" className="text-blue-400 hover:text-blue-300 transition-colors">Quick Start Guide</Link> for a first working NPC. The <Link to="/docs/unrealengine/authoring-guide" className="text-blue-400 hover:text-blue-300 transition-colors">Authoring Guide</Link> covers daily setup and integration, including <Link to="/docs/unrealengine/authoring-guide#perception" className="text-blue-400 hover:text-blue-300 transition-colors">object perception</Link>, <Link to="/docs/unrealengine/authoring-guide#item-knowledge" className="text-blue-400 hover:text-blue-300 transition-colors">item knowledge</Link>, and <Link to="/docs/unrealengine/authoring-guide#open-conversation" className="text-blue-400 hover:text-blue-300 transition-colors">open conversation</Link>.
              </p>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Link
                  to="/download"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-lg"
                >
                  Download RealisticNPCs -&gt;
                </Link>
                <span className="hidden text-gray-700 sm:inline" aria-hidden="true">
                  /
                </span>
                <Link
                  to="/docs/unrealengine/changelog"
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-lg"
                >
                  View Changelog -&gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
