import {
  boolean,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "users",
  {
    roleId: integer("role_id").notNull(),
    userId: varchar("user_id").notNull().unique().primaryKey(), // This is the Clerk user ID, which is a string. We use it as the primary key for the users table to simplify integration with Clerk.
    email: varchar("email").notNull().unique(),
    fullName: varchar("full_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roleTable.id],
      name: "users_role_id_roles_id_fk",
    }),
    index("users_user_id_idx").on(table.userId),
    index("users_role_id_idx").on(table.roleId),
  ],
);

export const roleTable = pgTable("roles", {
  id: serial().primaryKey(),
  name: varchar("name").notNull().unique(),
  description: varchar("description"),
});

export const permissionTable = pgTable("permissions", {
  id: serial().primaryKey(),
  name: varchar("name").notNull().unique(),
  description: varchar("description"),
});

export const rolePermissionTable = pgTable(
  "role_permissions",
  {
    id: serial().primaryKey(),
    roleId: integer("role_id").references(() => roleTable.id),
    permissionId: integer("permission_id").references(() => permissionTable.id),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roleTable.id],
      name: "role_permissions_role_id_roles_id_fk",
    }),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissionTable.id],
      name: "role_permissions_permission_id_permissions_id_fk",
    }),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
  ],
);

export const waitlistStatusEnum = pgEnum("waitlist_status_enum", [
  "pending",
  "sending",
  "confirmed",
  "denied",
  "invited",
  "revoked",
  "failed",
  "expired",
]);

