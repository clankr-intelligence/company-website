import type { Release } from './types';

export const v0_5_0: Release = {
  version: 'v0.5.0',
  date: 'TBD',
  summary: 'Added open conversation, authored item knowledge and object perception, alongside improvements to personal memory, spatial reasoning and behavior continuity.',
  highlights: [
    'Open conversations support groups, changing participants, public remarks, overhearing and self-talk.',
    'Reuse existing item data through Item Knowledge Libraries and give each NPC distinct starting knowledge.',
    'Added a Perceivable Object authoring workflow with geometry-aware visibility and occlusion.',
    'Improved NPC-specific knowledge, memory, conversation context, spatial reasoning and behavior continuity.',
  ],
  content: (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">1. High-Level Overview</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            NPCs can perceive authored objects, retain useful knowledge about them, and use that knowledge in behavior and conversation alongside what they know about other characters.
          </li>
          <li>
            Conversations support changing groups and individually heard speech, with each NPC deciding how to participate.
          </li>
          <li>
            These improvements extend the existing intention-driven behavior system. Authors continue to define their characters, world knowledge, and gameplay actions without managing a separate cognition workflow.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">2. Object Perception and Authoring</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            Add <code className="bg-slate-800/50 px-2 py-1 rounded">Perceivable Object</code> to an ordinary noncharacter actor and supply its observable label, description, and traits. Existing perceivable facts can expose changing state without revealing hidden information through the object's description.
          </li>
          <li>
            Object Vision automatically selects eligible geometry from the actor's components. An optional <code className="bg-slate-800/50 px-2 py-1 rounded">Perceptual Geometry Components</code> selection supports objects that need a more specific set of components considered for visibility.
          </li>
          <li>
            Visibility checks consider object geometry and occlusion rather than just the actor's origin. A visible portion of a large or partly obscured object can provide evidence even when its center is hidden or outside the viewing area.
          </li>
        </ul>
        <p className="text-white mt-4">
          Object Vision uses bounded collision-based sampling, not general image recognition or pixel-perfect visibility. Objects need suitable query collision, and very small exposed portions may fall between samples.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">3. Authored Item Knowledge</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            <strong>Reuse existing item data.</strong> Create an <code className="bg-slate-800/50 px-2 py-1 rounded">Item Knowledge Library</code> from DataTables, Data Assets (including Primary Data Assets), data-only Blueprint defaults, or Data Registries. Select relevant properties and add descriptions where the existing data needs more explanation.
          </li>
          <li>
            <strong>Give characters different starting knowledge.</strong> Choose <code className="bg-slate-800/50 px-2 py-1 rounded">Use in Current Level</code> from the library's Content Browser menu, then assign reusable collections or individual facts through each NPC's <code className="bg-slate-800/50 px-2 py-1 rounded">Starting Item Knowledge</code> controls. A herbalist can know a remedy and its preparation while another character knows only its name.
          </li>
          <li>
            <strong>Preview what each NPC knows.</strong> Search the automatically updated preview, inspect complete facts and their sources, and distinguish included knowledge from information the NPC will not receive. Mapping and assignment problems appear alongside the preview.
          </li>
          <li>
            <strong>Let knowledge inform behavior.</strong> NPCs can discuss known items, consider them when deciding what to do, and interpret encountered objects using their own knowledge and available evidence. Knowing a remedy can motivate a question or search before a specimen is encountered; ambiguous evidence can still leave identification uncertain.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">4. NPC-Specific Knowledge and Object-Aware Behavior</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            Each NPC maintains its own current, recent, and remembered knowledge. An object being loaded in the world does not make every NPC aware of it, and losing sight does not necessarily erase useful knowledge.
          </li>
          <li>
            Attention draws on personality, goals, relationships, relevant memories, and meaningful changes. Known objects can motivate an intention, a search, or a question without every visible prop repeatedly demanding a response.
          </li>
          <li>
            Registered actions distinguish object, character, and general entity targets. Remembering a target does not make it available for immediate interaction; Unreal still validates the live target and gameplay conditions before execution.
          </li>
        </ul>
        <p className="text-white mt-4">
          Authors continue to provide gameplay actions and their rules. Making a door, tool, or container perceivable does not automatically implement opening, using, inspecting, or inventory behavior.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">5. Open Conversation</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            <strong>Flexible participation.</strong> Characters can take part in individual or group conversations, join an exchange, leave independently, or return later. NPCs can contribute, listen, decline or defer according to their character and circumstances.
          </li>
          <li>
            <strong>Conversation beyond a fixed group.</strong> Public remarks, quiet asides, overheard exchanges and audible self-talk do not require every listener to become a participant.
          </li>
          <li>
            <strong>Individual hearing and understanding.</strong> Each NPC responds to the speech it actually hears. Arriving late does not reveal earlier dialogue, and hearing a remark does not require answering it.
          </li>
          <li>
            <strong>Conversation-aware behavior.</strong> NPCs pause incompatible movement and work while engaged. What they hear can influence whether they resume their previous activity or choose something different afterward.
          </li>
          <li>
            <strong>Familiar authoring, flexible presentation.</strong> Existing character descriptions, relationships and world knowledge guide conversation. Your game retains control over player input, accepting or declining approaches, dialogue UI, animation and audio.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">6. Personal Memory and Knowledge</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            Meaningful encounters can build familiarity with people and objects. Learned names and accepted corrections or withdrawals are retained more consistently, while routine visibility alone does not create a permanent record of every prop.
          </li>
          <li>
            Conversation and behavior context better preserve the distinction between direct observations, remembered information, and reported claims. Remembered place associations can inform a search without being treated as proof of a person's or object's current location.
          </li>
          <li>
            NPCs can discuss known offstage objects or ask another person about an object while keeping the inquiry subject distinct from the conversation partner. Relevant names and relationships help inform the exchange without assuming prior acquaintance.
          </li>
          <li>
            NPCs can learn factual information from conversations they hear, including while listening without replying. They can remember who supplied information, retain uncertainty or conflicting accounts, and revise earlier understanding. Learned knowledge can inform later conversation, behavior, and item identification just like other personal knowledge. Learning happens in the background and may not be reflected in the first reply.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">7. Spatial Reasoning and Behavior Continuity</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            Known place descriptions and parent/subarea relationships are used more consistently when forming intentions and selecting movement destinations. An NPC outside a building can consider a known interior area directly, subject to live movement validation, without requiring a stop at the broader building first.
          </li>
          <li>
            Short-term behavior now considers the surrounding activity's purpose, earlier progress, and remaining contributions. Preparation can take the broader activity into account rather than treating each step in isolation.
          </li>
          <li>
            When a contribution is already supported by the activity's action history or current location, progress can advance without inventing another action simply to account for it. Behavior still permits purposeful preparation, broad destinations, repeated checks, and personality-dependent choices.
          </li>
        </ul>
        <p className="text-white mt-4">
          These changes improve the information and progress handling available to behavior generation. They do not prescribe one correct room or routine, guarantee perfect model judgment, or eliminate model-provider latency.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">8. Shared Visual Configuration and Upgrade Notes</h2>
        <ul className="list-disc space-y-3 text-white ml-6">
          <li>
            Character Sight, Object Vision, and visual place discovery use the same Unreal Sight configuration and observer viewpoint while retaining their own sensing behavior. The editor's Visual Perception Envelope preview shows the shared viewing configuration, not guaranteed visibility of individual targets.
          </li>
          <li>
            Object authoring includes status and validation feedback for identity, metadata, and perceptual geometry. Invalid visual configuration or geometry produces diagnostics rather than a silent fallback.
          </li>
        </ul>
        <p className="text-white font-semibold mt-6 mb-3">
          Upgrading an existing project
        </p>
        <p className="text-white">
          Review each NPC controller's Unreal Sight configuration. Retired independent Spatial Perception range, field-of-view, and eye-origin settings no longer control visual sensing or provide a fallback. Spatial observation cadence and place-cue enablement remain separate spatial settings.
        </p>
        <p className="text-white mt-4">
          Library changes take effect in a new session. They do not overwrite the personal knowledge of NPCs already initialized or restored from a save.
        </p>
        <p className="text-white font-semibold mt-6 mb-3">
          Conversation integrations
        </p>
        <p className="text-white">
          Update custom player-conversation integrations to use <code className="bg-slate-800/50 px-2 py-1 rounded">SubmitSpeech</code> for speech and <code className="bg-slate-800/50 px-2 py-1 rounded">DeclareParticipation</code> for joining, declining or leaving. Use <code className="bg-slate-800/50 px-2 py-1 rounded">OnContactOffered</code> for incoming invitations, <code className="bg-slate-800/50 px-2 py-1 rounded">OnParticipationChanged</code> and <code className="bg-slate-800/50 px-2 py-1 rounded">GetConversationState</code> for conversation UI, <code className="bg-slate-800/50 px-2 py-1 rounded">OnSpeechReceived</code> for heard text, and <code className="bg-slate-800/50 px-2 py-1 rounded">OnSpeechOutcome</code> for delivery results. Speech can be submitted without joining a conversation, and successful submission does not guarantee an NPC reply or accepted participation.
        </p>
      </div>
    </div>
  ),
};
