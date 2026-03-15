CREATE TABLE "solutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"vehicle_id" integer,
	"routes" json NOT NULL,
	"demand_in_kilograms" real NOT NULL,
	"time_in_seconds" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;