export const waitlistTable = pgTable(
  "waitlist",
  {
    id: serial().primaryKey(),
    clerkInvitationId: varchar("clerk_invitation_id").unique(),
    email: varchar("email").notNull().unique(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    status: waitlistStatusEnum("status").notNull().default("pending"),
    ticketId: varchar("ticket_id").unique(),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    expiredAt: timestamp("expired_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_waitlist_status").on(table.status),
    index("idx_waitlist_email").on(table.email),
    index("idx_waitlist_ticket_id").on(table.ticketId),
  ],
);

export const simulationJobStatusEnum = pgEnum("simulation_job_status_enum", [
  "uploaded", // uploaded === draft, just uploaded but not processed yet
  "processing",
  "completed",
  "failed",
]);

export const geocodingStatusEnum = pgEnum("geocoding_status_enum", [
  "pending",
  "in_progress",
  "needed_review",
  "completed",
  "failed",
]);

export const calculationStatusEnum = pgEnum("calculation_status_enum", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const simulationJobFileValidationStatusEnum = pgEnum(
  "simulation_file_validation_status_enum",
  ["uploaded", "validating", "validated", "needed_review", "completed", "failed"],
);

export const simulationJobCleaningStatusEnum = pgEnum("simulation_cleaning_status_enum", [
  "pending",
  "in_progress",
  "completed",
  "needed_review",
  "failed",
]);

export const simulationJobTable = pgTable("simulation_jobs", {
  // Basic info
  id: uuid().primaryKey().defaultRandom(),
  userId: varchar("user_id")
    .references(() => userTable.userId)
    .notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  depotLocationAddress: varchar("depot_location_address").notNull(),
  depotLocationLatitude: doublePrecision("depot_location_latitude").notNull(),
  depotLocationLongitude: doublePrecision("depot_location_longitude").notNull(),
  maxComputationTimeInSeconds: integer("max_computation_time_in_seconds").notNull().default(600), // in seconds
  startedAt: timestamp("started_at", { withTimezone: true }),

  // State tracking
  status: simulationJobStatusEnum("status").notNull().default("uploaded"),
  currentStep: integer("current_step").notNull().default(0),

  // Progress tracking
  filePath: varchar("file_path"),
  fileValidationStatus: simulationJobFileValidationStatusEnum("file_validation_status")
    .notNull()
    .default("uploaded"),
  fileTotalRows: integer("file_total_rows"),
  fileValidRows: integer("file_valid_rows").notNull().default(0),
  fileInvalidRows: integer("file_invalid_rows").notNull().default(0),
  fileProcessedRows: integer("file_processed_rows"),
  fileProgressPercentage: integer("file_progress_percentage").default(0),
  fileValidationStartedAt: timestamp("file_validation_started_at", { withTimezone: true }), // Timestamp when file validation starts
  fileValidationCompletedAt: timestamp("file_validation_completed_at", { withTimezone: true }), // Timestamp when file validation is completed

  // Cleaning tracking
  cleaningTotalRows: integer("cleaning_total_rows").default(0),
  cleaningProcessedRows: integer("cleaning_processed_rows").default(0),
  cleaningProgressPercentage: integer("cleaning_progress_percentage").default(0),
  cleaningStatus: simulationJobCleaningStatusEnum("cleaning_status").notNull().default("pending"),
  cleaningStartedAt: timestamp("cleaning_started_at", { withTimezone: true }), // Timestamp when cleaning starts
  cleaningCompletedAt: timestamp("cleaning_completed_at", { withTimezone: true }), // Timestamp when cleaning is completed

  // Result tracking
  geocodingTotalRows: integer("geocoding_total_rows").default(0),
  geocodingProcessedRows: integer("geocoding_processed_rows").default(0),
  geocodingProgressPercentage: integer("geocoding_progress_percentage").default(0),
  geocodingEstimatedCompletionTime: timestamp("geocoding_estimated_completion_time", {
    withTimezone: true,
  }),
  geocodingStatus: geocodingStatusEnum("geocoding_status").notNull().default("pending"),
  geocodingStartedAt: timestamp("geocoding_started_at", { withTimezone: true }), // Timestamp when geocoding starts
  geocodedAt: timestamp("geocoded_at", { withTimezone: true }), // Timestamp when geocoding is completed

  // Calculation tracking
  calculationStatus: calculationStatusEnum("calculation_status").notNull().default("pending"),
  calculationStartedAt: timestamp("calculation_started_at", { withTimezone: true }), // Timestamp when calculation starts
  calculatedAt: timestamp("calculated_at", { withTimezone: true }), // Timestamp when calculation is completed

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const resolutionStatusEnum = pgEnum("resolution_status", [
  "pending",
  "auto_solved",
  "needed_review",
  "failed",
  "manual_override",
]);

export const simulationUploadedRows = pgTable(
  "simulation_uploaded_rows",
  {
    id: serial().primaryKey(),
    simulationJobId: uuid("simulation_job_id").references(() => simulationJobTable.id),
    nosi: varchar("nosi"),
    courier: varchar("courier"),
    customerName: varchar("customer_name"),
    address: varchar("address"),
    normalizedAddress: varchar("normalized_address"),
    suggestedAddress: varchar("suggested_address"),
    finalAddress: varchar("final_address"),
    city: varchar("city"),
    weight: real("weight"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    geocodeScore: doublePrecision("geocode_score"),
    geocodeProvider: varchar("geocode_provider"), // TomTom API
    geocodeResponse: jsonb("geocode_response"),
    resolutionStatus: resolutionStatusEnum("resolution_status").notNull().default("pending"),
    resolutionSource: varchar("resolution_source"), // e.g., "SYSTEM" or "USER"
    isIgnored: boolean("is_ignored").notNull().default(false), // To mark rows that should be ignored in processing
    startDatetime: timestamp("start_datetime", { withTimezone: true }),
    endDatetime: timestamp("end_datetime", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // To mark when a row is "soft deleted"
    errorDetails: jsonb("error_details"), // To store any error details related to this row during processing
  },
  (table) => [
    foreignKey({
      columns: [table.simulationJobId],
      foreignColumns: [simulationJobTable.id],
      name: "simulation_uploaded_rows_simulation_job_id_simulation_jobs_id_fk",
    }),
    index("simulation_uploaded_rows_simulation_job_id_idx").on(table.simulationJobId),
    index("simulation_uploaded_rows_nosi_idx").on(table.nosi),
  ],
);

// Old table

export const simulationStatusEnum = pgEnum("simulation_status_enum", [
  "pending",
  "processing",
  "running",
  "completed",
  "failed",
]);

export const simulationTable = pgTable(
  "simulations",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar("user_id")
      .references(() => userTable.userId)
      .notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    status: simulationStatusEnum("status").notNull().default("pending"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    computationTimeLimitInSeconds: integer("computation_time_limit_in_seconds")
      .notNull()
      .default(600), // in seconds
    totalDemandInKilograms: real("total_demand_in_kilograms").notNull().default(0),
    totalDistanceInMeters: integer("total_distance_in_meters").notNull().default(0),
    totalVehicles: integer("total_vehicles").notNull().default(0),
    totalDurationInSeconds: integer("total_duration_in_seconds").notNull().default(0),
    totalActiveVehicles: integer("total_active_vehicles").notNull().default(0),
    totalCompletedNodes: integer("total_completed_nodes").notNull().default(0),
    totalNodes: integer("total_nodes").notNull().default(0),
    uploadId: integer("upload_id").references(() => simulationUploadedFileTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.userId],
      name: "simulations_user_id_users_user_id_fk",
    }),
    foreignKey({
      columns: [table.uploadId],
      foreignColumns: [simulationUploadedFileTable.id],
      name: "simulations_upload_id_simulation_uploaded_files_id_fk",
    }),
    index("simulations_user_id_idx").on(table.userId),
    index("simulations_status_idx").on(table.status),
  ],
);

export const simulationUploadStatusEnum = pgEnum("simulation_upload_status_enum", [
  "uploaded",
  "validating",
  "validated",
  "processing",
  "failed",
  "ready",
]);

export const simulationUploadedFileTable = pgTable(
  "simulation_uploaded_files",
  {
    id: serial().primaryKey(),
    userId: varchar("user_id")
      .references(() => userTable.userId)
      .notNull(),
    fileName: varchar("file_name").notNull(),
    filePath: varchar("file_path").notNull(),
    totalRows: integer("total_rows"),
    invalidRows: integer("invalid_rows"),
    processedRows: integer("processed_rows"),
    progressPercentage: integer("progress_percentage").default(0),
    status: simulationUploadStatusEnum("status").notNull().default("uploaded"),
    validatedAt: timestamp("validated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.userId],
      name: "simulation_uploaded_files_user_id_users_user_id_fk",
    }),
    index("simulation_uploaded_files_user_id_idx").on(table.userId),
  ],
);

export const nodeTable = pgTable(
  "nodes",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    matrixIndex: integer("matrix_index").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    demand: real("demand").notNull(),
    isDepot: integer("is_depot").notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "nodes_simulation_id_simulations_id_fk",
    }),
    index("nodes_simulation_id_idx").on(table.simulationId),
  ],
);

