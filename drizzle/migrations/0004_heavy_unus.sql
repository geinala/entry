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
CREATE TABLE "tabu_search_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"it_max_multiplier" integer NOT NULL,
	"tab_tenure_divider" integer NOT NULL,
	"it_cons_multiplier" integer NOT NULL,
	"it_div_divider" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_optimization_logs" ADD CONSTRAINT "daily_optimization_logs_config_id_tabu_search_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."tabu_search_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_optimization_logs_config_id_idx" ON "daily_optimization_logs" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX "daily_optimization_logs_date_idx" ON "daily_optimization_logs" USING btree ("date");--> statement-breakpoint
ALTER TABLE "tuning_experiment_runs" ADD CONSTRAINT "tuning_experiment_runs_tuning_experiment_id_tuning_experiment_table_id_fk" FOREIGN KEY ("tuning_experiment_id") REFERENCES "public"."tuning_experiments"("id") ON DELETE no action ON UPDATE no action;