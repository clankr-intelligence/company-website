import React from 'react';

const codeClassName = 'bg-white/20 px-2 py-1 rounded';

export default function ActionsAndMovementDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Actions and Movement</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          Actions are gameplay capabilities that NPCs can choose while pursuing their goals. Register them on an <code className={codeClassName}>ABaseNPCController</code> subclass, then enable the appropriate actions for each NPC through action sets. Unreal resolves the supplied targets; your handler checks the game's remaining conditions, performs the effect, and reports the result.
        </p>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Register a Gameplay Action</h3>
          <p>
            Override <code className={codeClassName}>RegisterNPCActions</code>. An <code className={codeClassName}>FNPCActionDefinition</code> supplies a stable <code className={codeClassName}>ActionId</code>, a concrete <code className={codeClassName}>Description</code>, and parameter names, descriptions, and constraints. List parameter metadata in the same order as the handler's authored parameters. The C++ signature determines their types; the registration method determines how the action finishes.
          </p>
          <p className="mt-4">
            This example belongs in your controller subclass's implementation file. It makes a light on a perceivable object switchable and reports failure if that object no longer supplies a light. Add any project-specific reach, permission, or resource checks before applying the effect.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre><code className="text-sm text-gray-300">{`#include "ShopkeeperNPCController.h"
#include "NPCActionRegistry.h"
#include "Components/LightComponent.h"
#include "GameFramework/Actor.h"