export const nodeDetailTable = pgTable(
  "node_details",
  {
    id: serial().primaryKey(),
    nodeId: integer("node_id").references(() => nodeTable.id),
    name: varchar("name").notNull(),
    address: varchar("address").notNull(),
    city: varchar("city").notNull(),
    district: varchar("district").notNull(),
    weight: real("weight").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nodeId],
      foreignColumns: [nodeTable.id],
      name: "node_details_node_id_nodes_id_fk",
    }),
    index("node_details_node_id_idx").on(table.nodeId),
  ],
);

export const matrixBatchStatusEnum = pgEnum("matrix_batch_status_enum", [
  "submitted",
  "validated",
  "completed",
  "failed",
]);

export const matrixBatchTable = pgTable(
  "matrix_batches",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    originStartIndex: integer("origin_start_index").notNull(),
    originEndIndex: integer("origin_end_index").notNull(),
    destinationStartIndex: integer("destination_start_index").notNull(),
    destinationEndIndex: integer("destination_end_index").notNull(),
    tomtomJobId: varchar("tomtom_job_id").notNull(),
    status: matrixBatchStatusEnum("status").notNull().default("submitted"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "matrix_batches_simulation_id_simulations_id_fk",
    }),
    index("matrix_batches_simulation_id_idx").on(table.simulationId),
  ],
);

export const matrixResultTable = pgTable(
  "matrix_results",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    originIndex: integer("origin_index").notNull(),
    destinationIndex: integer("destination_index").notNull(),
    lengthInMeters: integer("length_in_meters").notNull(),
    travelTimeInSeconds: integer("travel_time_in_seconds").notNull(),
    trafficDelayInSeconds: integer("traffic_delay_in_seconds").notNull(),
    matrixBatchId: integer("matrix_batch_id").references(() => matrixBatchTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.matrixBatchId],
      foreignColumns: [matrixBatchTable.id],
      name: "matrix_results_matrix_batch_id_matrix_batches_id_fk",
    }),
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "matrix_results_simulation_id_simulations_id_fk",
    }),
    index("matrix_results_simulation_id_idx").on(table.simulationId),
    index("matrix_results_matrix_batch_id_idx").on(table.matrixBatchId),
  ],
);

export const vehicleTable = pgTable(
  "vehicles",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    name: varchar("name").notNull(),
    maxCapacity: real("max_capacity").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "vehicles_simulation_id_simulations_id_fk",
    }),
    index("vehicles_simulation_id_idx").on(table.simulationId),
  ],
);

