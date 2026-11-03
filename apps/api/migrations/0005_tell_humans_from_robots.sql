-- A human's page view is one whose browser did not declare itself automated
-- and that someone then engaged with. Rows recorded before either was asked
-- had passed the crawler filter of the time, so they keep counting as engaged.
ALTER TABLE page_views ADD COLUMN is_automated INTEGER NOT NULL DEFAULT 0;
ALTER TABLE page_views ADD COLUMN is_engaged INTEGER NOT NULL DEFAULT 1;

-- Drawn by the tracker for one page view and cleared once its engagement
-- arrives: it names a page load, never a visitor.
ALTER TABLE page_views ADD COLUMN view_key TEXT;

CREATE INDEX page_views_by_view_key ON page_views (view_key)
WHERE view_key IS NOT NULL;

-- The headless browser that loaded the portfolio's home page twice a day from
-- 4 October 2026 without ever being touched or sending a Web Vital: from the
-- US, in en-US, in a tablet-wide window, light theme, no referrer.
UPDATE page_views SET is_engaged = 0
WHERE site = 'portfolio'
  AND path = '/'
  AND country = 'US'
  AND locale = 'en-US'
  AND device = 'tablet'
  AND theme = 'light'
  AND referrer_host IS NULL;