void AShopkeeperNPCController::RegisterNPCActions(FNPCActionRegistrar& Registrar)
{
    Super::RegisterNPCActions(Registrar);

    const FNPCActionDefinition SetLamp(
        TEXT("set_lamp"),
        TEXT("Switch a nearby lamp on or off."),
        {
            { TEXT("lamp"), TEXT("The lamp to operate.") },
            { TEXT("enabled"), TEXT("True to turn it on; false to turn it off.") }
        });

    Registrar.RegisterUntilCompleteAction(SetLamp,
        [](FNPCActionAttempt Attempt, FRNPCObjectRef Lamp, bool bEnabled)
        {
            AActor* Actor = Lamp.Get();
            ULightComponent* Light = IsValid(Actor)
                ? Actor->FindComponentByClass<ULightComponent>() : nullptr;
            if (!IsValid(Light))
            {
                Attempt.Fail(TEXT("The lamp is no longer available."));
                return;
            }

            Light->SetVisibility(bEnabled);
            Attempt.Succeed();
        });
}`}</code></pre>
          </div>
          <p className="mt-4">
            Keep action declarations independent of spawned actors and live-world state; inspect those only when the handler executes. Making an object perceivable does not implement its gameplay actions automatically.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Choose Parameter Types</h3>
          <p>
            Handlers return <code className={codeClassName}>void</code>. Use these C++ types for authored inputs, passed by value or a supported const reference. Wrap a type in <code className={codeClassName}>TOptional&lt;T&gt;</code> when the action can run without that value; other parameters are required.
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-white/20"><th className="p-3 text-white">C++ type</th><th className="p-3 text-white">Use</th></tr></thead>
              <tbody>
                <tr className="border-b border-white/10"><td className="p-3"><code>FString</code></td><td className="p-3">Text.</td></tr>
                <tr className="border-b border-white/10"><td className="p-3"><code>bool</code></td><td className="p-3">A true or false choice.</td></tr>
                <tr className="border-b border-white/10"><td className="p-3"><code>int32</code>, <code>float</code></td><td className="p-3">Whole or fractional numbers, with authored bounds when needed.</td></tr>
                <tr className="border-b border-white/10"><td className="p-3"><code>FName</code></td><td className="p-3">One of the parameter's authored allowed choices.</td></tr>
                <tr className="border-b border-white/10"><td className="p-3"><code>FCharacterRef</code></td><td className="p-3">A live character target.</td></tr>
                <tr className="border-b border-white/10"><td className="p-3"><code>FRNPCObjectRef</code></td><td className="p-3">A live object target.</td></tr>
                <tr className="border-b border-white/10"><td className="p-3"><code>FEntityRef</code></td><td className="p-3">A live target that can be either a character or an object.</td></tr>
                <tr><td className="p-3"><code>FLocationRef</code></td><td className="p-3">A spatial reference; movement needs a grounded destination.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Use <code className={codeClassName}>FNPCActionParameterDefinition::Plain</code> for a name and description, <code className={codeClassName}>Range</code>, <code className={codeClassName}>Minimum</code>, or <code className={codeClassName}>Maximum</code> for numeric constraints, and <code className={codeClassName}>Choices</code> for an <code className={codeClassName}>FName</code> parameter's allowed values. Keep names stable and descriptions specific to the effect the handler actually performs.
          </p>
          <p className="mt-4">
            Character and object actions require current physical grounding. Remembering a person, hearing speech, or joining a conversation does not by itself make that entity available for physical interaction. Recheck a reference's <code className={codeClassName}>Get()</code> result immediately before using its actor, especially after asynchronous work. A character reference's <code className={codeClassName}>IsValid()</code> checks identity alone. Your game still owns reach, permissions, inventory, collision, and other action-specific rules.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Choose Completion and Cleanup</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>RegisterInstantAction</code>
              <p className="mt-2">
                Use for synchronous work that succeeds when its handler returns. The handler takes only authored parameters and the plugin completes it automatically. Use an attempt-based handler when gameplay must report failure.
              </p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>RegisterUntilCompleteAction</code>
              <p className="mt-2">
                Use when gameplay decides the result. The first handler parameter is <code className={codeClassName}>FNPCActionAttempt</code> passed by value, followed by the authored parameters. Call <code className={codeClassName}>Succeed()</code>, <code className={codeClassName}>Fail(reason)</code>, or <code className={codeClassName}>Cancel(reason)</code> on that attempt when the work ends.
              </p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>RegisterDurationAction</code>
              <p className="mt-2">
                Use for ongoing activity such as working, resting, or watching. The NPC's behavior chooses the duration; your handler starts the activity and the plugin's timer completes it. A handler may also accept a leading <code className={codeClassName}>FNPCActionAttempt</code> by value to finish early or report failure while retaining timer completion.
              </p>
            </div>
          </div>
          <p className="mt-4">
            For asynchronous work, capture the supplied attempt by value and request completion on the game thread. <code className={codeClassName}>IsCurrent()</code> lets a callback check that its action still owns the work before applying an effect. A stale or repeated completion request returns false and cannot complete a newer action; it does not undo gameplay effects your callback already applied.
          </p>
          <p className="mt-4">
            Duration and until-complete registrations accept an optional cancellation callable after the action callable. It receives the same authored parameters, without <code className={codeClassName}>FNPCActionAttempt</code>. Use it to stop the action's timers, animation, or other ongoing gameplay work on interruption or cancellation. This callback does not run for ordinary success or failure. <code className={codeClassName}>OnNPCActionFinished</code> remains the controller hook for common finish cleanup; keep shared cleanup safe if both paths use it.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Enable Actions for Each NPC</h3>
          <p>
            Create a <code className={codeClassName}>UNPCActionSetAsset</code> containing custom action IDs and assign it through the NPC's <code className={codeClassName}>ActionSetPresets</code>. Use <code className={codeClassName}>AddedActionIds</code> for individual additions and <code className={codeClassName}>RemovedActionIds</code> for exceptions. The assigned controller must register every enabled custom action's implementation.
          </p>
          <p className="mt-4">
            Run <code className={codeClassName}>ValidateEnabledActions</code> after changing action sets or controller classes. Enabling an ID grants access to an implemented action; it does not create the action or grant knowledge about its targets.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Movement and Presentation</h3>
          <p>
            The plugin supplies ordinary travel through <code className={codeClassName}>move_to_location</code>. Use grounded spatial authoring rather than adding a duplicate generic movement action. Built-in movement and conversation mechanics do not need entries in custom action sets; see <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#open-conversation">Open Conversation</a> for speech and participation integration.
          </p>
          <p className="mt-4">
            Custom controller gameplay can use <code className={codeClassName}>MoveToLocation</code>, <code className={codeClassName}>MoveToCharacter</code>, and <code className={codeClassName}>MoveToActorTarget</code>. A character target must already have a valid current reference; these helpers do not discover an unseen character for the NPC.
          </p>
          <p className="mt-4">
            Check immediate Boolean results where provided; <code className={codeClassName}>true</code> is not confirmation of arrival. <code className={codeClassName}>MoveToActorTarget</code> has no return result. The <code className={codeClassName}>PostMoveLogic</code> continuations on actor movement and the protected location and character overloads run only after success. Use <code className={codeClassName}>MoveToLocationWithOutcome</code> for a location callback carrying success or failure and a reason. Also handle <code className={codeClassName}>Cancelled</code> lifecycle events; a cancellation need not invoke that callback. Character and actor movement use lifecycle events to report failure and cancellation.
          </p>
          <p className="mt-4">
            When movement is part of an until-complete action, retain its <code className={codeClassName}>FNPCActionAttempt</code> and settle it on immediate rejection, failed movement, or cancellation as well as successful work. Match lifecycle events to your move using <code className={codeClassName}>MoveId</code>. A callback can run before the movement helper returns, so check <code className={codeClassName}>IsCurrent()</code> before applying effects or settling from another result path. Waiting only for a success continuation can leave the action unfinished after a failed move.
          </p>
          <p className="mt-4">
            Override the Blueprint-native <code className={codeClassName}>OnNPCMoveLifecycleEvent</code> to coordinate animation, sound, or UI with movement. Its <code className={codeClassName}>FNPCMoveLifecycleEvent</code> describes the move, target, and progress.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li><code className={codeClassName}>Started</code> and <code className={codeClassName}>TargetResolved</code> identify movement startup.</li>
            <li><code className={codeClassName}>WaypointStarted</code> and <code className={codeClassName}>WaypointCompleted</code> describe route progress.</li>
            <li><code className={codeClassName}>Succeeded</code>, <code className={codeClassName}>Failed</code>, and <code className={codeClassName}>Cancelled</code> identify the final result.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
