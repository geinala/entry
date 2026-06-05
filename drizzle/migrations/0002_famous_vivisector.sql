ALTER TYPE "public"."route_status_enum" ADD VALUE 'baseline_planned' BEFORE 'planned';--> statement-breakpoint
ALTER TYPE "public"."route_status_enum" ADD VALUE 'baseline_running' BEFORE 'planned';--> statement-breakpoint
ALTER TYPE "public"."route_status_enum" ADD VALUE 'baseline_completed' BEFORE 'planned';