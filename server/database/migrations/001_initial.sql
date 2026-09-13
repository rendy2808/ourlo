CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('wedding', 'engagement', 'tennis', 'other')),
  event_date TEXT NOT NULL,
  active_from TEXT NOT NULL,
  active_until TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  max_photos_per_pass INTEGER NOT NULL CHECK (max_photos_per_pass >= 0),
  max_ai_per_pass INTEGER NOT NULL DEFAULT 0 CHECK (max_ai_per_pass >= 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'active', 'ended', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (active_until > active_from)
);

CREATE TABLE guest_passes (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  photo_quota INTEGER NOT NULL CHECK (photo_quota >= 0),
  ai_quota INTEGER NOT NULL DEFAULT 0 CHECK (ai_quota >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'exhausted')),
  activated_at TEXT,
  last_used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX guest_passes_event_id_index ON guest_passes(event_id);

CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  layout_type TEXT NOT NULL CHECK (layout_type IN ('single', 'strip', 'grid')),
  slot_count INTEGER NOT NULL CHECK (slot_count BETWEEN 1 AND 4),
  aspect_ratio TEXT NOT NULL,
  orientation TEXT NOT NULL CHECK (orientation IN ('portrait', 'landscape', 'square')),
  configuration_json TEXT NOT NULL DEFAULT '{}',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_templates (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, template_id)
);

CREATE TABLE ai_filters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  engine TEXT NOT NULL,
  model TEXT NOT NULL,
  strength REAL NOT NULL DEFAULT 0.5 CHECK (strength BETWEEN 0 AND 1),
  preview_storage_key TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_ai_filters (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ai_filter_id TEXT NOT NULL REFERENCES ai_filters(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, ai_filter_id)
);

CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_pass_id TEXT NOT NULL REFERENCES guest_passes(id) ON DELETE RESTRICT,
  template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
  ai_filter_id TEXT REFERENCES ai_filters(id) ON DELETE SET NULL,
  storage_key TEXT,
  mime_type TEXT,
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  failure_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE INDEX photos_event_id_index ON photos(event_id);
CREATE INDEX photos_guest_pass_id_index ON photos(guest_pass_id);

CREATE TABLE usage_records (
  id TEXT PRIMARY KEY,
  guest_pass_id TEXT NOT NULL REFERENCES guest_passes(id) ON DELETE CASCADE,
  photo_id TEXT REFERENCES photos(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('photo', 'ai')),
  amount INTEGER NOT NULL DEFAULT 1 CHECK (amount > 0),
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX usage_records_guest_pass_id_index ON usage_records(guest_pass_id);
