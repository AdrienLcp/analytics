-- Taverla was renamed Melee: its history moves to the new site id. Buckets are
-- merged rather than renamed, since the tracker may already have filled some
-- under melee and the primary key includes the site.
UPDATE page_views SET site = 'melee' WHERE site = 'taverla';

INSERT INTO web_vital_buckets (site, day, path, device, metric, bucket, count)
SELECT 'melee', day, path, device, metric, bucket, count
FROM web_vital_buckets
WHERE site = 'taverla'
ON CONFLICT (site, day, path, device, metric, bucket)
DO UPDATE SET count = count + excluded.count;

DELETE FROM web_vital_buckets WHERE site = 'taverla';
