CREATE TABLE "node_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" integer,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"district" varchar NOT NULL,
	"weight" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"latitude" varchar NOT NULL,
	"longitude" varchar NOT NULL,
	"demand" integer NOT NULL,
	"is_depot" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "node_details" ADD CONSTRAINT "node_details_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "node_details_node_id_idx" ON "node_details" USING btree ("node_id");--> statement-breakpoint
CREATE INDEX "nodes_simulation_id_idx" ON "nodes" USING btree ("simulation_id");