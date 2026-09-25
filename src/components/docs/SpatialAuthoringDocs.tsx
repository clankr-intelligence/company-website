import React from 'react';

export default function SpatialAuthoringDocs() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Spatial Authoring</h2>
      <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          Spatial authoring tells NPCs what places exist, which parts of those places matter, how places can be discovered, and what spatial knowledge an NPC should start with. Author semantically meaningful spaces explicitly; ordinary unauthored space can still be crossed by movement, but it should not be expected to support rich local behavior by itself.
        </p>
        <p>
          Use spatial knowledge for places and their layout. Use <a href="#perception" className="text-blue-400 hover:text-blue-300 transition-colors">Perceivable Objects</a> for physical props, and <a href="#item-knowledge" className="text-blue-400 hover:text-blue-300 transition-colors">Item Knowledge and Object Understanding</a> for information such as a herb's properties or a tool's purpose. A known place does not automatically reveal every object inside it.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Author Places</h3>
            <p>
              Use <code className="bg-white/20 px-2 py-1 rounded">ASpatialPlaceAnchorActor</code> or <code className="bg-white/20 px-2 py-1 rounded">USemanticPlaceComponent</code> to define top-level places NPCs can know, discover, and move to.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Add Areas</h3>
            <p>
              Use <code className="bg-white/20 px-2 py-1 rounded">USpatialAreaComponent</code> for rooms, stalls, counters, yards, work spots, or other grounded sub-areas inside a place.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-white/10 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-white mb-3">Seed Knowledge</h3>
            <p>
              Use packet assets, seed presets, and NPC overrides to decide which authored places and areas an NPC already understands when play begins.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Recommended Setup Flow</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li>Author each important top-level place with a <code className="bg-white/20 px-2 py-1 rounded">Spatial Place Anchor</code> actor or a <code className="bg-white/20 px-2 py-1 rounded">Semantic Place</code> component.</li>
            <li>Add <code className="bg-white/20 px-2 py-1 rounded">Spatial Area</code> components for the meaningful parts of a place that NPCs should reference, enter, or target.</li>
            <li>Add discovery geometry only for places or areas that should become known through live perception.</li>
            <li>Create spatial knowledge packet assets for reusable place layouts, such as the standard areas inside a tavern, home, shop, or town square.</li>
            <li>Place a <code className="bg-white/20 px-2 py-1 rounded">Spatial Knowledge Packet Library</code> actor in the level and assign the packet assets that can be used there.</li>
            <li>Create seed preset assets for common NPC roles, then assign those presets or one-off overrides on each NPC.</li>
            <li>Run <code className="bg-white/20 px-2 py-1 rounded">ValidateInitialPacketAssignments</code> after changing packet assets, presets, place references, or NPC starting knowledge.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Top-Level Places</h3>
          <p>
            A top-level place is a meaningful location an NPC can know as a place in the world: a house, tavern, village, plaza, field, district, road, or other authored location. Give each place a clear <code className="bg-white/20 px-2 py-1 rounded">PlaceName</code>, useful aliases, and traits that describe stable qualities of the place.
          </p>

          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">ASpatialPlaceAnchorActor</code>
              <p className="mt-2">
                Prefer this for standalone or fuzzy exterior places such as villages, plazas, markets, roads, fields, or districts. Set the actor-level <code className="bg-white/20 px-2 py-1 rounded">RegionMode</code> to <code className="bg-white/20 px-2 py-1 rounded">Sphere</code> or <code className="bg-white/20 px-2 py-1 rounded">Box</code> when the place should have an authored spatial surface, or leave it as <code className="bg-white/20 px-2 py-1 rounded">None</code> for a point-like anchor.
              </p>
              <p className="mt-2">
                Treat the actor-level settings as the authored source of truth. The actor manages its internal place and discovery components for you, so authors should not edit those child components independently.
              </p>
            </div>

            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">USemanticPlaceComponent</code>
              <p className="mt-2">
                Use this when an existing actor represents one top-level place, such as a house actor, tavern actor, shop actor, or landmark. A place actor should generally have one top-level <code className="bg-white/20 px-2 py-1 rounded">Semantic Place</code> component.
              </p>
              <p className="mt-2">
                Enable containment bounds when the plugin should know whether an NPC is inside that place. Containment can use owner bounds, a target component, a sphere, or a box. Containment is about current location and movement targets; use discovery settings separately when NPCs should notice the place through perception.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Spatial Areas</h3>
          <p>
            <code className="bg-white/20 px-2 py-1 rounded">USpatialAreaComponent</code> defines a grounded sub-area inside a top-level place. Use areas for locations an NPC may specifically reason about or move within: a taproom, kitchen, porch, market stall, forge, counter, doorway, common room, bedroom, or work area.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li><code className="bg-white/20 px-2 py-1 rounded">AreaTemplateId</code> is the stable reusable ID used by packet assets. Use names like <code className="bg-white/20 px-2 py-1 rounded">tavern.taproom</code>, <code className="bg-white/20 px-2 py-1 rounded">shop.counter</code>, or <code className="bg-white/20 px-2 py-1 rounded">house.kitchen</code>.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">BoxExtentsUnits</code> defines the authored area surface used for containment, perception sampling, and movement target sampling.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">PlaceName</code> is optional. Use it only when the area has a specific in-world name; otherwise rely on the area type label.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">PerceptualTypeLabel</code> should be a simple NPC-facing label such as <code className="bg-white/20 px-2 py-1 rounded">taproom</code>, <code className="bg-white/20 px-2 py-1 rounded">counter</code>, or <code className="bg-white/20 px-2 py-1 rounded">market stall</code>.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">bDiscoverableFromPerception</code> controls whether the area can be discovered through the NPC's spatial perception sampler.</li>
          </ul>
          <p className="mt-4">
            Packet assignments resolve areas by matching each packet <code className="bg-white/20 px-2 py-1 rounded">AreaTemplateId</code> against one <code className="bg-white/20 px-2 py-1 rounded">Spatial Area</code> component on the target place actor. If multiple matching areas exist on that actor, or no matching area exists, that packet area is skipped during starting knowledge setup. Validation and logging should surface these ineffective assignments so authors can fix the missing or ambiguous grounding.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Discovery Components</h3>
          <p>
            Discovery authoring controls what NPCs can learn from observing the world during play. It is separate from starting knowledge: starting knowledge tells an NPC what it already knows, while discovery lets an NPC learn about visible authored places and areas.
          </p>
          <p className="mt-4">
            For top-level visual discovery, set a nonempty <code className="bg-white/20 px-2 py-1 rounded">PerceptualTypeLabel</code> on the Spatial Place Anchor actor or Semantic Place component, such as "shop" or "village". This generic label is required even when discovery geometry is valid; setting <code className="bg-white/20 px-2 py-1 rounded">PlaceName</code> alone does not enable visual discovery.
          </p>
          <p className="mt-4">
            Visual discovery uses the NPC controller's enabled UE Sight configuration and viewpoint, shared with character Sight and Object Vision. Configure that once using the <a href="#perception" className="text-blue-400 hover:text-blue-300 transition-colors">Perception</a> guide. On the NPC, keep <code className="bg-white/20 px-2 py-1 rounded">bIncludeVisiblePlaceCues</code> enabled and use <code className="bg-white/20 px-2 py-1 rounded">ObservationIntervalSeconds</code> to set spatial sampling cadence. Place discovery geometry and occlusion still determine which cues can be observed.
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">USpatialPlaceDiscoveryComponent</code>
              <p className="mt-2">
                Use this for a top-level place that should be discoverable through perception. The component can sample owner bounds, a target component, a sphere, or a box. For exterior places, prefer <code className="bg-white/20 px-2 py-1 rounded">Spatial Place Anchor</code> unless you need a fully manual setup.
              </p>
            </div>
            <div className="border-l-4 border-blue-500/50 pl-6">
              <code className="bg-white/20 px-2 py-1 rounded">USpatialAreaComponent</code>
              <p className="mt-2">
                Areas use their own box extents for perception when <code className="bg-white/20 px-2 py-1 rounded">bDiscoverableFromPerception</code> is enabled. This is useful for spaces an NPC should notice only after getting near enough to observe them.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Movement Targets</h3>
          <p>
            When an NPC moves to an authored place or area, the plugin resolves the <code className="bg-white/20 px-2 py-1 rounded">LocationRef</code> to a grounded world target. If the place or area has valid containment bounds, movement samples a point inside those authored bounds instead of always moving to the actor origin.
          </p>
          <p className="mt-4">
            This is why spatial bounds should describe the actual usable surface of the place or area. For example, a plaza anchor should cover the plaza surface, and a tavern taproom area should cover the part of the room where NPCs can plausibly stand or act.
          </p>
          <p className="mt-4">
            An NPC can know about a place semantically but still be unable to move there if the current spatial graph and authored context do not provide a grounded routeable target.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Packet Assets</h3>
          <p>
            <code className="bg-white/20 px-2 py-1 rounded">USpatialKnowledgePacketAsset</code> defines a reusable bundle of area knowledge and area-to-area relations. Use packets for layouts that can be applied to one or more target places, such as the standard areas inside a tavern, shop, house, or public square.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li><code className="bg-white/20 px-2 py-1 rounded">PacketId</code> must be stable and unique among packet assets registered in the current world.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">DisplayName</code> and <code className="bg-white/20 px-2 py-1 rounded">Description</code> should explain when authors should use the packet.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">AreaTemplates</code> lists the area template IDs this packet expects to find on each target place actor.</li>
            <li><code className="bg-white/20 px-2 py-1 rounded">AreaRelations</code> describes how those area templates relate to each other, using <code className="bg-white/20 px-2 py-1 rounded">Contains</code> or <code className="bg-white/20 px-2 py-1 rounded">ConnectedTo</code>.</li>
          </ul>
          <p className="mt-4">
            Packet assets do not create geometry or place identity by themselves. They become useful when assigned to target places whose actors already contain matching <code className="bg-white/20 px-2 py-1 rounded">Spatial Area</code> components.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Seed Presets and NPC Overrides</h3>
          <p>
            <code className="bg-white/20 px-2 py-1 rounded">USpatialKnowledgeSeedPresetAsset</code> bundles starting spatial knowledge for a kind of NPC. Presets can include known places, relations between known places, and packet assignments targeted at specific places.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-4">
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">Places</code> for homes, workplaces, community locations, or other places the NPC should know well at startup.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">PlaceRelations</code> for simple starting relationships such as a village containing a house or two places being directly connected.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">PacketAssignments</code> to apply a packet asset to explicit target places. Target places also become known starting places for the NPC.</li>
          </ul>
          <p className="mt-4">
            Assign shared presets on the NPC's <code className="bg-white/20 px-2 py-1 rounded">InitialKnowledgePresets</code>. Use <code className="bg-white/20 px-2 py-1 rounded">InitialPlaceOverrides</code> and <code className="bg-white/20 px-2 py-1 rounded">InitialPacketAssignmentOverrides</code> for one-off NPC-specific differences.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Packet Library Actor</h3>
          <p>
            Place an <code className="bg-white/20 px-2 py-1 rounded">ASpatialKnowledgePacketLibraryActor</code> in the level to register the packet assets available in that world. NPC presets and overrides can only seed from packet assets that are registered through a packet library actor.
          </p>
          <p className="mt-4">
            Keep packet IDs unique across registered libraries in the same world. If two registered packet assets use the same <code className="bg-white/20 px-2 py-1 rounded">PacketId</code>, only one can be used for that ID.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Authoring Checklist</h3>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Author every semantically important place instead of relying on arbitrary world positions.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">Spatial Place Anchor</code> for fuzzy exterior places and <code className="bg-white/20 px-2 py-1 rounded">Semantic Place</code> components for actor-bound places.</li>
            <li>Use <code className="bg-white/20 px-2 py-1 rounded">Spatial Area</code> components for grounded sub-areas that NPCs should reference or move within.</li>
            <li>Keep area template IDs stable and make packet assets match those IDs exactly.</li>
            <li>Register packet assets through a level packet library actor before using them in presets or NPC overrides.</li>
            <li>Validate NPC starting spatial knowledge after changing places, packet assets, seed presets, or per-NPC overrides.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
