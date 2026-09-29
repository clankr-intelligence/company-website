import React from 'react';

export default function ItemKnowledgeDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Item Knowledge and Object Understanding</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          Item knowledge gives NPCs information from your game's authored content: what an herb is used for, how a tool works, or what someone knows about an artifact. Each NPC receives the facts you assign and can learn more from speech it hears. This is separate from seeing a particular object in the world.
        </p>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Recommended Setup Flow</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li>Create an <strong>Item Knowledge Library</strong> Data Asset in the Content Browser and give it a stable <code className="bg-white/20 px-2 py-1 rounded">ContentId</code>.</li>
            <li>Add your existing item sources, choose stable item identifiers, and map selected properties to readable facts. Add annotations where the source data needs more explanation.</li>
            <li>Review the library preview. Select reusable groups of facts and choose <strong>Create Collection</strong>, for example for local common knowledge or herbalist training.</li>
            <li>With PIE stopped, right-click the library in the Content Browser and choose <strong>Use in Current Level</strong>. Check the resulting <strong>Item Knowledge</strong> actor and save the level.</li>
            <li>Assign collections and any additional facts under each NPC's <strong>Starting Item Knowledge</strong>. Use NPC Blueprint defaults for shared assignments and placed instances for individual choices.</li>
            <li>Inspect the NPC's starting-knowledge preview, fix mapping or assignment errors, and save the edited assets. Test new starting assignments with a newly initialized NPC in a new session.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Reuse Existing Item Sources</h3>
          <p>
            Your item classes do not need to inherit from a plugin item class. A library can combine these source types:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-3 mt-4">
            <li><strong>DataTables:</strong> select a table and choose a stable ID column or explicitly use row names as item identity.</li>
            <li><strong>Data Assets:</strong> select existing assets and an ID property.</li>
            <li><strong>Primary Data Assets:</strong> select assets directly or use a Primary Asset Type already configured in your project's Asset Manager. Choose an ID property, or explicitly use Primary Asset IDs if your project treats them as stable.</li>
            <li><strong>Data-only Blueprints:</strong> select classes and read their default properties, including inherited values. This does not spawn actors or run construction scripts or gameplay events.</li>
            <li><strong>Data Registries:</strong> select a configured registry and explicit item IDs. <strong>Select All Registry Items</strong> selects the currently discoverable IDs; select again to include later additions. Choose an ID property or explicitly use registry-ID identity. Mapping <code className="bg-white/20 px-2 py-1 rounded">FName</code> fields requires an unambiguous native DataTable source; for other registry sources, use stable string fields or a custom reader.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Stable Identities and Readable Facts</h3>
          <p>
            Keep the library's <code className="bg-white/20 px-2 py-1 rounded">ContentId</code>, each item's <code className="bg-white/20 px-2 py-1 rounded">DefinitionId</code>, and its <code className="bg-white/20 px-2 py-1 rounded">FactId</code> values stable. Item definition IDs describe reusable content, such as a kind of herb; they are separate from the GUID of a particular plant actor. Asset paths locate your sources and are not automatically item identities. Renaming an explicitly selected Primary Asset ID or registry ID changes its knowledge identity.
          </p>
          <p className="mt-4">
            Property-based item IDs must use <code className="bg-white/20 px-2 py-1 rounded">FString</code> or <code className="bg-white/20 px-2 py-1 rounded">FName</code>. Fact values support strings, names, text, booleans, and non-enum numeric scalars. For enums, structures, object references, or containers, expose readable prose fields, add annotations, or use <a href="#api-reference" className="text-blue-400 hover:text-blue-300 transition-colors">UAuthoredItemKnowledgeReader in the API Reference</a> to read the source.
          </p>
          <p className="mt-4">
            Map only properties that should become knowledge. A fact's text format can use <code className="bg-white/20 px-2 py-1 rounded">{'{value}'}</code> and an explicitly selected name property through <code className="bg-white/20 px-2 py-1 rounded">{'{name}'}</code>. Write complete prose. For example, a fictional game could supply the fact "Moonleaf can reduce ash fever when prepared as an infusion." The herb, illness, and medicinal effect in this example are content supplied by the game author. Property names alone do not explain gameplay meaning, and ordinary mapping does not evaluate expressions or traverse nested properties and containers.
          </p>
          <p className="mt-4">
            Use <strong>Annotations</strong> to add prose facts to existing item definitions without changing their source schema. Give each fact a distinct ID; duplicate item or fact identities and unresolved related-item references are errors. Empty source values can omit a mapped fact, so review omitted values as well as the visible fact list.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Collections and Starting Assignments</h3>
          <p>
            In the library preview, select facts and choose <strong>Create Collection</strong> to save an <strong>Authored Item Knowledge Collection</strong>. Choose individual facts when a character should know an item's name but not its preparation, secrets, or specialist uses. <strong>Select all facts for this item</strong> includes that item's facts even when some are hidden by the current filter. Check the selection count before creating the collection; searching does not clear selections.
          </p>
          <p className="mt-4">
            Under an NPC's <strong>Starting Item Knowledge</strong>, use <strong>Collections</strong> for reusable selections and <strong>Additional Facts</strong> for individual facts. All selections are combined. Removing a direct fact does not remove the same fact if a collection still grants it, and a profession or role does not automatically grant knowledge. An NPC with no selections starts with none of the library's facts.
          </p>
          <p className="mt-4">
            You can also edit a collection's entries directly. An entry with an empty fact-ID list selects all facts for that item. The collection's <strong>Library</strong> field associates its facts with their content; activate the library in the level separately.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Use a Library in the Level</h3>
          <p>
            <strong>Use in Current Level</strong> creates or updates one visible <strong>Item Knowledge</strong> actor in the persistent level and selects it in the Outliner. This action supports undo and redo but does not save the level for you. Keep exactly one Item Knowledge actor when using an authored library, with a valid <strong>Library</strong> selected. It must stay loaded and remain outside runtime data layers. Duplicate actors, a missing library on the actor, or an invalid placement must be corrected.
          </p>
          <p className="mt-4">
            A level without an Item Knowledge actor can run without an authored item library. NPC assignment previews use the current editing level's library, including when inspecting NPC Blueprint defaults. Open the intended level before reviewing those assignments; a missing or incompatible library is reported rather than silently changing the NPC's selections.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Preview and Validate</h3>
          <p>
            Preview updates automatically after relevant library, source, or assignment edits. Wait for preparation to finish, then select facts to inspect their full text, source, and why they are included. <strong>Saved/Unsaved</strong> describes asset save state separately from whether preparation is ready. <strong>Refresh</strong> is available to retry preparation; it is not a required step before every save or play session.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-3 mt-4">
            <li>Library preview shows available content; it does not assign that content to every NPC.</li>
            <li>NPC preview separates <strong>Included at start</strong> from the initially collapsed <strong>Not included at start</strong> list. Collection previews similarly distinguish included and excluded facts.</li>
            <li>Search filters what you see without changing assignments. A search with no matches does not mean the NPC has no starting knowledge.</li>
            <li>Inspect errors and omitted values as well as facts. Resolve missing IDs, duplicate identities, and incompatible selections before relying on the assignment.</li>
            <li>If required source data is still unavailable, Content Validation can return <strong>NotValidated</strong>. Wait for source preparation and validate again; unavailable data should not be treated as an empty library.</li>
          </ul>
          <p className="mt-4">
            Preview describes the authored starting assignment, not an NPC's accumulated knowledge in an existing saved game and not a guaranteed future response.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Sessions and Saved Knowledge</h3>
          <p>
            The library is prepared for a new session and remains fixed for that session, including ordinary map travel and NPCs registered later. Editing the library or changing a level binding does not replace it during play. Start a new session to use changed library content.
          </p>
          <p className="mt-4">
            Starting assignments initialize new NPC knowledge. Already initialized NPCs and NPCs restored from a save keep their personal knowledge; library or assignment edits do not overwrite it or grant the selection again. To verify a changed starting assignment, use a newly initialized NPC rather than expecting a restored character to reset.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Knowledge, Recognition, and Gameplay</h3>
          <p>
            For example, your game might define a fictional herb called Moonleaf and assign a herbalist knowledge of its uses. The herbalist can draw on that knowledge before encountering a plant. It can inform a question, search, or interpretation of visible clues, but identifying a particular plant can remain uncertain. Knowing an item's usual properties does not establish that this specimen is fresh, safe, usable, nearby, or available to take.
          </p>
          <p className="mt-4">
            Give physical instances observable labels, descriptions, and traits through <a href="#perception" className="text-blue-400 hover:text-blue-300 transition-colors">Perceivable Object</a>. Keep hidden item identities and effects out of those visual descriptions. Each NPC uses its own evidence and knowledge; loading an actor does not make all NPCs aware of it. Remembered objects can inform later discussion or search without becoming immediately available for interaction.
          </p>
          <p className="mt-4">
            NPCs can also learn from <a href="#open-conversation" className="text-blue-400 hover:text-blue-300 transition-colors">speech they hear</a>, including while listening silently. They may retain uncertainty, conflicting accounts, or later corrections. Learning happens in the background and may not appear in the first reply. Your project still supplies gameplay actions and validates their live requirements; authored knowledge does not create recipes, inventory, interactions, or a guaranteed behavior sequence.
          </p>
        </div>
      </div>
    </>
  );
}