export const solutionTable = pgTable(
  "solutions",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    vehicleId: integer("vehicle_id").references(() => vehicleTable.id),
    routes: jsonb("routes").notNull(), // Array of node indices representing the route
    demandInKilograms: real("demand_in_kilograms").notNull(), // Total demand served by this vehicle
    timeInSeconds: integer("time_in_seconds").notNull(), // Total time for this route
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "solutions_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.vehicleId],
      foreignColumns: [vehicleTable.id],
      name: "solutions_vehicle_id_vehicles_id_fk",
    }),
    index("solutions_simulation_id_idx").on(table.simulationId),
    index("solutions_vehicle_id_idx").on(table.vehicleId),
  ],
);

export const vehicleRouteTable = pgTable(
  "vehicle_routes",
  {
    id: serial().primaryKey(),
    solutionId: integer("solution_id").references(() => solutionTable.id),
    vehicleId: integer("vehicle_id").references(() => vehicleTable.id),
    routeVersion: integer("route_version").notNull().default(1), // To track changes in routes over time
    isActive: boolean("is_active").notNull().default(true), // To indicate if this route is currently active
    totalDistanceInMeters: integer("total_distance_in_meters").notNull(), // Total distance for this route
    totalTimeInSeconds: integer("total_time_in_seconds").notNull(), // Total time for this route
    reoptimizedFromRouteId: integer("reoptimized_from_route_id"),
    triggerNodeId: integer("trigger_node_id").references(() => nodeTable.id),
    triggeredByTraffic: boolean("triggered_by_traffic").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.solutionId],
      foreignColumns: [solutionTable.id],
      name: "vehicle_routes_solution_id_solutions_id_fk",
    }),
    foreignKey({
      columns: [table.vehicleId],
      foreignColumns: [vehicleTable.id],
      name: "vehicle_routes_vehicle_id_vehicles_id_fk",
    }),
    foreignKey({
      columns: [table.reoptimizedFromRouteId],
      foreignColumns: [table.id],
      name: "vehicle_routes_reoptimized_from_route_id_vehicle_routes_id_fk",
    }),
    index("vehicle_routes_solution_id_idx").on(table.solutionId),
    index("vehicle_routes_vehicle_id_idx").on(table.vehicleId),
  ],
);

export const routeStatusEnum = pgEnum("route_status_enum", [
  "planned",
  "running",
  "completed",
  "cancelled",
]);

export const routeLegTable = pgTable(
  "route_legs",
  {
    id: serial().primaryKey(),
    vehicleRouteId: integer("vehicle_route_id").references(() => vehicleRouteTable.id),
    originLatitude: doublePrecision("origin_latitude").notNull(),
    originLongitude: doublePrecision("origin_longitude").notNull(),
    destinationLatitude: doublePrecision("destination_latitude").notNull(),
    destinationLongitude: doublePrecision("destination_longitude").notNull(),
    sequence: integer("sequence").notNull(), // To maintain the order of legs in the route
    encodedPolyline: text("encoded_polyline").notNull(), // To store the encoded polyline for this leg
    encodedPolylinePrecision: integer("encoded_polyline_precision").notNull().default(5), // Precision of the encoded polyline
    distanceInMeters: integer("distance_in_meters").notNull(),
    travelTimeInSeconds: integer("travel_time_in_seconds").notNull(),
    trafficDelayInSeconds: integer("traffic_delay_in_seconds").notNull(),
    trafficDistanceInMeters: integer("traffic_distance_in_meters").notNull(),
    departureTime: timestamp("departure_time", { withTimezone: true }).notNull(),
    arrivalTime: timestamp("arrival_time", { withTimezone: true }).notNull(),
    noTrafficTravelTimeInSeconds: integer("no_traffic_travel_time_in_seconds").notNull(),
    historicTrafficTravelTimeInSeconds: integer(
      "historic_traffic_travel_time_in_seconds",
    ).notNull(),
    liveTrafficIncidentsTravelTimeInSeconds: integer(
      "live_traffic_incidents_travel_time_in_seconds",
    ).notNull(),
    routeStatus: routeStatusEnum("route_status").notNull().default("planned"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.vehicleRouteId],
      foreignColumns: [vehicleRouteTable.id],
      name: "route_legs_vehicle_route_id_vehicle_routes_id_fk",
    }),
    index("route_legs_vehicle_route_id_idx").on(table.vehicleRouteId),
    index("route_legs_origin_coordinates_idx").on(table.originLatitude, table.originLongitude),
    index("route_legs_destination_coordinates_idx").on(
      table.destinationLatitude,
      table.destinationLongitude,
    ),
    uniqueIndex("route_legs_vehicle_route_sequence_unique").on(
      table.vehicleRouteId,
      table.sequence,
    ),
    index("route_legs_sequence_idx").on(table.sequence),
  ],
);
