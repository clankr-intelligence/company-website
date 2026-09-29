import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnrealDocsNavigation from '../../../components/UnrealDocsNavigation';

const worldDescriptionExample = `Aeldenvale is a rural fantasy frontier shaped by scattered villages, old forest roads, seasonal market days, and local customs around hospitality and shared labor. Most people travel by foot, cart, or horse, and news moves slowly unless carried by merchants, clergy, guards, or travelers.

Villagers value reputation, practical skill, family obligation, and visible contribution to the community. Outsiders are treated cautiously until someone local vouches for them. Most conflicts are handled informally unless they threaten land, livelihood, or public safety.`;

export default function Configuration() {
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
              Configuration
            </h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
          </div>

          <div className="space-y-20">
            <div id="overview" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  RealisticNPCs configuration is split between two editor surfaces. Use the <strong>RealisticNPCs Daemon Config</strong> panel to configure model services, credentials, and usage targets. Use <strong>Project Settings &gt; Plugins &gt; RealisticNPCs</strong> for world context, calendar and initial time, continuity behavior, and development resets.
                </p>
                <p className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-200">
                  Unreal starts and manages the daemon automatically. You do not need to load a configuration file in gameplay code or connect NPCs to model providers yourself.
                </p>
              </div>
            </div>

            <div id="daemon-configuration" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Daemon Configuration</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Open <strong>Window &gt; RealisticNPCs Daemon Config</strong>. This panel is the author-facing workflow for configuring the services and models used by NPC cognition.
                </p>

                <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Configure Services</h3>
                <p>
                  Each service provides an OpenAI-compatible endpoint that one or more usage targets can use. A service has a unique <strong>Service ID</strong> and an <strong>Endpoint</strong>. Use <strong>Add Service</strong> or <strong>Remove</strong> to manage the service list.
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500/50 pl-6">
                    <strong className="text-white">Set Key</strong>
                    <p className="mt-2">
                      Stores the service's API key in the operating system's credential store for the current provider origin. API keys are not written into the project profile.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500/50 pl-6">
                    <strong className="text-white">Check Stored Key</strong>
                    <p className="mt-2">
                      Confirms whether a credential is currently stored for that service ID and provider origin. It does not make a provider request or verify account access.
                    </p>
                  </div>
                </div>
                <p className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-200">
                  Credentials are authorized for the endpoint's scheme, host, and port. Changing only the endpoint path can reuse the stored key, but changing the scheme, host, or port requires using <strong>Set Key</strong> for the new origin. RealisticNPCs never silently sends an existing key to a different origin.
                </p>

                <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Assign Required Usage Targets</h3>
                <p>
                  Every project must assign a service and model to these three targets:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2">
                  <li><strong className="text-white">Default Light</strong> handles lighter supporting work.</li>
                  <li><strong className="text-white">Default Heavy</strong> handles work that benefits from the project's more capable general model.</li>
                  <li><strong className="text-white">Embedding</strong> generates the embeddings used by semantic memory retrieval.</li>
                </ul>
                <p className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200">
                  Real-time NPC behavior benefits from responsive models. High-latency models can make decisions and conversations feel less immediate, even when their output quality is strong.
                </p>

                <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Optional Overrides</h3>
                <p>
                  Select <strong>Add Optional Overrides</strong> when a particular workload should use a different service or model. Projects can override:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2">
                  <li><strong className="text-white">Agenda Generation</strong></li>
                  <li><strong className="text-white">Behavior Compile</strong></li>
                  <li><strong className="text-white">Conversation Reply</strong></li>
                  <li><strong className="text-white">Memory Reflection</strong></li>
                  <li><strong className="text-white">Short Horizon Reasoning</strong></li>
                </ul>
                <p>
                  Agenda generation, behavior compile, and conversation reply fall back to <strong>Default Heavy</strong>. Memory reflection and short horizon reasoning fall back to <strong>Default Light</strong>. Use the panel's fallback controls to remove an override and return to the corresponding default.
                </p>

                <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Save and Validate</h3>
                <p>
                  <strong>Save Profile</strong> writes the current service and target selections to <code className="bg-white/20 px-2 py-1 rounded">Config/RealisticNPCsDaemonProfile.json</code>. The generated profile contains service definitions, model assignments, and references to credentials stored by the operating system; it does not contain plaintext API keys and can be kept with the project's other source-controlled configuration.
                </p>
                <p>
                  <strong>Validate with Daemon</strong> asks the managed daemon to check the current panel values for structural and configuration consistency. This does not contact every configured provider, test model availability, or prove that every stored credential is valid.
                </p>
                <p>
                  After saving changes to services, models, or usage targets, restart any active PIE session or game to apply them. Saving and validation do not update an active play session.
                </p>
                <p className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-200">
                  If an existing profile is malformed, the panel reports the error rather than silently replacing it. Repair or remove the invalid profile, then reopen the panel and save a valid configuration.
                </p>
              </div>
            </div>

            <div id="project-settings" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Project Settings</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Open <strong>Project Settings &gt; Plugins &gt; RealisticNPCs</strong> to configure the project-wide authoring and continuity settings.
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500/50 pl-6">
                    <code className="bg-white/20 px-2 py-1 rounded">CalendarSource</code>
                    <p className="mt-2">
                      Select the calendar used by the project:
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                      <li><strong className="text-white">Built-in Simple</strong> uses configurable <code className="bg-white/20 px-2 py-1 rounded">RealSecondsPerGameDay</code>, <code className="bg-white/20 px-2 py-1 rounded">MonthDayCounts</code>, and optional <code className="bg-white/20 px-2 py-1 rounded">MonthNames</code>. It defaults to a 30-minute real-time day and twelve 30-day months.</li>
                      <li><strong className="text-white">Built-in Gregorian</strong> uses standard Gregorian month and leap-year rules with a configurable 30-minute default day length and optional month names.</li>
                      <li><strong className="text-white">Custom Calendar Asset</strong> uses a project-owned Calendar Data Asset derived from <code className="bg-white/20 px-2 py-1 rounded">UBaseCalendar</code> for projects that need a custom date model.</li>
                    </ul>
                    <p className="mt-3">
                      The built-in calendars require no Data Asset. Their configurations are saved separately in the project's normal configuration, so switching between Simple and Gregorian does not discard either set of values. Restart the current world or PIE session after changing calendar settings.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500/50 pl-6">
                    <code className="bg-white/20 px-2 py-1 rounded">bAutoApplyInitialTime</code> and <code className="bg-white/20 px-2 py-1 rounded">InitialTime</code>
                    <p className="mt-2">
                      Choose the initial in-game time used when the current map has no saved time. Map time is persisted separately from NPC continuity.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500/50 pl-6">
                    <code className="bg-white/20 px-2 py-1 rounded">InlineWorldDescription</code> and <code className="bg-white/20 px-2 py-1 rounded">WorldDescriptionFile</code>
                    <p className="mt-2">
                      Provide broad world context that is exported to the daemon. Inline text takes precedence when both settings are populated.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500/50 pl-6">
                    <code className="bg-white/20 px-2 py-1 rounded">bResetPersistentStateOnStartup</code>
                    <p className="mt-2">
                      Development helper for an intentional clean start. It resets saved world time, automatic PIE continuity handles, and managed-daemon persistent data. It does not remove the daemon executable or its configuration. Leave it disabled for normal continuity, and disable it again after the clean startup you intended.
                    </p>
                  </div>

                </div>
                <p className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200">
                  Calendar day length must be positive. The Simple calendar also requires at least one month and a positive day count for every month. Invalid built-in settings log an error and use that calendar's defaults; an unset or invalid custom asset falls back to the built-in Simple calendar.
                </p>
              </div>
            </div>

            <div id="world-description" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">World Description</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Provide the world description either in <code className="bg-white/20 px-2 py-1 rounded">InlineWorldDescription</code> or through <code className="bg-white/20 px-2 py-1 rounded">WorldDescriptionFile</code>. Inline text is convenient for shorter descriptions. A file is useful for longer descriptions maintained outside Project Settings; relative file paths are resolved from the project directory.
                </p>
                <p className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200">
                  If <code className="bg-white/20 px-2 py-1 rounded">InlineWorldDescription</code> is non-empty, it takes precedence over <code className="bg-white/20 px-2 py-1 rounded">WorldDescriptionFile</code>.
                </p>
                <p>
                  The description is loaded on first use and cached for the editor or game process. Restart the editor or game after changing these settings or the file contents; restarting PIE or a daemon session alone does not reload them. A missing or unreadable file leaves the initial description empty and is not retried automatically. File-based projects can explicitly refresh the cached description through the C++ function <code className="bg-white/20 px-2 py-1 rounded">RNPCsUtilities::LoadWorldDescription(Filepath)</code> before starting a new session. This does not change the description in an active session.
                </p>
                <p>
                  The description should cover global context that applies broadly across NPCs: setting, culture, technology level, social rules, major institutions, and constraints NPCs should respect. Use NPC profiles for individual biographies and starting relationships, spatial authoring for place-specific knowledge, and <Link to="/docs/unrealengine/authoring-guide#item-knowledge" className="text-blue-400 hover:text-blue-300 underline">item knowledge assignments</Link> for item facts that only particular NPCs should initially know.
                </p>
                <p>
                  Keep it concise enough to be reused as context. Prioritize details that materially affect NPC decisions and interpretation of the world.
                </p>
                <pre className="bg-slate-800/50 p-4 rounded-lg whitespace-pre-wrap break-words">
                  <code className="text-sm text-gray-300">{worldDescriptionExample}</code>
                </pre>
              </div>
            </div>

            <div id="time-and-continuity" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Time and Continuity</h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  The configured calendar and game time provide the temporal context used by NPC behavior and memory. The plugin saves game time separately for each map. A map's saved time takes precedence over the configured initial time, independently of which NPC continuity is resumed.
                </p>
                <p>
                  When no saved time exists for the current map and <code className="bg-white/20 px-2 py-1 rounded">bAutoApplyInitialTime</code> is enabled, <code className="bg-white/20 px-2 py-1 rounded">InitialTime</code> supplies the starting point. Gameplay can still set world time explicitly through <code className="bg-white/20 px-2 py-1 rounded">RNPCsUtilities::SetGameWorldTime(...)</code>.
                </p>
                <p>
                  Loading an older NPC checkpoint does not rewind the map clock. If a game save must restore a matching time, store that time in the project's SaveGame and set it explicitly during loading.
                </p>
                <p>
                  PIE automatically creates or resumes continuity for the project and starting persistent map. Packaged-game save flows use the <Link to="/docs/unrealengine/authoring-guide#memory-and-persistence" className="text-blue-400 hover:text-blue-300 underline">continuity Blueprint APIs in the Authoring Guide</Link>. Use the reset setting only when you intentionally want to discard the current development continuity and begin fresh.
                </p>
                <p className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-200">
                  Calendar source and date structure are part of continuity compatibility. Changing the source or Simple month-day counts requires a fresh continuity; changing only the real-time day length or month names does not. After changing a custom calendar's date interpretation, use a new asset path or begin a fresh continuity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
