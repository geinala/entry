ALTER TABLE "nodes"
ALTER COLUMN "latitude"
SET DATA TYPE double precision
USING latitude::double precision;

ALTER TABLE "nodes"
ALTER COLUMN "longitude"
SET DATA TYPE double precision
USING longitude::double precision;