ALTER TABLE "simulation_jobs" ADD COLUMN "validation_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "validation_completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "geocoding_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD COLUMN "calculation_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "simulation_jobs" DROP COLUMN "validated_at";