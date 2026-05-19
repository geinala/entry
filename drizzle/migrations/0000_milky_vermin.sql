CREATE TYPE "public"."calculation_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."geocoding_status_enum" AS ENUM('pending', 'in_progress', 'needed_review', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."matrix_batch_status_enum" AS ENUM('submitted', 'validated', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."resolution_status" AS ENUM('pending', 'auto_solved', 'needed_review', 'failed', 'manual_override');--> statement-breakpoint
CREATE TYPE "public"."route_status_enum" AS ENUM('planned', 'running', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."simulation_cleaning_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'needed_review', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_file_validation_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'needed_review', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_job_status_enum" AS ENUM('uploaded', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_status_enum" AS ENUM('optimizing', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."waitlist_status_enum" AS ENUM('pending', 'sending', 'confirmed', 'denied', 'invited', 'revoked', 'failed', 'expired');--> statement-breakpoint
CREATE TABLE "courier_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"solution_id" integer,
	"courier_id" integer,
	"route_version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"total_distance_in_meters" integer NOT NULL,
	"total_time_in_seconds" integer NOT NULL,
	"reoptimized_from_route_id" integer,
	"trigger_node_id" integer,
	"triggered_by_traffic" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "couriers" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"name" varchar NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matrix_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"origin_start_index" integer NOT NULL,
	"origin_end_index" integer NOT NULL,
	"destination_start_index" integer NOT NULL,
	"destination_end_index" integer NOT NULL,
	"tomtom_job_id" varchar NOT NULL,
	"status" "matrix_batch_status_enum" DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "matrix_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"origin_index" integer NOT NULL,
	"destination_index" integer NOT NULL,
	"length_in_meters" integer NOT NULL,
	"travel_time_in_seconds" integer NOT NULL,
	"traffic_delay_in_seconds" integer NOT NULL,
	"matrix_batch_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "node_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" integer,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"weight" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"matrix_index" integer NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"demand" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer,
	"permission_id" integer
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "route_legs" (
	"id" serial PRIMARY KEY NOT NULL,
	"courier_route_id" integer,
	"origin_latitude" double precision NOT NULL,
	"origin_longitude" double precision NOT NULL,
	"destination_latitude" double precision NOT NULL,
	"destination_longitude" double precision NOT NULL,
	"sequence" integer NOT NULL,
	"encoded_polyline" text NOT NULL,
	"encoded_polyline_precision" integer DEFAULT 5 NOT NULL,
	"distance_in_meters" integer NOT NULL,
	"travel_time_in_seconds" integer NOT NULL,
	"traffic_delay_in_seconds" integer NOT NULL,
	"traffic_distance_in_meters" integer NOT NULL,
	"departure_time" timestamp with time zone NOT NULL,
	"arrival_time" timestamp with time zone NOT NULL,
	"no_traffic_travel_time_in_seconds" integer NOT NULL,
	"historic_traffic_travel_time_in_seconds" integer NOT NULL,
	"live_traffic_incidents_travel_time_in_seconds" integer NOT NULL,
	"route_status" "route_status_enum" DEFAULT 'planned' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulation_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(300) NOT NULL,
	"depot_location_address" varchar NOT NULL,
	"depot_location_latitude" double precision NOT NULL,
	"depot_location_longitude" double precision NOT NULL,
	"max_computation_time_in_seconds" integer DEFAULT 600 NOT NULL,
	"started_at" timestamp with time zone,
	"status" "simulation_job_status_enum" DEFAULT 'uploaded' NOT NULL,
	"current_step" integer DEFAULT 0 NOT NULL,
	"file_path" varchar,
	"file_validation_status" "simulation_file_validation_status_enum" DEFAULT 'uploaded' NOT NULL,
	"file_total_rows" integer,
	"file_valid_rows" integer DEFAULT 0 NOT NULL,
	"file_invalid_rows" integer DEFAULT 0 NOT NULL,
	"file_processed_rows" integer,
	"file_progress_percentage" integer DEFAULT 0,
	"file_validation_started_at" timestamp with time zone,
	"file_validation_completed_at" timestamp with time zone,
	"cleaning_total_rows" integer DEFAULT 0,
	"cleaning_processed_rows" integer DEFAULT 0,
	"cleaning_progress_percentage" integer DEFAULT 0,
	"cleaning_status" "simulation_cleaning_status_enum" DEFAULT 'pending' NOT NULL,
	"cleaning_started_at" timestamp with time zone,
	"cleaning_completed_at" timestamp with time zone,
	"geocoding_total_rows" integer DEFAULT 0,
	"geocoding_processed_rows" integer DEFAULT 0,
	"geocoding_progress_percentage" integer DEFAULT 0,
	"geocoding_estimated_completion_time" timestamp with time zone,
	"geocoding_status" "geocoding_status_enum" DEFAULT 'pending' NOT NULL,
	"geocoding_started_at" timestamp with time zone,
	"geocoded_at" timestamp with time zone,
	"calculation_status" "calculation_status_enum" DEFAULT 'pending' NOT NULL,
	"calculation_started_at" timestamp with time zone,
	"calculated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(300) NOT NULL,
	"status" "simulation_status_enum" DEFAULT 'optimizing' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"computation_time_limit_in_seconds" integer DEFAULT 600 NOT NULL,
	"depot_location_address" varchar NOT NULL,
	"depot_location_latitude" double precision NOT NULL,
	"depot_location_longitude" double precision NOT NULL,
	"total_demand_in_kilograms" real DEFAULT 0 NOT NULL,
	"total_distance_in_meters" integer DEFAULT 0 NOT NULL,
	"total_couriers" integer DEFAULT 0 NOT NULL,
	"total_duration_in_seconds" integer DEFAULT 0 NOT NULL,
	"total_active_couriers" integer DEFAULT 0 NOT NULL,
	"total_completed_nodes" integer DEFAULT 0 NOT NULL,
	"total_nodes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulation_uploaded_rows" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_job_id" uuid,
	"nosi" varchar,
	"courier" varchar,
	"customer_name" varchar,
	"address" varchar,
	"normalized_address" varchar,
	"suggested_address" varchar,
	"final_address" varchar,
	"city" varchar,
	"weight" real,
	"latitude" double precision,
	"longitude" double precision,
	"geocode_score" double precision,
	"geocode_provider" varchar,
	"geocode_response" jsonb,
	"resolution_status" "resolution_status" DEFAULT 'pending' NOT NULL,
	"resolution_source" varchar,
	"is_ignored" boolean DEFAULT false NOT NULL,
	"start_datetime" timestamp with time zone,
	"end_datetime" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"error_details" jsonb
);
--> statement-breakpoint
CREATE TABLE "solutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"courier_id" integer,
	"routes" jsonb NOT NULL,
	"demand_in_kilograms" real NOT NULL,
	"time_in_seconds" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"role_id" integer NOT NULL,
	"user_id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_invitation_id" varchar,
	"email" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"status" "waitlist_status_enum" DEFAULT 'pending' NOT NULL,
	"ticket_id" varchar,
	"invited_at" timestamp with time zone,
	"expired_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_clerk_invitation_id_unique" UNIQUE("clerk_invitation_id"),
	CONSTRAINT "waitlist_email_unique" UNIQUE("email"),
	CONSTRAINT "waitlist_ticket_id_unique" UNIQUE("ticket_id")
);
--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_trigger_node_id_nodes_id_fk" FOREIGN KEY ("trigger_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_reoptimized_from_route_id_courier_routes_id_fk" FOREIGN KEY ("reoptimized_from_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_batches" ADD CONSTRAINT "matrix_batches_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_results" ADD CONSTRAINT "matrix_results_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_results" ADD CONSTRAINT "matrix_results_matrix_batch_id_matrix_batches_id_fk" FOREIGN KEY ("matrix_batch_id") REFERENCES "public"."matrix_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_details" ADD CONSTRAINT "node_details_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_courier_route_id_courier_routes_id_fk" FOREIGN KEY ("courier_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD CONSTRAINT "simulation_jobs_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD CONSTRAINT "simulation_uploaded_rows_simulation_job_id_simulation_jobs_id_fk" FOREIGN KEY ("simulation_job_id") REFERENCES "public"."simulation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "courier_routes_solution_id_idx" ON "courier_routes" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "courier_routes_courier_id_idx" ON "courier_routes" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "couriers_simulation_id_idx" ON "couriers" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "matrix_batches_simulation_id_idx" ON "matrix_batches" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "matrix_results_simulation_id_idx" ON "matrix_results" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "matrix_results_matrix_batch_id_idx" ON "matrix_results" USING btree ("matrix_batch_id");--> statement-breakpoint
CREATE INDEX "node_details_node_id_idx" ON "node_details" USING btree ("node_id");--> statement-breakpoint
CREATE INDEX "nodes_simulation_id_idx" ON "nodes" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "route_legs_courier_route_id_idx" ON "route_legs" USING btree ("courier_route_id");--> statement-breakpoint
CREATE INDEX "route_legs_origin_coordinates_idx" ON "route_legs" USING btree ("origin_latitude","origin_longitude");--> statement-breakpoint
CREATE INDEX "route_legs_destination_coordinates_idx" ON "route_legs" USING btree ("destination_latitude","destination_longitude");--> statement-breakpoint
CREATE UNIQUE INDEX "route_legs_courier_route_sequence_unique" ON "route_legs" USING btree ("courier_route_id","sequence");--> statement-breakpoint
CREATE INDEX "route_legs_sequence_idx" ON "route_legs" USING btree ("sequence");--> statement-breakpoint
CREATE INDEX "simulations_user_id_idx" ON "simulations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "simulations_status_idx" ON "simulations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "simulation_uploaded_rows_simulation_job_id_idx" ON "simulation_uploaded_rows" USING btree ("simulation_job_id");--> statement-breakpoint
CREATE INDEX "simulation_uploaded_rows_nosi_idx" ON "simulation_uploaded_rows" USING btree ("nosi");--> statement-breakpoint
CREATE INDEX "solutions_simulation_id_idx" ON "solutions" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "solutions_courier_id_idx" ON "solutions" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "users_user_id_idx" ON "users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_role_id_idx" ON "users" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_waitlist_status" ON "waitlist" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_waitlist_email" ON "waitlist" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_waitlist_ticket_id" ON "waitlist" USING btree ("ticket_id");