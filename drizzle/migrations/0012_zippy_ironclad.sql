ALTER TABLE "simulation_uploaded_files" RENAME COLUMN "file_url" TO "file_name";--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" DROP CONSTRAINT "simulation_uploaded_files_simulation_id_simulations_id_fk";
--> statement-breakpoint
DROP INDEX "simulation_uploaded_files_simulation_id_idx";--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "upload_id" integer;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD COLUMN "file_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD COLUMN "file_error_path" varchar;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD COLUMN "validated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_upload_id_simulation_uploaded_files_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."simulation_uploaded_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ADD CONSTRAINT "simulation_uploaded_files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulation_uploaded_files_user_id_idx" ON "simulation_uploaded_files" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" DROP COLUMN "simulation_id";