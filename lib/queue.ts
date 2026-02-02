import { QUEUE_NAME } from "@/common/constants/queue";
import { Queue } from "bullmq";
import { connection } from "./redis";

export const queue = new Queue(QUEUE_NAME, { connection });
