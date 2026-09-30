-- One row per page view. No IP address, user agent, cookie or hash of either
-- is ever stored: nothing here can tell two visitors apart.
CREATE TABLE page_views (
  id INTEGER PRIMARY KEY,
  site TEXT NOT NULL,
  path TEXT NOT NULL,
  is_entry INTEGER NOT NULL,
  referrer_host TEXT,
  country TEXT,
  locale TEXT,
  theme TEXT NOT NULL,
  device TEXT NOT NULL,
  viewed_at TEXT NOT NULL
);

CREATE INDEX page_views_by_site_and_time ON page_views (site, viewed_at);
