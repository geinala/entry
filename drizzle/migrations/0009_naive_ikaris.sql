CREATE TYPE "public"."simulation_status_enum" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(300) NOT NULL,
	"status" "simulation_status_enum" DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulations_user_id_idx" ON "simulations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "simulations_status_idx" ON "simulations" USING btree ("status");