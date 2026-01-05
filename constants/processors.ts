// constants/processors.ts

export type ProcessorModel = "MX20" | "MX30" | "MX40 Pro";

export const PROCESSORS: Record<
  ProcessorModel,
  {
    ports: number;
  }
> = {
  MX20: {
    ports: 6,
  },
  MX30: {
    ports: 10,
  },
  "MX40 Pro": {
    ports: 20,
  },
};
