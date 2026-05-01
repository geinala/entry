// import "server-only";

// import { NextRequest } from "next/server";
// import { handleAuthenticatedRequest } from "@/lib/request";
// import {
//   getSimulationByIdController,
//   startSimulationController,
// } from "@/server/simulation/simulation.controller";

// // GET: /simulations/[id]
// export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
//   const { id } = await context.params;

//   return await handleAuthenticatedRequest({
//     request,
//     callback: async (_, context) => {
//       return await getSimulationByIdController(context.clerkUserId, id);
//     },
//   });
// };

// // POST: /simulations/[id]
// export const POST = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
//   const { id } = await context.params;

//   return await handleAuthenticatedRequest({
//     request,
//     callback: async (req) => {
//       return await startSimulationController(id, req);
//     },
//   });
// };
