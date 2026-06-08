CREATE TYPE "public"."tuning_experiment_dataset_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'cleaning', 'cleaned', 'geocoding', 'geocoded', 'completed', 'failed');--> statement-breakpoint
DROP INDEX "tuning_experiments_status_idx";--> statement-breakpoint
ALTER TABLE "tuning_experiment_datasets" ADD COLUMN "status" "tuning_experiment_dataset_status_enum" DEFAULT 'uploaded' NOT NULL;--> statement-breakpoint
CREATE INDEX "tuning_experiment_datasets_status_idx" ON "tuning_experiment_datasets" USING btree ("status");--> statement-breakpoint
ALTER TABLE "tuning_experiments" DROP COLUMN "status";