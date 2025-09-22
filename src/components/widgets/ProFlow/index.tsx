import * as React from 'react';
import WidgetHeader from '../common/WidgetHeader';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import type { ProFlowConfig, ProFlowLink, WorkSession } from './types';
import { X } from 'lucide-react';
import { Settings, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';

type PersistedProFlow = {
  version: 1;
  title?: string;
  maxLinks?: number;
  openInNewTab?: boolean;
  showCategories?: boolean;
  sessions: WorkSession[];
  activeSessionId: string;
};

// A stable key so this widget can find its saved data
const STORAGE_KEY = "alfred:proflow:v1";

// Read JSON safely from localStorage
function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Write JSON safely to localStorage
function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignored (quota, serialization issues, etc.)
  }
}
// Normalize a URL: add https:// if missing, validate absolute URL
function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const candidate = hasProtocol ? trimmed : `https://${trimmed}`;

  try {
    const u = new URL(candidate);        // throws if invalid absolute URL
    u.host = u.host.toLowerCase();       // normalizes host casing
    return u.toString();
  } catch {
    return null;
  }
}

// Check for exact URL duplicate within a session
function isDuplicateInSession(url: string, session: WorkSession): boolean {
  return session.links.some((l) => l.url === url);
}
// ---- Session name helpers ----
const SESSION_NAME_MIN = 1;
const SESSION_NAME_MAX = 40;

// case-insensitive uniqueness check (exclude a given id when renaming)
function isSessionNameUnique(
  name: string,
  sessions: WorkSession[],
  excludeId?: string
): boolean {
  const target = name.trim().toLowerCase();
  return !sessions.some(
    (s) => s.id !== excludeId && s.name.trim().toLowerCase() === target
  );
}

function validateSessionName(
  raw: string,
  sessions: WorkSession[],
  excludeId?: string
): string | null {
  const name = raw.trim();
  if (name.length < SESSION_NAME_MIN || name.length > SESSION_NAME_MAX) {
    return `Name must be ${SESSION_NAME_MIN}–${SESSION_NAME_MAX} characters.`;
  }
  if (!isSessionNameUnique(name, sessions, excludeId)) {
    return "Name already exists. Choose a different one.";
  }
  return null;
}

// Generate a unique default like "Session 2", "Session 3", etc.
function nextSessionName(sessions: WorkSession[]): string {
  // collect all existing names (lowercased) for quick check
  const existing = new Set(sessions.map((s) => s.name.trim().toLowerCase()));
  let i = sessions.length + 1;
  // try "Session N" until it's unique
  while (existing.has(`session ${i}`)) i++;
  return `Session ${i}`;
}



// If your registry reads per-widget metadata from each widget file, keep this re-export.
// If not, it's harmless to keep, or you can delete it.
export { widgetMeta } from './types';

type WidgetProps<T = Record<string, unknown>> = {
  width: number;
  height: number;
  config?: T & { onUpdate?: (next: Partial<T>) => void; onDelete?: () => void };
};

export default function ProFlowWidget({ width, config }: WidgetProps<ProFlowConfig>) {
  // NEW: Add sessions state
  const [sessions, setSessions] = React.useState<WorkSession[]>(() => {
  // Try to restore from localStorage
  const saved = readLocal<PersistedProFlow>(STORAGE_KEY);
  if (saved?.sessions?.length) return saved.sessions;

  // Fallback to config / default
  if (config?.sessions?.length) return config.sessions;
  return [{ id: "default", name: "General", links: config?.links || [] }];
});



const [activeSessionId, setActiveSessionId] = React.useState<string>(() => {
  const saved = readLocal<PersistedProFlow>(STORAGE_KEY);
  if (saved?.activeSessionId) return saved.activeSessionId;
  return config?.activeSessionId || "default";
});


  // NEW: Get current session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  React.useEffect(() => {
  const payload: PersistedProFlow = {
    version: 1,
    title: config?.title,
    maxLinks: config?.maxLinks,
    openInNewTab: config?.openInNewTab,
    showCategories: config?.showCategories,
    sessions,
    activeSessionId,
  };

  // Debounce small changes to avoid excessive writes
  const id = window.setTimeout(() => writeLocal(STORAGE_KEY, payload), 150);
  return () => window.clearTimeout(id);
}, [
  sessions,
  activeSessionId,
  config?.title,
  config?.maxLinks,
  config?.openInNewTab,
  config?.showCategories,
]);


  // MODIFIED: Update cfg to use activeSession
  const cfg = {
    title: config?.title ?? 'Quick Links',
    links: activeSession.links,  // CHANGED: now uses session links
    maxLinks: config?.maxLinks ?? 12,
    openInNewTab: config?.openInNewTab ?? true,
    showCategories: config?.showCategories ?? true,
    onUpdate: config?.onUpdate,
  };

  // Keep your existing state
  const [newTitle, setNewTitle] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');
  const [notice, setNotice] = React.useState<string | null>(null); // ADD
