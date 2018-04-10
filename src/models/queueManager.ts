export interface QueueManager {
  dequeuingLimit: number;
  totalProcess?: number;
  enqueuedProcess: Array<string>;
  denqueuedProcess: Array<string>;
  data?: any;
}
