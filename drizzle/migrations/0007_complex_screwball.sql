ALTER TABLE "simulation_jobs" ADD COLUMN "depot_id" integer;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "depot_id" integer;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD CONSTRAINT "simulation_jobs_depot_id_depots_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."depots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_depot_id_depots_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."depots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulations_depot_id_idx" ON "simulations" USING btree ("depot_id");