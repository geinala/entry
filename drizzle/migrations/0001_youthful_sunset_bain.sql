CREATE TYPE "public"."matrix_type_enum" AS ENUM('initial', 'reoptimized');--> statement-breakpoint
ALTER TABLE "matrix_batches" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "matrix_batches" CASCADE;--> statement-breakpoint
ALTER TABLE "matrix_results" RENAME COLUMN "matrix_batch_id" TO "matrix_stage";--> statement-breakpoint
-- ALTER TABLE "matrix_results" DROP CONSTRAINT "matrix_results_matrix_batch_id_matrix_batches_id_fk";
--> statement-breakpoint
DROP INDEX "matrix_results_matrix_batch_id_idx";--> statement-breakpoint
ALTER TABLE "matrix_results" ADD COLUMN "matrix_type" "matrix_type_enum" NOT NULL;--> statement-breakpoint
DROP TYPE "public"."matrix_batch_status_enum";