CREATE TYPE "public"."calculation_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."geocoding_status_enum" AS ENUM('pending', 'in_progress', 'needed_review', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."matrix_batch_status_enum" AS ENUM('submitted', 'validated', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."optimization_algorithm_enum" AS ENUM('manual_without_optimization', 'manual_with_optimization', 'google_or_tools');--> statement-breakpoint
CREATE TYPE "public"."reoptimization_outcome_enum" AS ENUM('resequencing_applied', 'duration_updated', 'no_improvement');--> statement-breakpoint
CREATE TYPE "public"."resolution_status" AS ENUM('pending', 'auto_solved', 'needed_review', 'failed', 'manual_override');--> statement-breakpoint
CREATE TYPE "public"."route_status_enum" AS ENUM('baseline_planned', 'baseline_running', 'baseline_completed', 'planned', 'running', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."simulation_cleaning_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'needed_review', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_file_validation_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'needed_review', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_job_status_enum" AS ENUM('uploaded', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_status_enum" AS ENUM('pending', 'stopped', 'optimizing', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."tuning_experiment_dataset_status_enum" AS ENUM('uploaded', 'validating', 'validated', 'cleaning', 'cleaned', 'geocoding', 'geocoded', 'completed', 'failed');--> statement-breakpoint
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
	"is_initial_route" boolean DEFAULT false NOT NULL,
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
CREATE TABLE "daily_optimization_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" uuid,
	"date" date NOT NULL,
	"total_nodes" integer NOT NULL,
	"total_couriers" integer NOT NULL,
	"execution_time_ms" real NOT NULL,
	"total_fitness_score" real NOT NULL,
	"improvement_percentage" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "depots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
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
	"courier_id" integer,
	"matrix_index" integer NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"completed_by" integer,
	"demand" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "optimization_iterations" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"solution_id" integer,
	"courier_id" integer,
	"event_type" varchar(100),
	"iteration" integer NOT NULL,
	"elapsed_ms" double precision,
	"timestamp" timestamp,
	"current_distance_in_meters" double precision,
	"current_duration_in_seconds" double precision,
	"best_distance_in_meters" double precision,
	"best_duration_in_seconds" double precision,
	"distance_improvement_in_meters" double precision,
	"duration_improvement_in_seconds" double precision,
	"improvement_percent" double precision,
	"iterations_without_improvement" integer,
	"objective_value" double precision,
	"operator_used" varchar(100),
	"is_new_best" boolean DEFAULT false,
	"triggered_diversification" boolean DEFAULT false,
	"used_aspiration_criteria" boolean DEFAULT false,
	"active_routes_count" integer,
	"unassigned_nodes_count" integer,
	"message" text,
	"intermediate_tour" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "optimization_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"congestion_check_id" integer,
	"courier_id" integer NOT NULL,
	"run_type" varchar NOT NULL,
	"algorithm" varchar,
	"trigger_type" varchar NOT NULL,
	"total_distance_in_meters" integer NOT NULL,
	"total_travel_time_in_seconds" integer NOT NULL,
	"computation_time_in_ms" real NOT NULL,
	"total_nodes_explored" integer NOT NULL,
	"triggered_at" timestamp with time zone NOT NULL,
	"before_total_distance_in_meters" integer,
	"before_total_travel_time_in_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reoptimization_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"optimization_run_id" integer,
	"congestion_check_id" integer,
	"reopt_sequence" integer NOT NULL,
	"triggered_at" timestamp with time zone NOT NULL,
	"before_route_id" integer,
	"before_total_distance_in_meters" integer NOT NULL,
	"before_total_time_in_seconds" integer NOT NULL,
	"after_route_id" integer,
	"after_total_distance_in_meters" integer NOT NULL,
	"after_total_time_in_seconds" integer NOT NULL,
	"distance_saved_in_meters" integer NOT NULL,
	"time_saved_in_seconds" integer NOT NULL,
	"courier_position" jsonb NOT NULL,
	"algorithm_used" varchar,
	"computation_time_in_ms" real NOT NULL,
	"total_incident_delay_in_seconds" integer,
	"outcome" "reoptimization_outcome_enum" NOT NULL,
	"trigger_route_leg_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_leg_congestion_check_incidents" (
	"id" serial PRIMARY KEY NOT NULL,
	"congestion_check_id" integer NOT NULL,
	"traffic_incident_id" integer NOT NULL,
	"delay_in_seconds" integer NOT NULL,
	"overlap_ratio" real NOT NULL,
	"rejected_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"route_intersects" boolean DEFAULT false NOT NULL,
	"is_valid_congestion" boolean DEFAULT false NOT NULL,
	"direction_matches" boolean DEFAULT false NOT NULL,
	"route_point_count" integer,
	"incident_point_count" integer,
	"cluster_group" smallint,
	"delay_contribution_in_seconds" integer DEFAULT 0 NOT NULL,
	"chosen_for_reopt" boolean DEFAULT false NOT NULL,
	"delay_threshold_in_seconds" integer NOT NULL,
	"overlap_threshold" real NOT NULL,
	"proximity_threshold_in_meters" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_leg_congestion_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"route_leg_id" integer,
	"courier_id" integer,
	"checked_at" timestamp with time zone NOT NULL,
	"bbox_min_lng" double precision NOT NULL,
	"bbox_min_lat" double precision NOT NULL,
	"bbox_max_lng" double precision NOT NULL,
	"bbox_max_lat" double precision NOT NULL,
	"incidents_found" integer DEFAULT 0 NOT NULL,
	"accepted_incident_count" integer DEFAULT 0 NOT NULL,
	"total_delay_in_seconds" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_legs" (
	"id" serial PRIMARY KEY NOT NULL,
	"courier_route_id" integer,
	"from_node_id" integer,
	"to_node_id" integer,
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
	"status" "simulation_job_status_enum" DEFAULT 'uploaded' NOT NULL,
	"current_step" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"depot_id" integer NOT NULL,
	"depot_location_address" varchar NOT NULL,
	"depot_location_latitude" double precision NOT NULL,
	"depot_location_longitude" double precision NOT NULL,
	"resequence_improvement_threshold_percent" real DEFAULT 5,
	"congestion_delay_threshold_in_seconds" integer DEFAULT 300,
	"is_with_adaptive_parameters" boolean DEFAULT false NOT NULL,
	"total_demand_in_kilograms" real DEFAULT 0 NOT NULL,
	"total_couriers" integer DEFAULT 0 NOT NULL,
	"total_active_couriers" integer DEFAULT 0 NOT NULL,
	"total_nodes" integer DEFAULT 0 NOT NULL,
	"file_path" varchar,
	"file_validation_status" "simulation_file_validation_status_enum" DEFAULT 'uploaded' NOT NULL,
	"file_total_rows" integer,
	"file_valid_rows" integer DEFAULT 0 NOT NULL,
	"file_invalid_rows" integer DEFAULT 0 NOT NULL,
	"file_processed_rows" integer,
	"file_progress_percentage" integer DEFAULT 0,
	"file_validation_started_at" timestamp with time zone,
	"file_validation_completed_at" timestamp with time zone,
	"cleaning_status" "simulation_cleaning_status_enum" DEFAULT 'pending' NOT NULL,
	"cleaning_total_rows" integer DEFAULT 0,
	"cleaning_processed_rows" integer DEFAULT 0,
	"cleaning_progress_percentage" integer DEFAULT 0,
	"cleaning_started_at" timestamp with time zone,
	"cleaning_completed_at" timestamp with time zone,
	"geocoding_status" "geocoding_status_enum" DEFAULT 'pending' NOT NULL,
	"geocoding_total_rows" integer DEFAULT 0,
	"geocoding_processed_rows" integer DEFAULT 0,
	"geocoding_progress_percentage" integer DEFAULT 0,
	"geocoding_estimated_completion_time" timestamp with time zone,
	"geocoding_started_at" timestamp with time zone,
	"geocoded_at" timestamp with time zone,
	"calculation_status" "calculation_status_enum" DEFAULT 'pending' NOT NULL,
	"calculation_started_at" timestamp with time zone,
	"calculated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "simulation_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid,
	"courier_route_id" integer,
	"courier_id" integer,
	"log_level" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"latitude" double precision,
	"longitude" double precision,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"simulation_job_id" uuid NOT NULL,
	"title" varchar(300) NOT NULL,
	"status" "simulation_status_enum" DEFAULT 'optimizing' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"is_with_adaptive_parameters" boolean DEFAULT false NOT NULL,
	"resequence_improvement_threshold_percent" real DEFAULT 5,
	"congestion_delay_threshold_in_seconds" integer DEFAULT 300,
	"depot_id" integer NOT NULL,
	"depot_location_address" varchar NOT NULL,
	"depot_location_latitude" double precision NOT NULL,
	"depot_location_longitude" double precision NOT NULL,
	"total_demand_in_kilograms" real DEFAULT 0 NOT NULL,
	"total_couriers" integer DEFAULT 0 NOT NULL,
	"total_active_couriers" integer DEFAULT 0 NOT NULL,
	"total_completed_nodes" integer DEFAULT 0 NOT NULL,
	"total_nodes" integer DEFAULT 0 NOT NULL,
	"initial_total_distance_in_meters" integer DEFAULT 0 NOT NULL,
	"initial_total_duration_in_seconds" integer DEFAULT 0 NOT NULL,
	"final_total_distance_in_meters" integer DEFAULT 0 NOT NULL,
	"final_total_duration_in_seconds" integer DEFAULT 0 NOT NULL,
	"distance_improvement_in_meters" integer DEFAULT 0 NOT NULL,
	"duration_improvement_in_seconds" integer DEFAULT 0 NOT NULL,
	"total_reoptimized_routes" integer DEFAULT 0 NOT NULL,
	"total_incidents_affecting_routes" integer DEFAULT 0 NOT NULL,
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
	"time_in_seconds" integer NOT NULL,
	"distance_in_meters" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tabu_search_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"it_max_multiplier" real NOT NULL,
	"tab_tenure_divider" real NOT NULL,
	"it_cons_multiplier" real NOT NULL,
	"it_div_divider" real NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traffic_incidents" (
	"id" serial PRIMARY KEY NOT NULL,
	"tomtom_incident_id" varchar NOT NULL,
	"simulation_id" uuid,
	"detected_at" timestamp with time zone NOT NULL,
	"category" smallint NOT NULL,
	"delay_in_seconds" integer NOT NULL,
	"geometry" jsonb NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"length_in_meters" integer,
	"from_address" varchar,
	"to_address" varchar,
	"incident_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traffic_incidents_tomtom_incident_id_unique" UNIQUE("tomtom_incident_id")
);
--> statement-breakpoint
CREATE TABLE "tuning_experiment_datasets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"depot_id" integer NOT NULL,
	"file_path" varchar NOT NULL,
	"status" "tuning_experiment_dataset_status_enum" DEFAULT 'uploaded' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tuning_experiment_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"tuning_experiment_id" integer NOT NULL,
	"it_max" integer NOT NULL,
	"tab_tenure" integer NOT NULL,
	"it_cons" integer NOT NULL,
	"it_div" integer NOT NULL,
	"fitness_score" real NOT NULL,
	"execution_time_ms" real NOT NULL,
	"convergence_iteration" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tuning_experiments" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_id" uuid NOT NULL,
	"base_n_c" integer NOT NULL,
	"it_max" integer NOT NULL,
	"tab_tenure" integer NOT NULL,
	"it_cons" integer NOT NULL,
	"it_div" integer NOT NULL,
	"random_seed" integer DEFAULT 42 NOT NULL,
	"early_stop_no_improvement_iterations" integer,
	"initial_fitness_score" real,
	"best_fitness_score" real,
	"execution_time_ms" real,
	"convergence_iteration" integer,
	"improvement_percentage" real,
	"best_route_payload" jsonb,
	"best_iteration_history_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tuning_experiment_uploaded_rows" (
	"id" serial PRIMARY KEY NOT NULL,
	"tuning_experiment_dataset_id" uuid NOT NULL,
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
	"start_datetime" timestamp with time zone,
	"end_datetime" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_trigger_node_id_nodes_id_fk" FOREIGN KEY ("trigger_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_routes" ADD CONSTRAINT "courier_routes_reoptimized_from_route_id_courier_routes_id_fk" FOREIGN KEY ("reoptimized_from_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_optimization_logs" ADD CONSTRAINT "daily_optimization_logs_config_id_tabu_search_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."tabu_search_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_batches" ADD CONSTRAINT "matrix_batches_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_results" ADD CONSTRAINT "matrix_results_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_results" ADD CONSTRAINT "matrix_results_matrix_batch_id_matrix_batches_id_fk" FOREIGN KEY ("matrix_batch_id") REFERENCES "public"."matrix_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_details" ADD CONSTRAINT "node_details_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_completed_by_couriers_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_completed_by_courier_id_couriers_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_iterations" ADD CONSTRAINT "optimization_iterations_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_iterations" ADD CONSTRAINT "optimization_iterations_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_iterations" ADD CONSTRAINT "optimization_iterations_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_runs" ADD CONSTRAINT "optimization_runs_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_runs" ADD CONSTRAINT "optimization_runs_congestion_check_id_route_leg_congestion_checks_id_fk" FOREIGN KEY ("congestion_check_id") REFERENCES "public"."route_leg_congestion_checks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optimization_runs" ADD CONSTRAINT "optimization_runs_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reoptimization_events" ADD CONSTRAINT "reoptimization_events_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reoptimization_events" ADD CONSTRAINT "reoptimization_events_optimization_run_id_optimization_runs_id_fk" FOREIGN KEY ("optimization_run_id") REFERENCES "public"."optimization_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reoptimization_events" ADD CONSTRAINT "reoptimization_events_congestion_check_id_route_leg_congestion_checks_id_fk" FOREIGN KEY ("congestion_check_id") REFERENCES "public"."route_leg_congestion_checks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reoptimization_events" ADD CONSTRAINT "reoptimization_events_before_route_id_courier_routes_id_fk" FOREIGN KEY ("before_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reoptimization_events" ADD CONSTRAINT "reoptimization_events_after_route_id_courier_routes_id_fk" FOREIGN KEY ("after_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reoptimization_events" ADD CONSTRAINT "reoptimization_events_trigger_route_leg_id_route_legs_id_fk" FOREIGN KEY ("trigger_route_leg_id") REFERENCES "public"."route_legs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_check_incidents" ADD CONSTRAINT "route_leg_congestion_check_incidents_congestion_check_id_route_leg_congestion_checks_id_fk" FOREIGN KEY ("congestion_check_id") REFERENCES "public"."route_leg_congestion_checks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_check_incidents" ADD CONSTRAINT "route_leg_congestion_check_incidents_traffic_incident_id_traffic_incidents_id_fk" FOREIGN KEY ("traffic_incident_id") REFERENCES "public"."traffic_incidents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_check_incidents" ADD CONSTRAINT "route_leg_congestion_check_incidents_congestion_check_id_fk" FOREIGN KEY ("congestion_check_id") REFERENCES "public"."route_leg_congestion_checks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_check_incidents" ADD CONSTRAINT "route_leg_congestion_check_incidents_traffic_incident_id_fk" FOREIGN KEY ("traffic_incident_id") REFERENCES "public"."traffic_incidents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_checks" ADD CONSTRAINT "route_leg_congestion_checks_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_checks" ADD CONSTRAINT "route_leg_congestion_checks_route_leg_id_route_legs_id_fk" FOREIGN KEY ("route_leg_id") REFERENCES "public"."route_legs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_leg_congestion_checks" ADD CONSTRAINT "route_leg_congestion_checks_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_courier_route_id_courier_routes_id_fk" FOREIGN KEY ("courier_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_from_node_id_nodes_id_fk" FOREIGN KEY ("from_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_legs" ADD CONSTRAINT "route_legs_to_node_id_nodes_id_fk" FOREIGN KEY ("to_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD CONSTRAINT "simulation_jobs_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD CONSTRAINT "simulation_jobs_depot_id_depots_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."depots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_jobs" ADD CONSTRAINT "simulation_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_logs" ADD CONSTRAINT "simulation_logs_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_logs" ADD CONSTRAINT "simulation_logs_courier_route_id_courier_routes_id_fk" FOREIGN KEY ("courier_route_id") REFERENCES "public"."courier_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_logs" ADD CONSTRAINT "simulation_logs_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_simulation_job_id_simulation_jobs_id_fk" FOREIGN KEY ("simulation_job_id") REFERENCES "public"."simulation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_depot_id_depots_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."depots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_uploaded_rows" ADD CONSTRAINT "simulation_uploaded_rows_simulation_job_id_simulation_jobs_id_fk" FOREIGN KEY ("simulation_job_id") REFERENCES "public"."simulation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_courier_id_couriers_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traffic_incidents" ADD CONSTRAINT "traffic_incidents_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuning_experiment_datasets" ADD CONSTRAINT "tuning_experiment_datasets_depot_id_depots_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."depots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuning_experiment_runs" ADD CONSTRAINT "tuning_experiment_runs_tuning_experiment_id_tuning_experiments_id_fk" FOREIGN KEY ("tuning_experiment_id") REFERENCES "public"."tuning_experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuning_experiment_runs" ADD CONSTRAINT "tuning_experiment_runs_tuning_experiment_id_tuning_experiment_table_id_fk" FOREIGN KEY ("tuning_experiment_id") REFERENCES "public"."tuning_experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuning_experiments" ADD CONSTRAINT "tuning_experiments_dataset_id_tuning_experiment_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."tuning_experiment_datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuning_experiment_uploaded_rows" ADD CONSTRAINT "tuning_experiment_uploaded_rows_tuning_experiment_dataset_id_tuning_experiment_datasets_id_fk" FOREIGN KEY ("tuning_experiment_dataset_id") REFERENCES "public"."tuning_experiment_datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "courier_routes_solution_id_idx" ON "courier_routes" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "courier_routes_courier_id_idx" ON "courier_routes" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "couriers_simulation_id_idx" ON "couriers" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "daily_optimization_logs_config_id_idx" ON "daily_optimization_logs" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX "daily_optimization_logs_date_idx" ON "daily_optimization_logs" USING btree ("date");--> statement-breakpoint
CREATE INDEX "depots_name_idx" ON "depots" USING btree ("name");--> statement-breakpoint
CREATE INDEX "depots_coordinates_idx" ON "depots" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "matrix_batches_simulation_id_idx" ON "matrix_batches" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "matrix_results_simulation_id_idx" ON "matrix_results" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "matrix_results_matrix_batch_id_idx" ON "matrix_results" USING btree ("matrix_batch_id");--> statement-breakpoint
CREATE INDEX "node_details_node_id_idx" ON "node_details" USING btree ("node_id");--> statement-breakpoint
CREATE INDEX "nodes_simulation_id_idx" ON "nodes" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "optimization_iterations_simulation_id_idx" ON "optimization_iterations" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "optimization_iterations_event_type_idx" ON "optimization_iterations" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "optimization_runs_simulation_id_idx" ON "optimization_runs" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "optimization_runs_congestion_check_id_idx" ON "optimization_runs" USING btree ("congestion_check_id");--> statement-breakpoint
CREATE INDEX "reoptimization_events_simulation_id_idx" ON "reoptimization_events" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "reoptimization_events_optimization_run_id_idx" ON "reoptimization_events" USING btree ("optimization_run_id");--> statement-breakpoint
CREATE INDEX "reoptimization_events_congestion_check_id_idx" ON "reoptimization_events" USING btree ("congestion_check_id");--> statement-breakpoint
CREATE INDEX "route_leg_congestion_check_incidents_congestion_check_id_idx" ON "route_leg_congestion_check_incidents" USING btree ("congestion_check_id");--> statement-breakpoint
CREATE INDEX "route_leg_congestion_check_incidents_traffic_incident_id_idx" ON "route_leg_congestion_check_incidents" USING btree ("traffic_incident_id");--> statement-breakpoint
CREATE INDEX "route_leg_congestion_check_incidents_valid_idx" ON "route_leg_congestion_check_incidents" USING btree ("congestion_check_id","is_valid_congestion");--> statement-breakpoint
CREATE INDEX "route_leg_congestion_checks_simulation_id_idx" ON "route_leg_congestion_checks" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "route_leg_congestion_checks_route_leg_id_idx" ON "route_leg_congestion_checks" USING btree ("route_leg_id");--> statement-breakpoint
CREATE INDEX "route_leg_congestion_checks_courier_id_idx" ON "route_leg_congestion_checks" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "route_legs_courier_route_id_idx" ON "route_legs" USING btree ("courier_route_id");--> statement-breakpoint
CREATE INDEX "route_legs_origin_coordinates_idx" ON "route_legs" USING btree ("origin_latitude","origin_longitude");--> statement-breakpoint
CREATE INDEX "route_legs_destination_coordinates_idx" ON "route_legs" USING btree ("destination_latitude","destination_longitude");--> statement-breakpoint
CREATE UNIQUE INDEX "route_legs_courier_route_sequence_unique" ON "route_legs" USING btree ("courier_route_id","sequence");--> statement-breakpoint
CREATE INDEX "route_legs_sequence_idx" ON "route_legs" USING btree ("sequence");--> statement-breakpoint
CREATE INDEX "simulation_jobs_user_id_idx" ON "simulation_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "simulation_jobs_status_idx" ON "simulation_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "simulation_jobs_depot_id_idx" ON "simulation_jobs" USING btree ("depot_id");--> statement-breakpoint
CREATE INDEX "simulation_logs_simulation_id_idx" ON "simulation_logs" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "simulation_logs_courier_route_id_idx" ON "simulation_logs" USING btree ("courier_route_id");--> statement-breakpoint
CREATE INDEX "simulation_logs_courier_id_idx" ON "simulation_logs" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "simulations_user_id_idx" ON "simulations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "simulations_depot_id_idx" ON "simulations" USING btree ("depot_id");--> statement-breakpoint
CREATE INDEX "simulations_status_idx" ON "simulations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "simulation_uploaded_rows_simulation_job_id_idx" ON "simulation_uploaded_rows" USING btree ("simulation_job_id");--> statement-breakpoint
CREATE INDEX "simulation_uploaded_rows_nosi_idx" ON "simulation_uploaded_rows" USING btree ("nosi");--> statement-breakpoint
CREATE INDEX "solutions_simulation_id_idx" ON "solutions" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "solutions_courier_id_idx" ON "solutions" USING btree ("courier_id");--> statement-breakpoint
CREATE INDEX "tuning_experiment_datasets_status_idx" ON "tuning_experiment_datasets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tuning_experiment_datasets_depot_id_idx" ON "tuning_experiment_datasets" USING btree ("depot_id");--> statement-breakpoint
CREATE INDEX "tuning_experiment_runs_tuning_experiment_id_idx" ON "tuning_experiment_runs" USING btree ("tuning_experiment_id");--> statement-breakpoint
CREATE INDEX "tuning_experiments_dataset_id_idx" ON "tuning_experiments" USING btree ("dataset_id");--> statement-breakpoint
CREATE INDEX "tuning_experiment_uploaded_rows_tuning_experiment_dataset_id_idx" ON "tuning_experiment_uploaded_rows" USING btree ("tuning_experiment_dataset_id");--> statement-breakpoint
CREATE INDEX "tuning_experiment_uploaded_rows_nosi_idx" ON "tuning_experiment_uploaded_rows" USING btree ("nosi");--> statement-breakpoint
CREATE INDEX "users_user_id_idx" ON "users" USING btree ("user_id");