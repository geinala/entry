ALTER TABLE "route_legs" ALTER COLUMN "encoded_polyline" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "solutions" ALTER COLUMN "routes" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "vehicle_routes" ADD COLUMN "full_encoded_polyline" text;--> statement-breakpoint
ALTER TABLE "vehicle_routes" ADD COLUMN "full_encoded_polyline_precision" integer DEFAULT 5;--> statement-breakpoint
CREATE UNIQUE INDEX "route_legs_vehicle_route_sequence_unique" ON "route_legs" USING btree ("vehicle_route_id","sequence");--> statement-breakpoint
CREATE INDEX "route_legs_sequence_idx" ON "route_legs" USING btree ("sequence");