const [saving, setSaving] = React.useState(false);               // ADD
const titleRef = React.useRef<HTMLInputElement | null>(null);    // ADD
const [showSessionModal, setShowSessionModal] = React.useState(false);
const [editingSession, setEditingSession] = React.useState<WorkSession | null>(null);
// NEW: local rename field + error
const [editName, setEditName] = React.useState("");
const [editError, setEditError] = React.useState<string | null>(null);

// Safe id reference for validation in callbacks
const editingId = editingSession?.id ?? null;


function openSessionManager(session: WorkSession) {
  setEditingSession(session);
  setEditName(session.name); // prefill current
  setEditError(null);
  setShowSessionModal(true);
}

function closeSessionManager() {
  setShowSessionModal(false);
  setEditingSession(null);
  setEditName("");
  setEditError(null);
}
function handleRenameSession() {
  if (!editingSession) return;

  const error = validateSessionName(editName, sessions, editingSession.id);
  if (error) {
    setEditError(error);
    return;
  }

  const trimmed = editName.trim();
  const updated = sessions.map((s) =>
    s.id === editingSession.id ? { ...s, name: trimmed } : s
  );

  setSessions(updated);
  cfg.onUpdate?.({ sessions: updated }); // repo rule: partial only
  setEditingSession({ ...editingSession, name: trimmed }); // reflect immediately
  setEditError(null);
}



