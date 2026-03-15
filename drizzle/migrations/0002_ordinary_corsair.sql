CREATE TABLE "route_legs" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_route_id" integer,
	"origin_node_id" integer,
	"destination_node_id" integer,
	"sequence" integer NOT NULL,
	"encoded_polyline" varchar NOT NULL,
	"encoded_polyline_precision" integer DEFAULT 5 NOT NULL,
	"distance_in_meters" integer NOT NULL,
	"travel_time_in_seconds" integer NOT NULL,
	"traffic_delay_in_seconds" integer NOT NULL,
	"traffic_distance_in_meters" integer NOT NULL,
	"departure_time" timestamp with time zone NOT NULL,
	"arrival_time" timestamp with time zone NOT NULL,
	"no_traffic_travel_time_in_seconds" integer NOT NULL,
	"historic_traffic_travel_time_in_seconds" integer NOT NULL,
	"live_traffic_incidents_travel_time_in_seconds" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"solution_id" integer,
	"vehicle_id" integer,
	"route_version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"total_distance_in_meters" integer NOT NULL,
	"total_time_in_seconds" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_vehicle_route_id_vehicle_routes_id_fk" FOREIGN KEY ("vehicle_route_id") REFERENCES "public"."vehicle_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_origin_node_id_nodes_id_fk" FOREIGN KEY ("origin_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_destination_node_id_nodes_id_fk" FOREIGN KEY ("destination_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_routes" ADD CONSTRAINT "vehicle_routes_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_routes" ADD CONSTRAINT "vehicle_routes_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "route_legs_vehicle_route_id_idx" ON "route_legs" USING btree ("vehicle_route_id");--> statement-breakpoint
CREATE INDEX "route_legs_origin_node_id_idx" ON "route_legs" USING btree ("origin_node_id");--> statement-breakpoint
CREATE INDEX "route_legs_destination_node_id_idx" ON "route_legs" USING btree ("destination_node_id");--> statement-breakpoint
CREATE INDEX "vehicle_routes_solution_id_idx" ON "vehicle_routes" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "vehicle_routes_vehicle_id_idx" ON "vehicle_routes" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "solutions_simulation_id_idx" ON "solutions" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "solutions_vehicle_id_idx" ON "solutions" USING btree ("vehicle_id");