import React from 'react';

export default function MemoryAndPersistenceDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Memory, Continuity, and Persistence</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          The managed runtime records, retrieves, reflects on, and persists the experiences that shape an NPC over time. Authors influence that history through character profiles, relationships, perception, gameplay actions, conversations, and starting item and spatial knowledge. The plugin manages memory storage and retrieval; projects author the information each NPC can know.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Remembered Experience</h3>
            <p>
              Observations, conversations, behavior outcomes, and other meaningful events can become relevant context for later decisions.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Developing Identity</h3>
            <p>
              Relationships, goals, self-assessment, personal knowledge, and familiarity with people, objects, and places can develop from play while remaining grounded in the authored character.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Continuity</h3>
            <p>
              A continuity identifies the persistent NPC timeline that should be created, resumed, saved, or intentionally kept ephemeral.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Authoring for Useful Memory</h3>
          <p>
            Most projects do not need per-NPC memory setup. Configure the required Embedding target in the RealisticNPCs Daemon Config panel, then provide clear in-world information through the normal authoring surfaces.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li>Write meaningful background, goal, self-assessment, and relationship context.</li>
            <li>Expose changing world state through perceivable facts and one-off stimuli.</li>
            <li>Register concrete actions whose outcomes clearly describe what happened.</li>
            <li>Assign <a href="#item-knowledge" className="text-blue-400 hover:text-blue-300 underline">starting item knowledge</a> and spatial knowledge according to what each NPC should initially know.</li>
            <li>Let NPCs encounter objects through <a href="#perception" className="text-blue-400 hover:text-blue-300 underline">perception</a> and hear claims through <a href="#open-conversation" className="text-blue-400 hover:text-blue-300 underline">conversation</a>.</li>
            <li>Use stable character, object, and place identities so knowledge remains grounded across sessions.</li>
          </ul>
          <p className="mt-4">
            Retrieval, reflection, relationship maintenance, and evolved identity persistence are handled automatically by the managed runtime. They should not be duplicated in project SaveGame fields.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Personal Knowledge and Familiarity</h3>
          <p>
            Starting item assignments initialize an NPC's personal understanding once. Editing the library or assignments does not rewrite an already initialized NPC's knowledge when a session restarts or continuity resumes. Test changed starting knowledge with a fresh NPC continuity. Knowledge learned, revised, or rejected during play remains part of that NPC's history.
          </p>
          <p className="mt-4">
            Meaningful encounters can build remembered familiarity with an object: what the NPC noticed, understood, or associated with it. Simply placing an actor in the level does not make every NPC know it, and every visible object does not automatically become a lasting memory. Current perception, recent sightings, and remembered familiarity provide different kinds of evidence. A remembered object can motivate a search or a question without proving where it is now.
          </p>
          <p className="mt-4">
            Personally heard speech can contribute knowledge in the background, including for a listener who stays silent. Learning does not require the conversation to end. A reply can arrive before that background learning finishes. What someone says is testimony: personality, relationships, prior understanding, uncertainty, and conflicting evidence affect how the NPC interprets it. Later evidence can qualify or correct an earlier belief; the most recent claim does not automatically win, and an NPC's own words do not teach it new facts.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Automatic Continuity in PIE</h3>
          <p>
            PIE continuity is automatic. The first run for a project and starting persistent map creates a new persistent timeline. Later PIE runs resume the latest saved head for that timeline, so NPC memory and identity can continue across editor sessions.
          </p>
          <p className="mt-4">
            Normal map travel within the same game instance stays on the active continuity. If a test must begin from a clean state, use <code className="bg-white/20 px-2 py-1 rounded">Reset Persistent State on Startup</code> for one startup, then turn it off again before testing persistence.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Starting Continuity in a Packaged Game</h3>
          <p>
            Outside PIE, choose the timeline explicitly near the start of the game. The continuity subsystem and its asynchronous Blueprint nodes provide three author-facing choices:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">Create New Continuity</code>
              <p className="mt-2">Starts a new persistent NPC timeline for a new game.</p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">Resume Continuity</code>
              <p className="mt-2">Resumes the persistent timeline identified by a saved <code className="bg-white/20 px-2 py-1 rounded">FRNPCContinuityToken</code>.</p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">Start Ephemeral Continuity</code>
              <p className="mt-2">Starts a temporary timeline for sessions that should not create a persistent checkpoint.</p>
            </div>
          </div>
          <p className="mt-4">
            Ephemeral continuity cannot be used with the persistent save-checkpoint flow below.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Saving a Persistent Continuity</h3>
          <p>
            Coordinate the NPC checkpoint with the project's own SaveGame operation so both represent the same point in play.
          </p>
          <ol className="list-decimal list-inside space-y-3 mt-4">
            <li>Call <code className="bg-white/20 px-2 py-1 rounded">Prepare Continuity Save</code> while a persistent continuity is active, and wait for its <code className="bg-white/20 px-2 py-1 rounded">Succeeded</code> output.</li>
            <li>Keep <code className="bg-white/20 px-2 py-1 rounded">Result.PreparedSave</code>, an <code className="bg-white/20 px-2 py-1 rounded">FRNPCPreparedContinuitySave</code>, in memory until the game save finishes.</li>
            <li>Store <code className="bg-white/20 px-2 py-1 rounded">PreparedSave.Token</code> in the project's SaveGame data.</li>
            <li>Write the project's SaveGame.</li>
            <li>Always call <code className="bg-white/20 px-2 py-1 rounded">Finish Continuity Save</code> with the same in-memory prepared value and the actual success or failure result of the game save.</li>
          </ol>
          <p className="mt-4">
            Call the finish node promptly whether the project's SaveGame write succeeds or fails, and handle its <code className="bg-white/20 px-2 py-1 rounded">Succeeded</code> and <code className="bg-white/20 px-2 py-1 rounded">Failed</code> outputs. Finishing lets NPC activity continue. On load, pass the saved token to <code className="bg-white/20 px-2 py-1 rounded">Resume Continuity</code>.
          </p>
          <p className="mt-4">
            If preparation takes its <code className="bg-white/20 px-2 py-1 rounded">Failed</code> output, inspect <code className="bg-white/20 px-2 py-1 rounded">Result.ErrorCode</code> and <code className="bg-white/20 px-2 py-1 rounded">Result.ErrorMessage</code>. No prepared save is available, so do not write a new continuity token or call the finish node for that attempt. The error <code className="bg-white/20 px-2 py-1 rounded">continuity_restore_not_ready</code> means current NPC work could not yet be saved consistently. Let play progress, then retry with a new prepare call using a bounded retry policy. The plugin does not retry automatically or guarantee eventual success. Handle other errors explicitly instead of retrying every failure.
          </p>
          <p className="mt-4">
            Resuming an older checkpoint may fork the NPC timeline. The operation result reports when that occurs; projects can normally continue using the returned active continuity without managing branch details themselves.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Preserving the Associated NPC Data</h3>
          <p>
            A continuity token identifies a saved NPC checkpoint; it contains no NPC state. Loading it requires the associated daemon database, stored under <code className="bg-white/20 px-2 py-1 rounded">Saved/RealisticNPCs/Daemon/Data</code>. Keep that data with the project's SaveGame files when backing up, transferring, or restoring a game. Copying a SaveGame token alone is insufficient.
          </p>
          <p className="mt-4">
            For a straightforward backup, close the game or editor and ensure its managed daemon has stopped before copying the Data directory and the corresponding SaveGame files. A backup taken while the daemon runs must use a SQLite-consistent snapshot that includes any required journal files; copying only the main database can miss committed state. The plugin currently provides no backup or export API.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Restoring Knowledge and World Objects</h3>
          <p>
            Resuming continuity restores NPC memory, developed identity, relationships, and personal knowledge. It does not resume a live conversation, utterance playback, or an action already in progress. Remembered people and objects are not automatically present or visible after loading: the restored game world must supply fresh perception before NPCs can act on them as current targets.
          </p>
          <p className="mt-4">
            For characters spawned at runtime, including NPCs and players, save each character's <code className="bg-white/20 px-2 py-1 rounded">GetOrCreateCharacterGuid()</code> value with the project's SaveGame. When recreating the same character, restore its valid saved GUID before <code className="bg-white/20 px-2 py-1 rounded">BeginPlay</code>. In C++, use <code className="bg-white/20 px-2 py-1 rounded">SpawnActorDeferred</code>, call <code className="bg-white/20 px-2 py-1 rounded">SetCharacterGuid()</code>, then call <code className="bg-white/20 px-2 py-1 rounded">FinishSpawning</code>. Each distinct character needs its own GUID; <code className="bg-white/20 px-2 py-1 rounded">CharacterName</code> is a display name. Restoring the GUID after play begins can disrupt the character's registration and conversations.
          </p>
          <p className="mt-4">
            Project SaveGame code remains responsible for restoring the physical world and stable identities of objects spawned at runtime. Save each object's <code className="bg-white/20 px-2 py-1 rounded">Get Object Guid</code> value from its Perceivable Object component. When recreating that same object, call <code className="bg-white/20 px-2 py-1 rounded">Restore Object Guid</code> with the saved value as part of initialization, before NPCs encounter it, and check the boolean result. Distinct objects need distinct GUIDs. A newly generated GUID identifies a different object; a SaveGame property marker alone does not recreate an actor or preserve its identity across sessions.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">World Time and Save Coordination</h3>
          <p>
            Game time is saved separately for each map, independently of the NPC continuity token. That map's saved time takes precedence over the configured initial time. If no saved time exists and <code className="bg-white/20 px-2 py-1 rounded">Auto Apply Initial Time</code> is enabled, the plugin applies the Initial Time from Project Settings. Loading an older NPC checkpoint can therefore pair older NPC memories with the latest saved map clock. If the game must rewind time with a save slot, save the intended time in the project's SaveGame and restore it explicitly through <code className="bg-white/20 px-2 py-1 rounded">RNPCsUtilities::SetGameWorldTime(...)</code>.
          </p>
          <p className="mt-4">
            During <code className="bg-white/20 px-2 py-1 rounded">Prepare Continuity Save</code>, the plugin pauses new NPC actions and waits for already accepted work to finish before taking the checkpoint. Wait for the asynchronous result rather than assuming that preparation completes immediately. This coordination requires no project setting.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Clean-Slate Development Runs</h3>
          <p>
            <code className="bg-white/20 px-2 py-1 rounded">Reset Persistent State on Startup</code> is a development aid. While enabled, startup clears saved world time, managed-runtime persistence, and automatic PIE continuity handles. It preserves the daemon executable, project configuration, stored provider credentials, and the project's own SaveGame files. Those files' continuity tokens can no longer load the deleted NPC data unless the associated database is restored from a backup.
          </p>
          <p className="mt-4">
            Enable it for one clean startup or PIE run, then disable it. Leaving it enabled intentionally starts fresh every time.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Authoring Checklist</h3>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Configure and validate the required Embedding target in the daemon configuration panel.</li>
            <li>Use automatic PIE continuity for normal editor iteration.</li>
            <li>Choose new, resumed, or ephemeral continuity explicitly in packaged games.</li>
            <li>Pair every prepared persistent checkpoint with a matching finish call.</li>
            <li>Handle failed preparation before writing the game's save; retry only an appropriate transient error.</li>
            <li>Store the continuity token with the project's SaveGame and preserve its associated daemon data.</li>
            <li>Restore stable identities for characters and objects spawned at runtime, and coordinate map time with the game's load behavior.</li>
            <li>Use the reset setting only when a deliberately clean development run is required.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
