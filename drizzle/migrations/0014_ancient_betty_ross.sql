ALTER TABLE "simulation_uploaded_files" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_files" ALTER COLUMN "status" SET DEFAULT 'uploaded';