import { z } from "zod";
import { resource } from "./resource";
import { UUID } from "./uuid";

export const Person = resource("Person", UUID).extend({
  /**
   * Name of the {@link schema Person}
   */
  name: z.string().trim().min(1).describe("Name of the Person"),
});

export type PersonSchema = typeof Person;
export interface Person extends z.infer<PersonSchema> {}
