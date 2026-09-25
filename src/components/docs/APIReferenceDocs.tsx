import React from 'react';

const codeClassName = 'bg-white/20 px-2 py-1 rounded';
const entryClassName = 'border-l-4 border-blue-500/50 pl-6';

function ApiEntry({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className={entryClassName}>
      <code className={codeClassName}>{name}</code>
      <div className="mt-2 space-y-2">
        {children}
      </div>
    </div>
  );
}

function ApiSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mt-8 mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export default function APIReferenceDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">API Reference</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          This is a compact lookup for the author-facing classes, assets, components, and structs used by the workflow sections above. It is not intended to document every internal runtime type.
        </p>

        <ApiSection title="Core Characters">
          <ApiEntry name="ABaseCharacter">
            <p>
              Base class for player, scripted, and NPC characters that the plugin can perceive, remember, address, or reference in relationships. Author <code className={codeClassName}>CharacterName</code> as a display name; stable identity comes from the character GUID.
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><code className={codeClassName}>GetOrCreateCharacterGuid()</code> returns stable identity. When your save system respawns the same character, use the C++ method <code className={codeClassName}>SetCharacterGuid()</code> to restore its saved GUID before <code className={codeClassName}>BeginPlay</code>. See <a className="text-blue-400 hover:underline" href="#memory-and-persistence">Memory, Continuity, and Persistence</a> for the workflow using deferred spawning.</li>
              <li><code className={codeClassName}>GetPerceivableFactsComponent()</code> exposes current observable character state.</li>
              <li><code className={codeClassName}>SubmitSpeech()</code>, <code className={codeClassName}>DeclareParticipation()</code>, and <code className={codeClassName}>GetConversationState()</code> provide speech and participation integration.</li>
            </ul>
          </ApiEntry>

          <ApiEntry name="ABaseNPC">
            <p>
              Autonomous NPC class. Configure its profile, relationships, starting spatial and item knowledge, perception settings, and action access in the editor.
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Profile: <code className={codeClassName}>Background</code>, <code className={codeClassName}>ShortTermGoal</code>, <code className={codeClassName}>SelfAssessment</code>, <code className={codeClassName}>Relationships</code>, and <code className={codeClassName}>IdentityDevelopmentPolicy</code>.</li>
              <li>Spatial knowledge: <code className={codeClassName}>InitialKnowledgePresets</code>, <code className={codeClassName}>InitialPlaceOverrides</code>, and <code className={codeClassName}>InitialPacketAssignmentOverrides</code>.</li>
              <li>Starting Item Knowledge: <code className={codeClassName}>AuthoredKnowledgeCollections</code> and <code className={codeClassName}>AdditionalAuthoredKnowledge</code>, displayed as Collections and Additional Facts.</li>
              <li>Action access: <code className={codeClassName}>ActionSetPresets</code>, <code className={codeClassName}>AddedActionIds</code>, and <code className={codeClassName}>RemovedActionIds</code>.</li>
              <li><code className={codeClassName}>ValidateInitialPacketAssignments()</code> and <code className={codeClassName}>ValidateEnabledActions()</code> check authored setup.</li>
              <li><code className={codeClassName}>GetPhysicalAttentionState()</code> exposes current physical readiness for presentation, separately from conversation participation.</li>
            </ul>
          </ApiEntry>

          <ApiEntry name="ABaseNPCController">
            <p>
              Controller base for automatic NPC registration, custom action execution, and movement. Override <code className={codeClassName}>RegisterNPCActions()</code> to declare actions. Possessing an enabled <code className={codeClassName}>ABaseNPC</code> starts its registration automatically.
            </p>
            <p>
              Use <code className={codeClassName}>MoveToLocation()</code>, <code className={codeClassName}>MoveToCharacter()</code>, or <code className={codeClassName}>MoveToLocationWithOutcome()</code> for custom movement integration. <code className={codeClassName}>PostMoveLogic</code> continuations run only on success. Handle immediate rejection and final failure or cancellation when completing custom actions; <code className={codeClassName}>OnNPCMoveLifecycleEvent</code> reports movement results as well as presentation events. See <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#actions-and-movement">Actions and Movement</a> for outcome handling. <code className={codeClassName}>OnNPCActionFinished</code> supports common finish cleanup.
            </p>
          </ApiEntry>
        </ApiSection>

        <ApiSection title="Actions and Movement">
          <ApiEntry name="FNPCActionRegistrar">
            <p>
              Passed to <code className={codeClassName}>RegisterNPCActions()</code>. Register a void C++ callable with <code className={codeClassName}>RegisterInstantAction</code>, <code className={codeClassName}>RegisterDurationAction</code>, or <code className={codeClassName}>RegisterUntilCompleteAction</code>. Handler parameter types define the inputs; <code className={codeClassName}>TOptional&lt;T&gt;</code> makes an input optional. The registration method defines completion behavior.
            </p>
          </ApiEntry>

          <ApiEntry name="FNPCActionDefinition">
            <p>
              Action metadata: <code className={codeClassName}>ActionId</code>, <code className={codeClassName}>Description</code>, and ordered <code className={codeClassName}>Parameters</code>. Keep the ID stable and describe the concrete gameplay effect.
            </p>
          </ApiEntry>

          <ApiEntry name="FNPCActionParameterDefinition">
            <p>
              An authored parameter's <code className={codeClassName}>Name</code>, <code className={codeClassName}>Description</code>, numeric bounds, or allowed choices. Helpers include <code className={codeClassName}>Plain</code>, <code className={codeClassName}>Range</code>, <code className={codeClassName}>Minimum</code>, <code className={codeClassName}>Maximum</code>, and <code className={codeClassName}>Choices</code>. Types and requiredness come from the handler signature.
            </p>
          </ApiEntry>

          <ApiEntry name="FNPCActionAttempt">
            <p>
              Copyable completion handle passed by value as the first argument of an until-complete handler, and optionally a duration handler. Use <code className={codeClassName}>Succeed()</code>, <code className={codeClassName}>Fail(reason)</code>, or <code className={codeClassName}>Cancel(reason)</code> on the game thread. Capture this attempt for asynchronous work; <code className={codeClassName}>IsCurrent()</code> checks whether it still owns the action. Stale or repeated settlement cannot finish a newer action.
            </p>
          </ApiEntry>

          <ApiEntry name="Action Cancellation and Finish Hooks">
            <p>
              Duration and until-complete registrations accept optional cancellation cleanup with the same authored parameter types, without an attempt argument. Use it for interrupted or cancelled gameplay work. <code className={codeClassName}>OnNPCActionFinished</code> remains available on the controller for common finish cleanup.
            </p>
          </ApiEntry>

          <ApiEntry name="UNPCActionSetAsset">
            <p>
              Reusable list of custom action IDs enabled for an NPC. Assign through <code className={codeClassName}>ActionSetPresets</code>, then use per-NPC additions or removals. Each enabled custom ID needs a registered implementation on the assigned controller.
            </p>
          </ApiEntry>

          <ApiEntry name="FCharacterRef, FRNPCObjectRef, and FEntityRef">
            <p>
              Action parameters for a live character, a live object, or either kind respectively. Current physical grounding is required; memory or conversation participation does not grant a physical target. Recheck <code className={codeClassName}>Get()</code> before acting, especially after asynchronous work. <code className={codeClassName}>FCharacterRef::IsValid()</code> checks identity, not actor liveness.
            </p>
          </ApiEntry>

          <ApiEntry name="FLocationRef">
            <p>
              Spatial reference used by behavior and movement. Identity alone does not guarantee a reachable position; movement needs a grounded destination and live Unreal validation.
            </p>
          </ApiEntry>

          <ApiEntry name="FNPCMoveLifecycleEvent">
            <p>
              Payload for the Blueprint-native <code className={codeClassName}>OnNPCMoveLifecycleEvent</code>. Describes movement startup, target resolution, waypoint progress, and final success, failure, or cancellation for animation, UI, or other gameplay reactions.
            </p>
          </ApiEntry>
          <p>See <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#actions-and-movement">Actions and Movement</a> for registration examples, supported input types, and cleanup guidance.</p>
        </ApiSection>

        <ApiSection title="Speech and Conversation">
          <ApiEntry name="ABaseCharacter::SubmitSpeech">
            <p>
              Game-thread Blueprint/C++ entry point for an externally controlled character's text, audience, delivery strength, and optional context ID. Returns local admission, an utterance ID, and an immediate error. Set the optional <code className={codeClassName}>bEnterConversation</code> argument for a directed message that also declares entry. Admission does not guarantee hearing, participation, or a reply.
            </p>
          </ApiEntry>

          <ApiEntry name="FRNPCSpeechAudience and ERNPCSpeechDeliveryStrength">
            <p>
              Audience <code className={codeClassName}>Kind</code> is <code className={codeClassName}>Directed</code>, <code className={codeClassName}>Open</code>, or <code className={codeClassName}>SelfDirected</code>. Directed speech supplies unique available <code className={codeClassName}>Addressees</code> in the same world, excluding the speaker. Strength is <code className={codeClassName}>Quiet</code>, <code className={codeClassName}>Ordinary</code>, or <code className={codeClassName}>Projected</code>.
            </p>
          </ApiEntry>

          <ApiEntry name="ABaseCharacter::DeclareParticipation and FRNPCParticipationDeclaration">
            <p>
              Game-thread Blueprint/C++ entry point for an external character's <code className={codeClassName}>Enter</code>, <code className={codeClassName}>Decline</code>, or <code className={codeClassName}>Withdraw</code> choice. Initial entry supplies <code className={codeClassName}>Counterparts</code>; answering an offer or withdrawing uses its current returned <code className={codeClassName}>Reference</code>. Check immediate errors and later participation/failure events.
            </p>
          </ApiEntry>

          <ApiEntry name="GetConversationState, FRNPCConversationState, and FRNPCConversationReference">
            <p>
              Read <code className={codeClassName}>bAvailable</code>, <code className={codeClassName}>bParticipating</code>, <code className={codeClassName}>bEntryPending</code>, current references, counterparts, and offers. Unavailable state is not departure; pending entry is not accepted participation. Copy references from current state or offers and do not persist or reconstruct them.
            </p>
          </ApiEntry>

          <ApiEntry name="OnSpeechOutcome and FRNPCSpeechOutcome">
            <p>
              Speaker event with <code className={codeClassName}>Speech</code> metadata, <code className={codeClassName}>Status</code>, <code className={codeClassName}>DeliveredText</code>, and <code className={codeClassName}>Reason</code>. Success carries the whole message; failure/cancellation carries no delivered text. Use for submission feedback and speaker presentation.
            </p>
          </ApiEntry>

          <ApiEntry name="OnSpeechReceived and FRNPCSpeechReception">
            <p>
              Listener event containing received <code className={codeClassName}>Text</code>, <code className={codeClassName}>Level</code>, optional <code className={codeClassName}>Speaker</code>, and optional <code className={codeClassName}>Localization</code>. Intelligible reception has the complete message; detection-only reception has no words. A null speaker remains unidentified. Use personal reception for the listener's transcript.
            </p>
          </ApiEntry>

          <ApiEntry name="OnContactOffered, OnParticipationChanged, and OnCommunicationFailure">
            <p>
              Assignable events carrying <code className={codeClassName}>FRNPCContactOffer</code>, <code className={codeClassName}>FRNPCConversationParticipation</code>, and <code className={codeClassName}>FRNPCCommunicationFailure</code>. Present offers, refresh current participation state, and report operational failures respectively. Bind before submitting input. <code className={codeClassName}>PendingClosed</code> reports closure of pending entry and can accompany its acceptance.
            </p>
          </ApiEntry>

          <ApiEntry name="GetPhysicalAttentionState and ERNPCPhysicalAttentionState">
            <p>
              Game-thread Blueprint query on <code className={codeClassName}>ABaseNPC</code> for <code className={codeClassName}>OrdinaryActivity</code>, <code className={codeClassName}>YieldPending</code>, <code className={codeClassName}>ProvisionalAttention</code>, <code className={codeClassName}>RetainedAttention</code>, or <code className={codeClassName}>Unavailable</code>. Use for physical presentation readiness, not accepted participation or a facing target.
            </p>
          </ApiEntry>

          <ApiEntry name="GetSpeechPhysicalConditions and FRNPCSpeechPhysicalConditions">
            <p>
              Blueprint-native character override for physical <code className={codeClassName}>bCanSpeak</code>, <code className={codeClassName}>bCanHear</code>, and <code className={codeClassName}>LocalMasking</code> from 0 to 1. A synchronous read-only game-thread query; it does not choose social willingness.
            </p>
          </ApiEntry>

          <ApiEntry name="EvaluateSpeechReception and FRNPCSpeechReceptionEvaluation">
            <p>
              Optional Blueprint-native listener override for custom hearing. Return <code className={codeClassName}>NotDetected</code>, <code className={codeClassName}>DetectedOnly</code>, or <code className={codeClassName}>Intelligible</code> plus optional <code className={codeClassName}>FRNPCSpeechLocalization</code>. Replaces the default calculation while preserving the physical inability-to-hear restriction. Run synchronously on the game thread without presentation or latent work.
            </p>
          </ApiEntry>
          <p>See <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#open-conversation">Open Conversation</a> for complete interaction, hearing, and presentation guidance.</p>
        </ApiSection>

        <ApiSection title="Spatial Authoring">
          <ApiEntry name="ASpatialPlaceAnchorActor">
            <p>
              Placeable actor for one top-level place identity plus an optional discovery region. Use it for fuzzy exterior places such as villages, roads, districts, plazas, courtyards, or fields.
            </p>
          </ApiEntry>

          <ApiEntry name="USemanticPlaceComponent">
            <p>
              Component that defines a top-level place identity on an actor. Use one per actor when a building, room cluster, object, or other actor should be known as a place.
            </p>
          </ApiEntry>

          <ApiEntry name="USpatialAreaComponent">
            <p>
              Component for a grounded sub-area inside or around a place. It provides packet grounding, movement targets, runtime containment, and optional live perception for specific areas.
            </p>
          </ApiEntry>

          <ApiEntry name="USpatialPlaceDiscoveryComponent">
            <p>
              Perception geometry that lets NPCs discover a top-level place from sight. For place anchors, prefer editing the anchor actor's region fields instead of editing the internal discovery component directly.
            </p>
          </ApiEntry>

          <ApiEntry name="USpatialKnowledgePacketAsset">
            <p>
              Reusable data asset that describes spatial knowledge packets. Packets define area templates and relations that can be seeded into an NPC's spatial memory for specific target places.
            </p>
          </ApiEntry>

          <ApiEntry name="FSpatialKnowledgePacketAuthoringDef">
            <p>
              Main editable packet definition stored inside a packet asset. It contains the packet id, display text, area templates, and authored relations between those templates.
            </p>
          </ApiEntry>

          <ApiEntry name="USpatialKnowledgeSeedPresetAsset">
            <p>
              Reusable data asset for starting spatial knowledge. Use presets for shared roles, then use per-NPC overrides only for exceptions.
            </p>
          </ApiEntry>

          <ApiEntry name="FSpatialKnowledgeSeedAuthoringProfile">
            <p>
              Main editable profile stored inside a seed preset asset. It combines starting places, top-level place relations, and packet assignments.
            </p>
          </ApiEntry>

          <ApiEntry name="ASpatialKnowledgePacketLibraryActor">
            <p>
              Placeable world actor that registers packet assets for the current world. Packet assignments can only seed packets that are available through the world library.
            </p>
          </ApiEntry>

          <ApiEntry name="FSpatialKnowledgePacketAssignmentAuthoring">
            <p>
              Authoring entry used by seed presets and per-NPC overrides to assign a packet id to explicit target places.
            </p>
          </ApiEntry>

          <ApiEntry name="FSpatialAuthoredPlaceReference">
            <p>
              Author-facing reference to an authored place in the current world. Use this when assigning starting place knowledge through presets or per-NPC overrides.
            </p>
          </ApiEntry>

          <ApiEntry name="FSpatialPerceptionAuthoringSettings">
            <p>
              Per-NPC settings for authored spatial perception sampling. Configure this on <code className={codeClassName}>ABaseNPC</code> when an NPC needs custom spatial perception behavior.
            </p>
          </ApiEntry>
        </ApiSection>

        <ApiSection title="Perception">
          <ApiEntry name="UPerceivableFactsComponent">
            <p>
              Component for staged state facts about an actor. Use <code className={codeClassName}>SetFact()</code>, <code className={codeClassName}>RemoveFact()</code>, and <code className={codeClassName}>ClearFacts()</code> for current facts that are true until changed.
            </p>
          </ApiEntry>

          <ApiEntry name="FPerceivableStagedFact">
            <p>
              Blueprint-friendly value container for staged facts. Includes the value type, typed value fields, importance, confidence, and observable-by mask.
            </p>
          </ApiEntry>

          <ApiEntry name="UPerceivableObjectComponent">
            <p>
              Add the editor's <code className={codeClassName}>Perceivable Object</code> component to an ordinary noncharacter actor. Author its perceptual label, immediately visible description, and visible traits. It supplies stable object identity and Object Vision participation; optional <code className={codeClassName}>PerceptualGeometryComponents</code> restrict which same-actor primitives supply visibility geometry.
            </p>
            <p>
              <code className={codeClassName}>GetObjectGuid()</code> reads identity. Use <code className={codeClassName}>RestoreObjectGuid()</code> when your save system respawns the same logical object, and check its Boolean result. Characters use <code className={codeClassName}>ABaseCharacter</code> instead. See <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#perception">Perception</a> for collision, geometry, and identity setup.
            </p>
          </ApiEntry>

          <ApiEntry name="UNPCStimulusSubsystem">
            <p>
              World subsystem for emitting one-off perception events. Use <code className={codeClassName}>EmitStimulus()</code> for discrete events such as sounds, impacts, or damage. Use the speech API when characters should receive actual words.
            </p>
          </ApiEntry>

          <ApiEntry name="FRNPCStimulusEmitSpec">
            <p>
              Blueprint-friendly event emission spec. It defines the stimulus channel, event key/value, source or location, range, strength, TTL, and optional directed target.
            </p>
          </ApiEntry>

          <ApiEntry name="Reflected Property Metadata">
            <p>
              Use metadata such as <code className={codeClassName}>RNPC_Perceivable</code>, <code className={codeClassName}>RNPC_Key</code>, <code className={codeClassName}>RNPC_Importance</code>, <code className={codeClassName}>RNPC_Confidence</code>, and <code className={codeClassName}>RNPC_ObservableBy</code> to expose continuous reflected state directly from actor properties.
            </p>
          </ApiEntry>
        </ApiSection>

        <ApiSection title="Item Knowledge">
          <ApiEntry name="UAuthoredItemKnowledgeSourceAsset">
            <p>
              Editor <code className={codeClassName}>Item Knowledge Library</code> asset. Map existing DataTables, Data Assets, data-only Blueprint defaults, or Data Registry selections to stable definitions and facts; add prose annotations where needed. Keep <code className={codeClassName}>ContentId</code> stable when renaming or moving the asset.
            </p>
          </ApiEntry>

          <ApiEntry name="AItemKnowledgeActor">
            <p>
              The level's <code className={codeClassName}>Item Knowledge</code> actor selects its active <code className={codeClassName}>Library</code>. Create or update it with the library's <code className={codeClassName}>Use in Current Level</code> command. Keep exactly one binding in the persistent level, loaded outside runtime data layers. Library changes apply to a new session.
            </p>
          </ApiEntry>

          <ApiEntry name="UAuthoredItemKnowledgeCollectionAsset">
            <p>
              Reusable starting-fact selections for NPCs. Its <code className={codeClassName}>Source</code>, displayed as Library, associates the collection with content; the level actor activates that content. Assign collections through the NPC's Starting Item Knowledge controls.
            </p>
          </ApiEntry>

          <ApiEntry name="FRNPCAuthoredKnowledgeSelection and FRNPCAuthoredFactReference">
            <p>
              A collection selection names a <code className={codeClassName}>DefinitionId</code> and optional <code className={codeClassName}>FactIds</code>; an empty fact list selects all facts for that entry. An additional fact reference names one exact definition and fact. NPC collections and Additional Facts combine by union and do not overwrite restored personal knowledge.
            </p>
          </ApiEntry>

          <ApiEntry name="UAuthoredItemKnowledgeReader">
            <p>
              Optional project-owned C++ reader for specialized source schemas. Override <code className={codeClassName}>ReadItem</code> when the library's reflected property mapping cannot express your data. Existing item classes keep their own inheritance; ordinary libraries need no custom reader.
            </p>
          </ApiEntry>
          <p>See <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#item-knowledge">Item Knowledge and Object Understanding</a> for authoring, preview, assignment, and recognition guidance.</p>
        </ApiSection>

        <ApiSection title="Continuity, Time, and Configuration">
          <ApiEntry name="URNPCsDeveloperSettings">
            <p>
              Project settings for calendar selection, automatic initial time, development persistent-state reset, and world description. Provider services and model targets are configured separately through <code className={codeClassName}>Window → RealisticNPCs Daemon Config</code>.
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><code className={codeClassName}>CalendarSource</code>, <code className={codeClassName}>SimpleCalendar</code>, <code className={codeClassName}>GregorianCalendar</code>, and <code className={codeClassName}>CustomCalendarAsset</code>.</li>
              <li><code className={codeClassName}>bAutoApplyInitialTime</code> and <code className={codeClassName}>InitialTime</code>.</li>
              <li><code className={codeClassName}>bResetPersistentStateOnStartup</code>.</li>
              <li><code className={codeClassName}>WorldDescriptionFile</code> and <code className={codeClassName}>InlineWorldDescription</code>.</li>
            </ul>
          </ApiEntry>

          <ApiEntry name="ERNPCCalendarSource and Built-In Calendar Configuration">
            <p>
              <code className={codeClassName}>ERNPCCalendarSource</code> selects Built-in Simple, Built-in Gregorian, or a project-owned Custom Calendar Asset. <code className={codeClassName}>FRNPCSimpleCalendarConfiguration</code> exposes real seconds per game day, month-day counts, and optional month names; <code className={codeClassName}>FRNPCGregorianCalendarConfiguration</code> exposes real seconds per game day and optional month names.
            </p>
            <p>
              Both built-ins default to 1800 real seconds per game day. Simple additionally defaults to twelve 30-day months. Their settings are stored separately and take effect when the world or PIE session restarts.
            </p>
          </ApiEntry>

          <ApiEntry name="URNPCContinuitySubsystem">
            <p>
              Game-instance subsystem for selecting and saving the active NPC continuity. Packaged games use <code className={codeClassName}>CreateNewContinuity()</code>, <code className={codeClassName}>ResumeContinuity()</code>, or <code className={codeClassName}>StartEphemeralContinuity()</code> to choose a timeline, and coordinate SaveGame checkpoints with <code className={codeClassName}>PrepareContinuitySave()</code> and <code className={codeClassName}>FinishContinuitySave()</code>.
            </p>
            <p>
              <code className={codeClassName}>GetActiveContinuityToken()</code> and <code className={codeClassName}>GetContinuityState()</code> expose the current state. PIE resolves its persistent continuity automatically.
            </p>
          </ApiEntry>

          <ApiEntry name="Continuity Blueprint Async Nodes">
            <p>
              Author-facing asynchronous nodes are <code className={codeClassName}>Create New Continuity</code>, <code className={codeClassName}>Resume Continuity</code>, <code className={codeClassName}>Start Ephemeral Continuity</code>, <code className={codeClassName}>Prepare Continuity Save</code>, and <code className={codeClassName}>Finish Continuity Save</code>. Each reports success or failure without blocking gameplay.
            </p>
          </ApiEntry>

          <ApiEntry name="FRNPCContinuityToken">
            <p>
              SaveGame-compatible reference to a persistent NPC checkpoint. Store it with the project's save data and pass it to <code className={codeClassName}>Resume Continuity</code> when loading that save. It does not restore the map clock or your project's actors and inventory.
            </p>
          </ApiEntry>

          <ApiEntry name="FRNPCPreparedContinuitySave">
            <p>
              Live prepared-checkpoint value returned by <code className={codeClassName}>Prepare Continuity Save</code>. Persist its token, retain the complete value in memory while writing the game save, then pass that same value to <code className={codeClassName}>Finish Continuity Save</code>.
            </p>
          </ApiEntry>

          <ApiEntry name="FRNPCContinuityOperationResult and FRNPCPrepareContinuitySaveResult">
            <p>
              Result values for continuity start/resume operations and checkpoint preparation. They expose success, active state, the returned token or prepared save, and actionable error information. Start/resume results also report when loading an older checkpoint creates a new branch.
            </p>
          </ApiEntry>

          <ApiEntry name="ERNPCContinuityState">
            <p>
              Current continuity lifecycle state, including unresolved, connecting, synchronizing, active, preparing a save, awaiting save completion, and failed.
            </p>
          </ApiEntry>

          <ApiEntry name="FInitialGameTime">
            <p>
              Project-settings value for the initial in-game date and time. It is used when no persisted world time exists or when persistent state is reset for a clean development run.
            </p>
          </ApiEntry>

          <ApiEntry name="UBaseCalendar">
            <p>
              Calendar Data Asset base class for advanced project-owned custom calendars. Most projects configure the code-backed Simple or Gregorian calendar through Project Settings; use a custom asset when the project needs a different calendar or time-conversion model.
            </p>
          </ApiEntry>

          <ApiEntry name="FGameDateTime">
            <p>
              In-game date/time value used by calendars, initial time, persisted world time, schedules, and memory timestamps.
            </p>
          </ApiEntry>

          <ApiEntry name="UGameTimeSubsystem">
            <p>
              World subsystem for the map clock. Read <code className={codeClassName}>GetDateTime()</code>, <code className={codeClassName}>GetTick()</code>, or <code className={codeClassName}>GetCalendar()</code> from C++. Map time persists independently of NPC checkpoint tokens; loading an older checkpoint does not rewind it.
            </p>
          </ApiEntry>

          <ApiEntry name="RNPCsUtilities">
            <p>
              C++ utilities including <code className={codeClassName}>SetGameWorldTime(World, Time)</code> for restoring a project-saved map time. World description settings are cached for the Unreal process; restart the editor/game after changing them. File-based integrations can call <code className={codeClassName}>LoadWorldDescription(Filepath)</code> before starting a new session to refresh its cached description. This does not update an active session.
            </p>
          </ApiEntry>
        </ApiSection>
      </div>
    </>
  );
}
