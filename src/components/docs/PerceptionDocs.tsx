import React from 'react';

export default function PerceptionDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Perception</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          Perception gives each NPC evidence about characters, objects, places, and events. Configure the NPC's senses, make important objects perceivable, and expose observable state through reflected properties, staged facts, and emitted stimuli.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Expose Current State</h3>
            <p>
              Use reflected properties or staged facts for things that are true right now, such as whether a door is locked, a shop is open, or a character is visibly injured.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Emit Events</h3>
            <p>
              Use emitted stimuli for things that happen once, such as a shout, impact, explosion, damage event, dropped object, or other momentary occurrence.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Keep Subjects Stable</h3>
            <p>
              Use <code className="bg-white/20 px-2 py-1 rounded">ABaseCharacter</code> for participating characters and add <code className="bg-white/20 px-2 py-1 rounded">Perceivable Object</code> to important non-character actors. Both provide stable identity so repeated observations can refer to the same subject.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Recommended Setup Flow</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li>Configure the NPC controller's inherited <code className="bg-white/20 px-2 py-1 rounded">AIPerception</code> component with the listener senses the NPC should use, such as Sight or Hearing.</li>
            <li>Keep Sight enabled for visual perception. The plugin configures Object Vision automatically from the same Sight settings; there is no separate Object Vision sense to configure.</li>
            <li>For character actors that should participate in plugin perception, memory, relationships, or conversation, derive from <code className="bg-white/20 px-2 py-1 rounded">ABaseCharacter</code>.</li>
            <li>For non-character actors, add one <code className="bg-white/20 px-2 py-1 rounded">Perceivable Object</code> component, enter its required label, and check its geometry and validation status as described below.</li>
            <li>Use reflected properties for simple actor state that already exists as a <code className="bg-white/20 px-2 py-1 rounded">UPROPERTY</code>.</li>
            <li>Use staged facts for runtime state that gameplay code sets, updates, and clears explicitly.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">UNPCStimulusSubsystem::EmitStimulus</code> for discrete events.</li>
            <li>Let the plugin publish public activity facts for NPCs; use your own fact keys for additional project-specific visible state.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Shared Visual Configuration</h3>
          <p>
            Configure Sight on the NPC controller's <code className="bg-white/20 px-2 py-1 rounded">AIPerception</code> component. Set the sight and lose-sight radii, peripheral half-angle, and viewpoint offsets there. Character Sight, Object Vision, and visual place discovery use the same visual configuration and listener viewpoint while keeping their own sensing behavior. Check detection by affiliation as well as range when a target is not being noticed.
          </p>
          <p className="mt-4">
            On the NPC, the <strong>Visual Perception</strong> category shows the resolved configuration and a <strong>Visual Perception Envelope</strong> preview. The solid envelope shows acquisition range; a dashed envelope shows a different retention range. This preview describes the viewing configuration, not whether a particular target is visible through its geometry and surroundings. Missing, disabled, or invalid Sight configuration prevents Object Vision and visual place discovery from supplying positive results.
          </p>
          <p className="mt-4">
            These systems still detect different things: native Sight detects participating characters, Object Vision detects opted-in objects, and Spatial Perception samples authored place and area cues. <code className="bg-white/20 px-2 py-1 rounded">ObservationIntervalSeconds</code> and <code className="bg-white/20 px-2 py-1 rounded">bIncludeVisiblePlaceCues</code> remain separate spatial settings. See <a href="#spatial-authoring" className="text-blue-400 hover:text-blue-300 transition-colors">Spatial Authoring</a> for place and area setup.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Perceivable Objects</h3>
          <p>
            Add <code className="bg-white/20 px-2 py-1 rounded">Perceivable Object</code> (<code className="bg-white/20 px-2 py-1 rounded">UPerceivableObjectComponent</code>) to an ordinary actor or actor Blueprint. Use one component for one meaningful object, such as a door, tool, container, or plant. The component provides identity and registers the object for Object Vision.
          </p>
          <ol className="list-decimal list-inside space-y-3 mt-4">
            <li>Enter a required <strong>Perceptual Label</strong>, such as "wooden chest". Add an optional <strong>Perceptual Description</strong> and <strong>Visible Traits</strong> for immediately observable appearance. Keep hidden contents, ownership, history, and gameplay effects out of these fields.</li>
            <li>Leave <strong>Perceptual Geometry Components</strong> empty for automatic geometry. Object Vision uses eligible primitive components owned directly by this actor, with valid bounds, that are registered and visible in the game. Child actors need their own object setup.</li>
            <li>If automatic geometry includes components that should not represent the object, use the advanced <strong>Perceptual Geometry Components</strong> picker to select only the intended same-actor primitives.</li>
            <li>Ensure the intended visible geometry has query collision enabled and blocks the project's Sight collision channel. Range, affiliation, and occluding geometry still determine what each NPC can see.</li>
            <li>Check <strong>Object Perception Status</strong> and <strong>Validation Errors</strong> in the component's RealisticNPCs category. Correct invalid metadata or geometry before relying on the object in play.</li>
          </ol>
          <p className="mt-4">
            Visibility considers the object's geometry rather than only its origin. A visible portion can be enough, but collision-based sampling can miss very small exposed portions. A valid component does not guarantee that every nearby NPC sees it. If geometry becomes unavailable, an otherwise-valid object stops providing visual evidence and is checked again automatically; restoring eligible geometry allows it to be perceived again without manual re-registration.
          </p>
          <p className="mt-4">
            Use the reflected properties and staged facts below for changing state, such as an open door or damaged machine, on the same actor. Perception describes what an NPC can observe; making an object perceivable does not implement opening, using, collecting, or inspecting it. Your project supplies those gameplay actions and their rules. See <a href="#item-knowledge" className="text-blue-400 hover:text-blue-300 transition-colors">Item Knowledge and Object Understanding</a> for what NPCs know about items and how they interpret encountered objects.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Reflected Properties</h3>
          <p>
            Reflected properties are the cleanest option for stable, continuously current facts that already live on an actor. Mark a supported <code className="bg-white/20 px-2 py-1 rounded">UPROPERTY</code> with <code className="bg-white/20 px-2 py-1 rounded">RNPC_Perceivable</code>, then optionally provide the fact key, importance, confidence, and observable channels.
          </p>

          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre>
              <code className="text-sm text-gray-300">{`UPROPERTY(EditAnywhere, BlueprintReadWrite, meta = (
    RNPC_Perceivable,
    RNPC_Key = "door.is_locked",
    RNPC_ObservableBy = "Sight|Internal",
    RNPC_Importance = "0.45",
    RNPC_Confidence = "1.0"
))
bool bLocked = false;`}</code>
            </pre>
          </div>

          <p className="mt-4">
            Supported reflected value types include booleans, numeric values, enums, strings, names, vectors, 2D vectors, and rotators. If <code className="bg-white/20 px-2 py-1 rounded">RNPC_Key</code> is omitted, the property name is used as the fact key.
          </p>
          <p className="mt-4">
            Set <code className="bg-white/20 px-2 py-1 rounded">RNPC_ObservableBy</code> to <code className="bg-white/20 px-2 py-1 rounded">Sight</code>, <code className="bg-white/20 px-2 py-1 rounded">Internal</code>, or both. These are the currently polled channels. If it is omitted, the fact is observable by sight and internal self-perception.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Staged Facts</h3>
          <p>
            Staged facts are runtime state facts stored on <code className="bg-white/20 px-2 py-1 rounded">UPerceivableFactsComponent</code>. Use them when the value is controlled by gameplay code, when the fact should be set and cleared explicitly, or when the state does not naturally belong as a reflected property.
          </p>
          <p className="mt-4">
            Characters already provide a Perceivable Facts component. For staged facts on an ordinary prop, add a <strong>Perceivable Facts</strong> component to the same actor as its Perceivable Object component and use that component reference in your gameplay code. In C++, include <code className="bg-white/20 px-2 py-1 rounded">PerceivableFactsComponent.h</code> for the staged fact component and value types.
          </p>

          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre>
              <code className="text-sm text-gray-300">{`UPerceivableFactsComponent* Facts = Character->GetPerceivableFactsComponent();
if (Facts)
{
    FPerceivableStagedFact Fact;
    Fact.Type = EPerceivableFactType::String;
    Fact.StringValue = TEXT("carrying firewood");
    Fact.Importance = 0.35f;
    Fact.Confidence = 1.0f;
    Fact.ObservableByMask = (int32)((uint8)ERNPCObservableBy::Sight);

    Facts->SetFact(TEXT("character.visible_status"), Fact);
}`}</code>
            </pre>
          </div>

          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">SetFact</code> to create or update the current value for a key.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">RemoveFact</code> when the fact is no longer true.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">ClearFacts</code> only when the component's authored state should be fully reset.</li>
            <li>Use emitted stimuli instead of staged facts for one-off moments that should not remain true after they happen.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Emitted Stimuli</h3>
          <p>
            Emitted stimuli are discrete event pulses sent through <code className="bg-white/20 px-2 py-1 rounded">UNPCStimulusSubsystem</code>. Use them for events that nearby or targeted NPCs should notice without treating the event as a persistent actor property.
          </p>
          <p className="mt-4">
            In C++, include <code className="bg-white/20 px-2 py-1 rounded">NPCStimulusSubsystem.h</code> for the emit spec and subsystem API.
          </p>

          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre>
              <code className="text-sm text-gray-300">{`if (UNPCStimulusSubsystem* Stimuli = World->GetSubsystem<UNPCStimulusSubsystem>())
{
    FRNPCStimulusEmitSpec Spec;
    Spec.Channel = ERNPCStimulusChannel::Hearing;
    Spec.SourceActor = BellActor;
    Spec.EventKey = TEXT("event.bell_rang");
    Spec.Range = 2500.0f;
    Spec.Strength = 0.8f;

    Spec.EventValue.Type = EPerceivableFactType::Name;
    Spec.EventValue.NameValue = TEXT("bell");
    Spec.EventValue.Importance = 0.7f;
    Spec.EventValue.Confidence = 1.0f;

    Stimuli->EmitStimulus(Spec);
}`}</code>
            </pre>
          </div>

          <p className="mt-4">
            The world-level emit API currently routes <code className="bg-white/20 px-2 py-1 rounded">Hearing</code> and <code className="bg-white/20 px-2 py-1 rounded">Damage</code> through Unreal's perception system. Use hearing for broadcast events with an origin, range, and strength. Use damage for directed events with a <code className="bg-white/20 px-2 py-1 rounded">TargetActor</code>.
          </p>
          <p className="mt-4">
            <code className="bg-white/20 px-2 py-1 rounded">EventKey</code> names what happened, while <code className="bg-white/20 px-2 py-1 rounded">EventValue</code> carries the typed payload. If no key or value is provided, the plugin supplies a channel-specific default.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Perceivable IDs</h3>
          <p>
            Stable identity lets an NPC connect repeated observations with the same person or object. <code className="bg-white/20 px-2 py-1 rounded">ABaseCharacter</code> provides character identity, and <code className="bg-white/20 px-2 py-1 rounded">Perceivable Object</code> provides object identity. Reuse that identity for the object's changing facts and events rather than assigning another ID to each observation.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li>Keep each actor's generated GUID unique. Save authored instances normally rather than copying GUIDs between different objects.</li>
            <li>For spawned objects or components added at runtime, your SaveGame code must save and restore the GUID. <code className="bg-white/20 px-2 py-1 rounded">GetObjectGuid</code> and <code className="bg-white/20 px-2 py-1 rounded">RestoreObjectGuid</code> support this; generating a GUID alone does not preserve it across sessions.</li>
            <li>Opt in meaningful objects that NPCs should perceive and reason about.</li>
            <li>Use clear fact keys so observations about the same subject remain understandable after they enter memory.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Public Activity Facts</h3>
          <p>
            The plugin automatically publishes public-facing activity facts for NPCs onto their <code className="bg-white/20 px-2 py-1 rounded">PerceivableFactsComponent</code>. Other NPCs can perceive these facts as ordinary staged state.
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">activity.state</code>
              <p className="mt-2">
                A <code className="bg-white/20 px-2 py-1 rounded">Name</code> fact with coarse public states such as <code className="bg-white/20 px-2 py-1 rounded">idle</code>, <code className="bg-white/20 px-2 py-1 rounded">executing</code>, or <code className="bg-white/20 px-2 py-1 rounded">talking</code>.
              </p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">activity.public.summary</code>
              <p className="mt-2">
                A short <code className="bg-white/20 px-2 py-1 rounded">String</code> summary of visible behavior, such as walking, talking, waiting, working, or a concrete visible action summary.
              </p>
            </div>
          </div>
          <p className="mt-4">
            Authors should not overwrite these plugin-owned keys on NPCs. If a project needs additional visible activity state, add separate fact keys with project-specific names.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Authoring Checklist</h3>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Use reflected properties for simple current state that already exists on the actor.</li>
            <li>Use staged facts for current state that gameplay code needs to set and clear directly.</li>
            <li>Use emitted stimuli for one-off events rather than leaving event facts staged as persistent state.</li>
            <li>Add <strong>Perceivable Object</strong> to important non-character actors, author only observable metadata, and check geometry, collision, and validation feedback.</li>
            <li>Configure the NPC controller's Sight settings and keep them enabled for character, object, and place visual perception.</li>
            <li>Keep fact keys stable, literal, and namespaced by subject or system, such as <code className="bg-white/20 px-2 py-1 rounded">door.is_locked</code> or <code className="bg-white/20 px-2 py-1 rounded">shop.is_open</code>.</li>
            <li>Do not use perceivable facts to expose hidden intent or private implementation state that an NPC could not plausibly observe.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
