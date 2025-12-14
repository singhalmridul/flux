import { FluxNode } from "@prisma/client";

export type ClientFluxNode = Omit<FluxNode, "properties"> & {
    properties: Record<string, any>;
};
