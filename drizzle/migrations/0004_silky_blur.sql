CREATE TABLE "simulation_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"courier_route_id" integer,
	"courier_id" integer,
	"log_level" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"latitude" double precision,
	"longitude" double precision,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "simulation_logs" ADD CONSTRAINT "simulation_logs_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_logs" ADD CONSTRAINT "simulation_logs_courier_route_id_courier_routes_id_fk" FOREIGN KEY ("courier_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_logs" ADD CONSTRAINT "simulation_logs_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulation_logs_simulation_id_idx" ON "simulation_logs" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "simulation_logs_courier_route_id_idx" ON "simulation_logs" USING btree ("courier_route_id");--> statement-breakpoint
CREATE INDEX "simulation_logs_courier_id_idx" ON "simulation_logs" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "optimization_runs_simulation_id_idx" ON "optimization_runs" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "optimization_runs_courier_route_id_idx" ON "optimization_runs" USING btree ("courier_route_id");