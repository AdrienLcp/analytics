-- Page views counted under taverla after 0003 ran, until Melee's tracker sent
-- melee, merge into melee the same way, before the taverla site id is dropped.
UPDATE page_views SET site = 'melee' WHERE site = 'taverla';

INSERT INTO web_vital_buckets (site, day, path, device, metric, bucket, count)
SELECT 'melee', day, path, device, metric, bucket, count
FROM web_vital_buckets
WHERE site = 'taverla'
ON CONFLICT (site, day, path, device, metric, bucket)
DO UPDATE SET count = count + excluded.count;

DELETE FROM web_vital_buckets WHERE site = 'taverla';
