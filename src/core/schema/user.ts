import { z } from "zod";
import { reference, resource } from "./resource.ts";
import { Person } from "./person.ts";
import { UUID } from "./uuid.js";
import { Organization } from "./organization.ts";

export const User = resource("User", UUID).extend({
  email: z.string().trim().email(),
  identity: z.union([reference(Person), reference(Organization)]).nullish(),
});

export type UserSchema = typeof User;
export interface User extends z.infer<UserSchema> {}
