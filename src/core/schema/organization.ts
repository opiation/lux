import { z } from "zod";
import { resource } from "./resource.ts";
import { UUID } from "./uuid.js";

export const Organization = resource("Organization", UUID).extend({
  /**
   * Name of the {@link schema Organization}
   */
  name: z.string().trim().min(1),
});

export type OrganizationSchema = typeof Organization;
export interface Organization extends z.infer<OrganizationSchema> {}
