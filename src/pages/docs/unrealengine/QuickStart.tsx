import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnrealDocsNavigation from '../../../components/UnrealDocsNavigation';

export default function QuickStart() {
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
              Quick Start Guide
            </h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
          </div>

          <div className="space-y-20">
            <div id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">1. Install the Plugin</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Follow the <Link to="/docs/unrealengine/setup" className="text-blue-400 hover:text-blue-300 transition-colors">setup instructions</Link> to install and enable the plugin in your project. If your project uses plugin classes from C++, include <code className="bg-white/20 px-2 py-1 rounded">RealisticNPCs</code> in your module dependencies.
                </p>
              </div>
            </div>

            <div id="project-settings" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">2. Configure the Daemon and Project</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Open <strong>Window -&gt; RealisticNPCs Daemon Config</strong>. This panel is the author-facing workflow for configuring the services and models used by RealisticNPCs.
                </p>

                <h3 className="text-xl font-semibold text-white mt-8">Daemon Configuration</h3>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>Configure the initial service row with its service ID and endpoint. Use <strong>Add Service</strong> only when you need an additional service.</li>
                  <li>Use <strong>Set Key</strong> to store the service's API key for the current provider origin, then use <strong>Check Stored Key</strong> to confirm that it is available for that origin.</li>
                  <li>Assign models for the required <strong>Default Light</strong>, <strong>Default Heavy</strong>, and <strong>Embedding</strong> targets.</li>
                  <li>Select <strong>Save Profile</strong>, then <strong>Validate with Daemon</strong>.</li>
                </ol>
                <p>
                  For a first test, use responsive instant-response models. Reasoning models can be experimented with later, but the plugin is not yet tuned around their longer response latency and behavior may feel less fluid.
                </p>
                <p>
                  See the <Link to="/docs/unrealengine/configuration" className="text-blue-400 hover:text-blue-300 transition-colors">configuration guide</Link> for optional usage-target overrides and profile management.
                </p>

                <h3 className="text-xl font-semibold text-white mt-8">Project Settings</h3>
                <p>
                  Open <strong>Project Settings -&gt; Plugins -&gt; RealisticNPCs</strong> to configure the world context and time settings used by your project.
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2">
                  <li>Set <code className="bg-white/20 px-2 py-1 rounded">InlineWorldDescription</code>, or set <code className="bg-white/20 px-2 py-1 rounded">WorldDescriptionFile</code> to a text file. Inline text takes precedence when both are set. Restart the editor after changing the world description.</li>
                  <li>Select Built-in Simple, Built-in Gregorian, or Custom Calendar Asset, configure the fields shown, and choose the initial time. Restart PIE after calendar changes; see the <Link to="/docs/unrealengine/configuration" className="text-blue-400 hover:text-blue-300 transition-colors">configuration guide</Link> for details.</li>
                  <li>Leave <code className="bg-white/20 px-2 py-1 rounded">bResetPersistentStateOnStartup</code> disabled unless you need a clean-slate test run.</li>
                </ul>
              </div>
            </div>

            <div id="authored-space" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">3. Create a Minimal Authored Space</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  NPC behavior works best when meaningful places are authored explicitly. For a first test, create one place where the NPC can live, work, or wait.
                </p>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>For a standalone place, add a <code className="bg-white/20 px-2 py-1 rounded">Spatial Place Anchor</code> actor, set a clear <code className="bg-white/20 px-2 py-1 rounded">PlaceName</code>, then set <code className="bg-white/20 px-2 py-1 rounded">RegionMode</code> and sphere or box bounds if NPCs should move within that place.</li>
                  <li>For an existing actor that represents a place, add a <code className="bg-white/20 px-2 py-1 rounded">Semantic Place</code> component, set a clear <code className="bg-white/20 px-2 py-1 rounded">PlaceName</code>, and configure containment bounds if NPCs should know when they are inside it.</li>
                  <li>Add <code className="bg-white/20 px-2 py-1 rounded">Spatial Area</code> components only for meaningful sub-areas, such as a counter, kitchen, stall, porch, or work spot.</li>
                  <li>If the NPC should travel, provide walkable ground and a <code className="bg-white/20 px-2 py-1 rounded">Nav Mesh Bounds Volume</code> covering the NPC and its destination. Check that navigation connects the intended route.</li>
                  <li>For the first run, skip packet assets unless you already need reusable spatial knowledge for multiple places.</li>
                </ol>
                <p>
                  For richer layouts, use the <Link to="/docs/unrealengine/authoring-guide#spatial-authoring" className="text-blue-400 hover:text-blue-300 transition-colors">Spatial Authoring</Link> section.
                </p>
              </div>
            </div>

            <div id="npc-controller" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">4. Create the NPC and Controller</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>Create an NPC class that derives from <code className="bg-white/20 px-2 py-1 rounded">ABaseNPC</code>.</li>
                  <li>Create an AI controller class that derives from <code className="bg-white/20 px-2 py-1 rounded">ABaseNPCController</code>.</li>
                  <li>Assign the controller class as the NPC's AI controller and configure possession so it controls the placed NPC when play starts.</li>
                  <li>Configure the controller's <code className="bg-white/20 px-2 py-1 rounded">AIPerception</code> component with Sight and Hearing. Set suitable sight and hearing ranges. Under <strong>Detection by Affiliation</strong>, enable the character affiliations that both Sight and Hearing should detect. Enable <strong>Detect Neutrals</strong> for characters without team customization. Character Sight, object visibility, and visual place discovery share the Sight configuration; see <Link to="/docs/unrealengine/authoring-guide#perception" className="text-blue-400 hover:text-blue-300 transition-colors">Perception</Link>.</li>
                  <li>On the NPC, set <code className="bg-white/20 px-2 py-1 rounded">CharacterName</code>, <code className="bg-white/20 px-2 py-1 rounded">Background</code>, <code className="bg-white/20 px-2 py-1 rounded">ShortTermGoal</code>, and <code className="bg-white/20 px-2 py-1 rounded">SelfAssessment</code>.</li>
                  <li>Add your authored place to the NPC's starting spatial knowledge with <code className="bg-white/20 px-2 py-1 rounded">InitialPlaceOverrides</code>, or use a seed preset if you already have one.</li>
                  <li>Enable <code className="bg-white/20 px-2 py-1 rounded">bNPCEnabled</code>. Enable <code className="bg-white/20 px-2 py-1 rounded">bLogBehavior</code> while testing one or two NPCs.</li>
                </ol>
              </div>
            </div>

            <div id="actions" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">5. Register a Gameplay Action</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Custom actions are concrete gameplay primitives registered by your controller subclass. For a first NPC, register one simple duration action and enable it through an action-set asset.
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 overflow-x-auto">
                  <pre>
                    <code className="text-sm text-gray-300">{`// ShopkeeperNPCController.h
#pragma once

#include "BaseNPCController.h"
#include "ShopkeeperNPCController.generated.h"

UCLASS()
class YOURGAME_API AShopkeeperNPCController : public ABaseNPCController
{
    GENERATED_BODY()

protected:
    virtual void RegisterNPCActions(FNPCActionRegistrar& Registrar) override;

private:
    void TendShop();
};`}</code>
                  </pre>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 overflow-x-auto">
                  <pre>
                    <code className="text-sm text-gray-300">{`// ShopkeeperNPCController.cpp
#include "ShopkeeperNPCController.h"
#include "ActionTypes.h"

void AShopkeeperNPCController::RegisterNPCActions(FNPCActionRegistrar& Registrar)
{
    FNPCActionDefinition Definition;
    Definition.ActionId = TEXT("tend_shop");
    Definition.Description = TEXT("stay at the shop and tend to ordinary shopkeeping work.");

    Registrar.RegisterDurationAction(Definition, this, &AShopkeeperNPCController::TendShop);
}

void AShopkeeperNPCController::TendShop()
{
    // Start animation, ambient interaction, VFX, or gameplay state here.
    // Duration actions are completed by the plugin's duration timer.
}`}</code>
                  </pre>
                </div>

                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>Create an <code className="bg-white/20 px-2 py-1 rounded">NPC Action Set</code> asset.</li>
                  <li>Add <code className="bg-white/20 px-2 py-1 rounded">tend_shop</code> to the asset's <code className="bg-white/20 px-2 py-1 rounded">ActionIds</code>.</li>
                  <li>Assign the action-set asset to the NPC's <code className="bg-white/20 px-2 py-1 rounded">ActionSetPresets</code>.</li>
                  <li>Do not register a generic movement action. The plugin owns ordinary grounded movement through <code className="bg-white/20 px-2 py-1 rounded">move_to_location</code>.</li>
                </ol>

                <p>
                  Use <code className="bg-white/20 px-2 py-1 rounded">RegisterInstantAction</code> for immediate work and <code className="bg-white/20 px-2 py-1 rounded">RegisterUntilCompleteAction</code> when gameplay must report completion. For parameters, asynchronous work, and stopping animations or other ongoing work when an action ends, follow <Link to="/docs/unrealengine/authoring-guide#actions-and-movement" className="text-blue-400 hover:text-blue-300 transition-colors">Actions and Movement</Link>.
                </p>
              </div>
            </div>

            <div id="optional-object-knowledge" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">6. Optional: Add an Object and Starting Knowledge</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Place a shop prop, such as a jar of herbs, where the NPC can see it. This short exercise connects an observable object with knowledge the shopkeeper can use; each is authored separately.
                </p>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>Add a <strong>Perceivable Object</strong> component to the prop. Set <strong>Perceptual Label</strong> to a visible description such as “jar of green leaves,” and keep its optional description and traits observable. Do not reveal hidden contents or medicinal effects through those fields.</li>
                  <li>Use a mesh with query-enabled collision that blocks the project's Sight collision channel. Start with automatic geometry selection and inspect <strong>Object Perception Status</strong> and <strong>Validation Errors</strong>.</li>
                  <li>Create an <strong>Item Knowledge Library</strong> from an existing item DataTable or Data Asset. Map a stable item ID and one descriptive fact, such as the herb's authored use. The <Link to="/docs/unrealengine/authoring-guide#item-knowledge" className="text-blue-400 hover:text-blue-300 transition-colors">item knowledge workflow</Link> explains source selection and mapping.</li>
                  <li>Choose <strong>Use in Current Level</strong> from the library's Content Browser menu. On the NPC, use <strong>Starting Item Knowledge → Additional Facts</strong> to select the fact and confirm it in the preview. Leave other facts unassigned.</li>
                </ol>
                <p>
                  The NPC can draw on its knowledge when interpreting the prop, but recognition can remain uncertain. You still implement actions such as selling or using the herbs. This exercise requires no extra vision provider. For geometry and changing object state, continue with <Link to="/docs/unrealengine/authoring-guide#perception" className="text-blue-400 hover:text-blue-300 transition-colors">Perception</Link>.
                </p>
              </div>
            </div>

            <div id="optional-conversation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">7. Optional: Speak to the NPC</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Use an <code className="bg-white/20 px-2 py-1 rounded">ABaseCharacter</code> subclass for your player or scripted customer. NPCs already inherit this base. The following Blueprint or C++ calls express the externally controlled customer's choices; NPCs choose their own contributions.
                </p>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>Before submitting speech, bind <code className="bg-white/20 px-2 py-1 rounded">OnSpeechReceived</code> for what the customer hears, <code className="bg-white/20 px-2 py-1 rounded">OnSpeechOutcome</code> for the customer's delivery results, and <code className="bg-white/20 px-2 py-1 rounded">OnCommunicationFailure</code> for later errors. Also bind <code className="bg-white/20 px-2 py-1 rounded">OnParticipationChanged</code> before requesting participation.</li>
                  <li>On the customer, call <code className="bg-white/20 px-2 py-1 rounded">SubmitSpeech</code> with a short greeting, a <strong>Directed</strong> audience containing the shopkeeper, and <strong>Ordinary</strong> strength. Leave <code className="bg-white/20 px-2 py-1 rounded">ContextId</code> empty for this example. Set <code className="bg-white/20 px-2 py-1 rounded">bEnterConversation</code> to true to request participation with the greeting.</li>
                  <li>Check the return value and <code className="bg-white/20 px-2 py-1 rounded">OutError</code>. A true return means the request was admitted; use the events for actual results.</li>
                  <li>Read <code className="bg-white/20 px-2 py-1 rounded">GetConversationState</code> for pending or accepted participation. Use <code className="bg-white/20 px-2 py-1 rounded">DeclareParticipation</code> to withdraw with the current state's reference when your customer chooses to leave.</li>
                </ol>
                <p>
                  Hearing a greeting does not require the shopkeeper to reply or join. Your game controls input, subtitles, audio, and animation. See <Link to="/docs/unrealengine/authoring-guide#open-conversation" className="text-blue-400 hover:text-blue-300 transition-colors">Open Conversation</Link> for complete event wiring, incoming offers, hearing setup for externally controlled characters, and leaving pending or accepted participation.
                </p>
              </div>
            </div>

            <div id="testing" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">8. Test the Setup</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>Place the authored spatial actors and the NPC in the level.</li>
                  <li>Run <code className="bg-white/20 px-2 py-1 rounded">ValidateInitialPacketAssignments</code> on the NPC if you assigned spatial presets or packet overrides.</li>
                  <li>Run <code className="bg-white/20 px-2 py-1 rounded">ValidateEnabledActions</code> after assigning the action set and controller class.</li>
                  <li>If you added a prop or item knowledge, resolve its validation errors and confirm the NPC's included facts before starting a new session.</li>
                  <li>Start PIE and watch the behavior log if <code className="bg-white/20 px-2 py-1 rounded">bLogBehavior</code> is enabled.</li>
                </ol>

                <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Expected First Result</h3>
                  <p>
                    The enabled NPC should begin pursuing its authored goal, use its starting place knowledge, and choose among its available actions. With the optional exercises, it can notice the prop and draw on its assigned knowledge; the customer can submit speech and receive delivery and participation updates. The NPC's circumstances influence what it does or says, so no particular action, identification, or reply is guaranteed.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-white mt-8">Debugging Tips</h3>
                <ul className="list-disc list-inside pl-4 space-y-2">
                  <li>If no behavior starts, check the Unreal Output Log for daemon startup, handshake, and session-synchronization messages or an actionable startup failure.</li>
                  <li>Confirm that the daemon profile was saved and validated, each referenced service has a stored key for its configured provider origin, and all three required usage targets are assigned.</li>
                  <li>Confirm the NPC is enabled and possessed by the intended <code className="bg-white/20 px-2 py-1 rounded">ABaseNPCController</code> subclass.</li>
                  <li>If a custom action is never used, confirm its action id is registered by the controller and enabled through the NPC's action set or additions.</li>
                  <li>If the prop is not seen, check enabled Sight, range, occlusion, and the object's collision and validation feedback. The visual preview shows the viewing configuration, not guaranteed visibility.</li>
                  <li>If starting knowledge changes are absent, confirm the library is active in the level and start a new session. Existing initialized or restored NPCs retain their personal knowledge; see <Link to="/docs/unrealengine/authoring-guide#memory-and-persistence" className="text-blue-400 hover:text-blue-300 transition-colors">Memory, Continuity, and Persistence</Link> before resetting saved state for a fresh test.</li>
                  <li>If speech is not heard, check the listener's Hearing configuration and range, then inspect delivery and communication-failure callbacks. Sight is not required for hearing, and a heard message need not receive a reply.</li>
                  <li>If memory retrieval does not initialize, confirm that the required <strong>Embedding</strong> target selects a valid model and that its service key is stored for the configured provider origin.</li>
                </ul>

                <p>
                  After this minimal loop works, continue with the <Link to="/docs/unrealengine/authoring-guide" className="text-blue-400 hover:text-blue-300 transition-colors">Authoring Guide</Link> for action parameters, richer places and objects, item knowledge, conversation integration, memory persistence, and the API reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
