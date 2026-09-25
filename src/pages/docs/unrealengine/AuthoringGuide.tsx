import React, { useEffect } from 'react';
import UnrealDocsNavigation from '../../../components/UnrealDocsNavigation';
import CoreNPCSetupDocs from '../../../components/docs/CoreNPCSetupDocs';
import ActionsAndMovementDocs from '../../../components/docs/ActionsAndMovementDocs';
import SpatialAuthoringDocs from '../../../components/docs/SpatialAuthoringDocs';
import PerceptionDocs from '../../../components/docs/PerceptionDocs';
import ItemKnowledgeDocs from '../../../components/docs/ItemKnowledgeDocs';
import OpenConversationDocs from '../../../components/docs/OpenConversationDocs';
import MemoryAndPersistenceDocs from '../../../components/docs/MemoryAndPersistenceDocs';
import APIReferenceDocs from '../../../components/docs/APIReferenceDocs';

export default function AuthoringGuide() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
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
              Authoring Guide
            </h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
          </div>

          <div className="space-y-20">
            <div id="core-npc-setup" className="scroll-mt-24">
              <CoreNPCSetupDocs />
            </div>
            <div id="actions-and-movement" className="scroll-mt-24">
              <ActionsAndMovementDocs />
            </div>
            <div id="spatial-authoring" className="scroll-mt-24">
              <SpatialAuthoringDocs />
            </div>
            <div id="perception" className="scroll-mt-24">
              <PerceptionDocs />
            </div>
            <div id="item-knowledge" className="scroll-mt-24">
              <ItemKnowledgeDocs />
            </div>
            <div id="open-conversation" className="scroll-mt-24">
              <OpenConversationDocs />
            </div>
            <div id="memory-and-persistence" className="scroll-mt-24">
              <MemoryAndPersistenceDocs />
            </div>
            <div id="api-reference" className="scroll-mt-24">
              <APIReferenceDocs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
