CREATE TABLE "depots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "depots_name_idx" ON "depots" USING btree ("name");--> statement-breakpoint
CREATE INDEX "depots_coordinates_idx" ON "depots" USING btree ("latitude","longitude");