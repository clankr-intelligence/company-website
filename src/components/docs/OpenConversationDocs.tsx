import React from 'react';

const codeClassName = 'bg-white/20 px-2 py-1 rounded';

export default function OpenConversationDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Open Conversation</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          Characters can speak to one person, address a group, make public remarks, or talk to themselves. Each listener receives only what they can hear. Participation is a separate choice: hearing a remark does not join a conversation, and joining does not reveal unheard words. NPCs decide whether to approach, contribute, listen, defer, or leave using their authored character and experience.
        </p>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Connect a Player or Scripted Character</h3>
          <ol className="list-decimal list-inside pl-4 space-y-3">
            <li>Derive the externally controlled character from <code className={codeClassName}>ABaseCharacter</code>. Autonomous NPCs use <code className={codeClassName}>ABaseNPC</code> and their configured controller.</li>
            <li>Bind the character's speech, contact, participation, and failure events before sending input. Blueprint exposes these as assignable events; C++ uses their dynamic multicast delegates with matching <code className={codeClassName}>UFUNCTION</code> handlers.</li>
            <li>Use <code className={codeClassName}>SubmitSpeech</code> for the external character's words and <code className={codeClassName}>DeclareParticipation</code> for its entry, acceptance, decline, or departure. Call these entry points on the game thread.</li>
            <li>Check each call's Boolean result and <code className={codeClassName}>OutError</code>, then use events and <code className={codeClassName}>GetConversationState()</code> to update your interface.</li>
          </ol>
          <p className="mt-4">
            A successful call means the input was admitted locally. It does not guarantee anyone heard it, accepted participation, or will reply. Handle later operational errors through <code className={codeClassName}>OnCommunicationFailure</code>. These entry points express the externally controlled character's choices; they cannot make an autonomous NPC speak particular words or accept an invitation.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Submit Speech</h3>
          <p>
            Build an <code className={codeClassName}>FRNPCSpeechAudience</code> and choose its <code className={codeClassName}>Kind</code>:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li><code className={codeClassName}>Directed</code>: put one or more unique, available characters from the same world in <code className={codeClassName}>Addressees</code>. Do not include the speaker.</li>
            <li><code className={codeClassName}>Open</code>: a public remark without named addressees.</li>
            <li><code className={codeClassName}>SelfDirected</code>: audible self-talk without external addressees.</li>
          </ul>
          <p className="mt-4">
            Choose <code className={codeClassName}>Quiet</code>, <code className={codeClassName}>Ordinary</code>, or <code className={codeClassName}>Projected</code> delivery strength. Intended address does not guarantee hearing; a directed remark can also be overheard. Text must be nonblank. There is no dedicated conversation character cap, but transport and configured model-provider limits still apply. An optional <code className={codeClassName}>ContextId</code> groups speech for your integration; it does not create participation.
          </p>
          <p className="mt-4">
            For a first directed message that also expresses willingness to converse, pass <code className={codeClassName}>bEnterConversation=true</code>. No earlier invitation is required. Send ordinary replies and incidental remarks without that option when no new entry is intended. This C++ helper uses the same inputs as the Blueprint node; its caller should display <code className={codeClassName}>OutError</code> if it returns false.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre><code className="text-sm text-gray-300">{`#include "BaseCharacter.h"

bool RequestConversation(ABaseCharacter* Player, ABaseCharacter* Other,
    FString& OutUtteranceId, FString& OutError)
{
    if (!IsValid(Player) || !IsValid(Other) || Player == Other)
    {
        OutError = TEXT("Choose another available character.");
        return false;
    }

    FRNPCSpeechAudience Audience;
    Audience.Kind = ERNPCSpeechAudienceKind::Directed;
    Audience.Addressees.Add(Other);

    return Player->SubmitSpeech(TEXT("Can we talk?"), Audience,
        ERNPCSpeechDeliveryStrength::Ordinary, FString(),
        OutUtteranceId, OutError, true);
}`}</code></pre>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Enter, Answer an Offer, or Leave</h3>
          <p>
            <code className={codeClassName}>DeclareParticipation</code> takes an <code className={codeClassName}>FRNPCParticipationDeclaration</code>. To request entry without speaking, set <code className={codeClassName}>Kind</code> to <code className={codeClassName}>Enter</code> and fill <code className={codeClassName}>Counterparts</code>. For an incoming offer, let your UI accept or decline asynchronously, then return that offer's <code className={codeClassName}>Reference</code>:
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre><code className="text-sm text-gray-300">{`bool AnswerContactOffer(ABaseCharacter* Player,
    const FRNPCContactOffer& Offer, bool bAccept,
    FString& OutRequestId, FString& OutError)
{
    if (!IsValid(Player))
    {
        OutError = TEXT("The player character is unavailable.");
        return false;
    }

    FRNPCParticipationDeclaration Answer;
    Answer.Kind = bAccept ? ERNPCParticipationDeclarationKind::Enter
                         : ERNPCParticipationDeclarationKind::Decline;
    Answer.Reference = Offer.Reference;
    return Player->DeclareParticipation(Answer, OutRequestId, OutError);
}`}</code></pre>
          </div>
          <p className="mt-4">
            Read <code className={codeClassName}>GetConversationState()</code> before presenting accepted participation or sending a withdrawal. <code className={codeClassName}>bAvailable=false</code> means current state is unavailable, not that the character chose to leave. <code className={codeClassName}>bEntryPending</code> means entry is awaiting acceptance; <code className={codeClassName}>bParticipating</code> means participation is accepted. The state also provides current <code className={codeClassName}>Offers</code> and <code className={codeClassName}>Counterparts</code>.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 mt-4 overflow-x-auto">
            <pre><code className="text-sm text-gray-300">{`bool LeaveConversation(ABaseCharacter* Player,
    FString& OutRequestId, FString& OutError)
{
    if (!IsValid(Player))
    {
        OutError = TEXT("The player character is unavailable.");
        return false;
    }

    const FRNPCConversationState State = Player->GetConversationState();
    if (!State.bAvailable || (!State.bParticipating && !State.bEntryPending))
    {
        OutError = TEXT("No current participation is available to withdraw.");
        return false;
    }

    FRNPCParticipationDeclaration Leave;
    Leave.Kind = ERNPCParticipationDeclarationKind::Withdraw;
    Leave.Reference = State.bParticipating ? State.Reference : State.PendingReference;
    return Player->DeclareParticipation(Leave, OutRequestId, OutError);
}`}</code></pre>
          </div>
          <p className="mt-4">
            Withdrawal leaves this character's participation or cancels its pending entry; it does not end everyone else's exchange. Copy references from the current offer or state and treat them as temporary handles. Do not construct them, save them, or reuse them after loading a save or replacing the character. Refresh from current state when availability returns.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Bind Speech and Participation Events</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>OnSpeechOutcome(FRNPCSpeechOutcome)</code>
              <p className="mt-2">The speaker's result. Use <code className={codeClassName}>Status</code> and <code className={codeClassName}>Reason</code> for feedback. A successful outcome carries the complete <code className={codeClassName}>DeliveredText</code>; failed or cancelled outcomes have no delivered text. <code className={codeClassName}>Speech.UtteranceId</code> associates the result with the submitted message.</p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>OnSpeechReceived(FRNPCSpeechReception)</code>
              <p className="mt-2">This character's actual reception. <code className={codeClassName}>Intelligible</code> carries the whole message in <code className={codeClassName}>Text</code>; <code className={codeClassName}>DetectedOnly</code> has no words. A character outside detection receives no event. Build a listener's transcript from these events rather than every speaker's outcome.</p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>OnContactOffered(FRNPCContactOffer)</code>
              <p className="mt-2">An invitation for your external character to consider. Present your own choice, accept under your gameplay convention, or decline with <code className={codeClassName}>DeclareParticipation</code>.</p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>OnParticipationChanged(FRNPCConversationParticipation)</code>
              <p className="mt-2">A pending, joined, withdrew, offer-closed, resynchronized, unavailable, or pending-closed notice. Current state is updated before the callback. Read it to refresh UI; <code className={codeClassName}>PendingClosed</code> can accompany acceptance and does not mean accepted participation was withdrawn.</p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className={codeClassName}>OnCommunicationFailure(FRNPCCommunicationFailure)</code>
              <p className="mt-2">An operational failure or rejected participation request, with <code className={codeClassName}>RequestId</code> and <code className={codeClassName}>Reason</code>. It is not a social judgment or a promise that every message receives a reply.</p>
            </div>
          </div>
          <p className="mt-4">
            A reception's <code className={codeClassName}>Speaker</code> may be null: hearing words does not always identify who spoke. <code className={codeClassName}>SourceRef</code> is an opaque reference for this reception, not a stable speaker identity or an actor to look up. Optional <code className={codeClassName}>Localization</code> is a perceived sound point, not proof of identity or a live tracking target. Contact and participation actor handles must not be used to invent a reception's missing speaker.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Own the Presentation</h3>
          <p>
            Your game controls dialogue UI, text entry, player movement, cameras, facing, animation, and audio. The plugin does not require a modal dialogue panel or freeze player controls. Use a successful speaker outcome to trigger a talking gesture or audio, and personal reception to show what a listener heard. Each message is delivered as a whole; animation or audio duration does not delay its delivery, and closing a panel cannot retract words already heard.
          </p>
          <p className="mt-4">
            NPCs pause incompatible work or movement when they enact stationary conversational attention. For presentation, read <code className={codeClassName}>ABaseNPC::GetPhysicalAttentionState()</code> on the game thread. Participation and physical readiness answer different questions:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li><code className={codeClassName}>OrdinaryActivity</code>: no stationary attention hold is enacted.</li>
            <li><code className={codeClassName}>YieldPending</code>: cleanup of incompatible work is still underway.</li>
            <li><code className={codeClassName}>ProvisionalAttention</code> or <code className={codeClassName}>RetainedAttention</code>: stationary availability has been enacted.</li>
            <li><code className={codeClassName}>Unavailable</code>: the integration cannot currently provide reliable state; do not interpret this as a social departure.</li>
          </ul>
          <p className="mt-4">
            This query supplies neither a facing target nor an instruction to use a particular pose. Keep presentation under your game's control. NPCs can also learn from intelligible speech while listening silently; that learning runs in the background and may not be reflected in an immediate reply.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Configure Hearing and Physical Conditions</h3>
          <p>
            Speech hearing is independent of current Sight. The default model uses the character's existing Unreal Hearing configuration, preferring the controller's designated AI Perception component. A character-side Hearing configuration can serve a controller that only has Sight. Keep the hearing configuration unambiguous; a disabled or invalid configured sense does not fall back to default hearing. With no Hearing configuration, the default range is 1000 Unreal units for both players and NPCs.
          </p>
          <p className="mt-4">
            When using a Hearing configuration, set its <strong>Detection by Affiliation</strong> to include the characters who should be heard. Enable <strong>Detect Neutrals</strong> for characters without team customization, and include friendly or enemy characters as needed. Configure Hearing separately from Sight; speech from an excluded affiliation is not detected even within hearing range.
          </p>
          <p className="mt-4">
            Quiet speech reduces hearing range, while projected speech extends it. Visibility-channel obstruction and environmental masking can make detected speech unintelligible. Configure hearing range and collision for your world scale; this is a coarse physical model, not acoustic propagation simulation.
          </p>
          <p className="mt-4">
            Override <code className={codeClassName}>GetSpeechPhysicalConditions</code> in Blueprint or C++ when gameplay changes <code className={codeClassName}>bCanSpeak</code>, <code className={codeClassName}>bCanHear</code>, or <code className={codeClassName}>LocalMasking</code> from 0 to 1. Defaults permit speaking and hearing with zero masking. Use the hook for represented physical conditions, not politeness or willingness to engage.
          </p>
          <p className="mt-4">
            For custom acoustics, override <code className={codeClassName}>EvaluateSpeechReception(Emitter, Strength, LocalMasking)</code> on the listener. Return an <code className={codeClassName}>FRNPCSpeechReceptionEvaluation</code> with <code className={codeClassName}>NotDetected</code>, <code className={codeClassName}>DetectedOnly</code>, or <code className={codeClassName}>Intelligible</code>, plus optional <code className={codeClassName}>Localization</code>. This replaces the default hearing calculation; the physical <code className={codeClassName}>bCanHear=false</code> restriction still applies. The emitter argument is for the physical query and does not identify the speaker to the listener.
          </p>
          <p className="mt-4">
            Both overrides are synchronous, read-only game-thread queries. Do not launch latent work or presentation from them. Ordinary integrations need no override. For authored knowledge that characters can discuss, see <a className="text-blue-400 hover:underline" href="/docs/unrealengine/authoring-guide#item-knowledge">Item Knowledge and Object Understanding</a>.
          </p>
        </div>
      </div>
    </>
  );
}
