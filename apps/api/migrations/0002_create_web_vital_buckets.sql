-- Web Vitals are kept as counts per range of values, never one row per page
-- load: no set of measurements can be followed back to a single visit.
CREATE TABLE web_vital_buckets (
  site TEXT NOT NULL,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  device TEXT NOT NULL,
  metric TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (site, day, path, device, metric, bucket)
) WITHOUT ROWID;
