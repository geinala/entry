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
    id: serial().primaryKey(),
    roleId: integer("role_id").notNull(),
    clerkUserId: varchar("clerk_user_id").notNull(),
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
    index("users_clerk_user_id_idx").on(table.clerkUserId),
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
    userId: integer("user_id").references(() => userTable.id),
    title: varchar("title", { length: 300 }).notNull(),
    status: simulationStatusEnum("status").notNull().default("pending"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    computationTimeLimitInSeconds: integer("computation_time_limit_in_seconds")
      .notNull()
      .default(300), // in seconds
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
      foreignColumns: [userTable.id],
      name: "simulations_user_id_users_id_fk",
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
    userId: integer("user_id")
      .references(() => userTable.id)
      .notNull(),
    fileName: varchar("file_name").notNull(),
    filePath: varchar("file_path").notNull(),
    fileErrorPath: varchar("file_error_path"),
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
      foreignColumns: [userTable.id],
      name: "simulation_uploaded_files_user_id_users_id_fk",
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
    fullEncodedPolyline: text("full_encoded_polyline"), // To store the full encoded polyline for the route
    fullEncodedPolylinePrecision: integer("full_encoded_polyline_precision").default(5), // Precision of the full encoded polyline
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
    index("vehicle_routes_solution_id_idx").on(table.solutionId),
    index("vehicle_routes_vehicle_id_idx").on(table.vehicleId),
  ],
);

export const routeLegTable = pgTable(
  "route_legs",
  {
    id: serial().primaryKey(),
    vehicleRouteId: integer("vehicle_route_id").references(() => vehicleRouteTable.id),
    originNodeId: integer("origin_node_id").references(() => nodeTable.id),
    destinationNodeId: integer("destination_node_id").references(() => nodeTable.id),
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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.vehicleRouteId],
      foreignColumns: [vehicleRouteTable.id],
      name: "route_legs_vehicle_route_id_vehicle_routes_id_fk",
    }),
    foreignKey({
      columns: [table.originNodeId],
      foreignColumns: [nodeTable.id],
      name: "route_legs_origin_node_id_nodes_id_fk",
    }),
    foreignKey({
      columns: [table.destinationNodeId],
      foreignColumns: [nodeTable.id],
      name: "route_legs_destination_node_id_nodes_id_fk",
    }),
    index("route_legs_vehicle_route_id_idx").on(table.vehicleRouteId),
    index("route_legs_origin_node_id_idx").on(table.originNodeId),
    index("route_legs_destination_node_id_idx").on(table.destinationNodeId),
    uniqueIndex("route_legs_vehicle_route_sequence_unique").on(
      table.vehicleRouteId,
      table.sequence,
    ),
    index("route_legs_sequence_idx").on(table.sequence),
  ],
);