// Function to get favicon for any URL
function getHostname(url: string): string | null {
  try { return new URL(url).hostname; } catch { return null; }
}
function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
}


   React.useEffect(() => {
  const saved = readLocal<PersistedProFlow>(STORAGE_KEY);
  if (!saved && config?.links?.length && !config.sessions?.length) {
    const migrated: WorkSession[] = [{
      id: "default",
      name: "General",
      links: config.links,
    }];

    setSessions(migrated);
    setActiveSessionId("default");

    // Inform the host (repo convention)
    cfg.onUpdate?.({ sessions: migrated, activeSessionId: "default", links: [] });
  }
  // run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  function addLink() {
  setNotice(null);

  // Validate title
  const t = newTitle.trim();
  if (t.length < 1 || t.length > 80) {
    setNotice('Title must be 1–80 characters.');
    return;
  }

  // Normalize URL (add https:// if needed, ensure absolute URL)
  const normalized = normalizeUrl(newUrl);
  if (!normalized) {
    setNotice('Please enter a valid URL.');
    return;
  }

  if (!activeSession) return;

  // Block duplicates within the same session
  if (isDuplicateInSession(normalized, activeSession)) {
    setNotice(`Already added to ${activeSession.name}.`);
    return;
  }
  

  // Build link
  const link: ProFlowLink = {
    id: crypto.randomUUID(),
    title: t,
    url: normalized,
    category: 'other',
    clicks: 0,
  };

  // Update only the active session; newest-first; enforce maxLinks
  const updatedSessions = sessions.map((session) => {
    if (session.id !== activeSessionId) return session;
    const next = [link, ...session.links];
    const limited = next.slice(0, cfg.maxLinks);
    return { ...session, links: limited };
  });

  setSaving(true);
  setSessions(updatedSessions);
  // Repo rule: emit only partial diffs
  cfg.onUpdate?.({ sessions: updatedSessions, activeSessionId });

  // Reset UI & focus back to title for speed
  setNewTitle('');
  setNewUrl('');
  setNotice(`Added to ${activeSession.name}.`);
  requestAnimationFrame(() => titleRef.current?.focus());
  window.setTimeout(() => setNotice(null), 1800);
  window.setTimeout(() => setSaving(false), 150);
}


function onClickLink(id: string) {
  if (!activeSession) return;

  const updatedSessions = sessions.map((session) => {
    if (session.id !== activeSessionId) return session;
    const nextLinks = session.links.map((l) =>
      l.id === id ? { ...l, clicks: l.clicks + 1, lastUsed: new Date().toISOString() } : l
    );
    return { ...session, links: nextLinks };
  });

  setSessions(updatedSessions);
  // Repo rule: partial diff only
  cfg.onUpdate?.({ sessions: updatedSessions });
}
function handleRemoveLink(id: string) {
  if (!activeSession) return;

  const updatedSessions = sessions.map((session) => {
    if (session.id !== activeSessionId) return session;
    return { ...session, links: session.links.filter((l) => l.id !== id) };
  });

  setSessions(updatedSessions);
  // Repo rule: partial diff only
  cfg.onUpdate?.({ sessions: updatedSessions });
}


  const cols = Math.max(2, Math.min(4, Math.floor(width)));

  return (
    <div className="widget-container h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <WidgetHeader
        title={cfg.title}
        onSettingsClick={() => {
          // Settings functionality can be added later
        }}
      />

      <div className="px-3 pb-2">
  <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded p-1">
    {sessions.map(session => (
      <button
        key={session.id}
        onClick={() => setActiveSessionId(session.id)}
       onDoubleClick={() => openSessionManager(session)}

        className={`px-3 py-1.5 rounded text-sm transition-all ${
          activeSessionId === session.id
            ? 'bg-white dark:bg-slate-700 font-medium shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-slate-700'
        }`}
      >
        {session.name} ({session.links.length})
      </button>
    ))}
    <button
      onClick={() => {
  const newSession: WorkSession = {
    id: crypto.randomUUID(),
    name: nextSessionName(sessions), // <- unique default
    links: [],
  };
  const updated = [...sessions, newSession];
  setSessions(updated);
  setActiveSessionId(newSession.id);
  cfg.onUpdate?.({ sessions: updated, activeSessionId: newSession.id }); // partial
}}

      className="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-slate-700"
    >
      <Plus className="h-3 w-3" />
    </button>
  </div>
  <p className="text-xs text-gray-500 mt-1">Double-click session to manage links</p>
</div>

      {/* Add Link Form */}
<div className="px-3 pb-2">
  {notice && (
    <div className="mb-2 text-xs text-gray-700 dark:text-gray-300">
      {notice}
    </div>
  )}
  <div className="flex gap-2">
    <Input
      ref={titleRef}  // ADD
      placeholder="Title"
      value={newTitle}
      onChange={(e) => {
        if (notice) setNotice(null);   // ADD
        setNewTitle(e.target.value);
      }}
      className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
    />
    <Input
      placeholder="https://url"
      value={newUrl}
      onChange={(e) => {
        if (notice) setNotice(null);   // ADD
        setNewUrl(e.target.value);
      }}
      className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
      onKeyDown={(e) => e.key === 'Enter' && addLink()}
    />
    <Button onClick={addLink} disabled={saving}>Add</Button>
  </div>
</div>


      {/* Links grid */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {cfg.links.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              No links in {activeSession.name} yet
            </p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {cfg.links.slice(0, cfg.maxLinks).map((link) => (
  <div
    key={link.id}
    className="relative rounded-lg border p-3 hover:opacity-90 focus-within:ring bg-white dark:bg-slate-900 dark:border-slate-700"
  >
    
    
    
    {/* Remove (X) button sits OUTSIDE the anchor so it doesn’t open the link */}
    <button
      type="button"
      className="absolute top-1 right-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
      onClick={() => handleRemoveLink(link.id)}
      aria-label={`Remove link '${link.title}'`}
      title="Remove"
    >
      <X className="h-3 w-3" />
    </button>

    <a
  href={link.url}
  target={cfg.openInNewTab ? '_blank' : '_self'}
  rel="noreferrer"
  onClick={() => onClickLink(link.id)}
  className="flex items-start gap-2"
  title={link.url}
>
  <img
    src={getFaviconUrl(link.url)}
    alt=""
    className="w-4 h-4 mt-0.5 flex-shrink-0 rounded"
    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
  />
  <div className="flex-1 min-w-0">
    <div className="text-sm font-medium truncate">{link.title}</div>
    <div className="text-xs opacity-70 truncate">{link.url}</div>
  </div>
</a>

  </div>
))}




          </div>
        )}
      </div>

      {/* Session Management Modal */}
{showSessionModal && editingSession && (
  <Dialog open={showSessionModal} onOpenChange={(open) => open ? null : closeSessionManager()}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Manage {editingSession.name}</DialogTitle>
      </DialogHeader>
      {/* Rename session */}
<div className="mt-2 mb-4">
  <label className="block text-sm font-medium mb-1">Session name</label>
  <div className="flex items-center gap-2">
    <Input
      value={editName}
      onChange={(e) => {
        const v = e.target.value;
        setEditName(v);
        // validate live; only when we have a valid editing id
        setEditError(editingId ? validateSessionName(v, sessions, editingId) : null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleRenameSession();
      }}
      className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
      placeholder="e.g., Study – Biology"
    />
    <Button
      onClick={handleRenameSession}
      disabled={!!editError || editName.trim().length === 0}
      title={editError ?? "Save name"}
    >
      Save
    </Button>
  </div>
  {editError && <p className="mt-1 text-xs text-red-500">{editError}</p>}
</div>

      {/* Rename session */}
<div className="mt-2 mb-4">
  <label className="block text-sm font-medium mb-1">Session name</label>
  <div className="flex items-center gap-2">
    <Input
      value={editName}
      onChange={(e) => {
        const v = e.target.value;
        setEditName(v);
        // validate live; only when we have a valid editing id
        setEditError(editingId ? validateSessionName(v, sessions, editingId) : null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleRenameSession();
      }}
      className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
      placeholder="e.g., Study – Biology"
    />
    <Button
      onClick={handleRenameSession}
      disabled={!!editError || editName.trim().length === 0}
      title={editError ?? "Save name"}
    >
      Save
    </Button>
  </div>
  {editError && <p className="mt-1 text-xs text-red-500">{editError}</p>}
</div>

      

      {/* Links in this session */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {editingSession.links.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No links in this session yet</p>
        ) : (
          editingSession.links.map(link => (
            <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg group">
              <img
                src={getFaviconUrl(link.url)}
                alt=""
                className="w-5 h-5 flex-shrink-0 rounded"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{link.title}</div>
                <div className="text-xs text-gray-500 truncate">{link.url}</div>
              </div>

              {/* Remove in-modal */}
              <button
                onClick={() => {
                  // 1) update main sessions
                  const updated = sessions.map(s =>
                    s.id === editingSession.id
                      ? { ...s, links: s.links.filter(l => l.id !== link.id) }
                      : s
                  );
                  setSessions(updated);
                  cfg.onUpdate?.({ sessions: updated }); // repo rule: partial

                  // 2) update editing snapshot so UI reflects immediately
                  setEditingSession({
                    ...editingSession,
                    links: editingSession.links.filter(l => l.id !== link.id),
                  });
                }}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                title="Remove"
                aria-label="Remove"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </button>

              {link.clicks > 0 && (
                <span className="text-xs text-gray-400">{link.clicks} clicks</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="destructive"
          onClick={() => {
            if (sessions.length <= 1) return; // don't allow deleting the last session
            const updated = sessions.filter(s => s.id !== editingSession.id);
            setSessions(updated);
            cfg.onUpdate?.({ sessions: updated });

            if (activeSessionId === editingSession.id) {
              setActiveSessionId(updated[0]?.id ?? 'default');
              cfg.onUpdate?.({ activeSessionId: updated[0]?.id ?? 'default' });
            }
            closeSessionManager();
          }}
          disabled={sessions.length <= 1}
          title={sessions.length <= 1 ? "Keep at least one session" : "Delete this session"}
        >
          Delete Session
        </Button>

        <div className="space-x-2">
          {/* Optional future: Open All / Copy All */}
          <Button onClick={closeSessionManager}>Done</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}

    </div>
  );
}
