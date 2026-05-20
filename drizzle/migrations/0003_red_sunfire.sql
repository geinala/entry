CREATE TABLE "optimization_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"courier_route_id" integer,
	"run_type" varchar NOT NULL,
	"algorithm" varchar NOT NULL,
	"trigger_type" varchar NOT NULL,
	"total_distance_in_meters" integer NOT NULL,
	"total_travel_time_in_seconds" integer NOT NULL,
	"computation_time_in_ms" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "optimization_runs" ADD CONSTRAINT "optimization_runs_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_runs" ADD CONSTRAINT "optimization_runs_courier_route_id_courier_routes_id_fk" FOREIGN KEY ("courier_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;