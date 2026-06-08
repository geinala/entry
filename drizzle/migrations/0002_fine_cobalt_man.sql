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
ALTER TABLE "tuning_experiment_datasets" ADD COLUMN "depot_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tuning_experiment_runs" ADD CONSTRAINT "tuning_experiment_runs_tuning_experiment_id_tuning_experiments_id_fk" FOREIGN KEY ("tuning_experiment_id") REFERENCES "public"."tuning_experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tuning_experiment_runs_tuning_experiment_id_idx" ON "tuning_experiment_runs" USING btree ("tuning_experiment_id");--> statement-breakpoint
ALTER TABLE "tuning_experiment_datasets" ADD CONSTRAINT "tuning_experiment_datasets_depot_id_depots_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."depots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tuning_experiment_datasets_depot_id_idx" ON "tuning_experiment_datasets" USING btree ("depot_id");