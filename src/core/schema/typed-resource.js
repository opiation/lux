import { z as Zod } from "zod";

/**
 * @template {string} TypeName
 * @param {TypeName} typeName
 */
export function resourceTypedAs(typeName) {
  return Zod.object({
    id: Zod.string().trim().min(1).optional(),
    typeName: Zod.literal(typeName),
  });
}

/**
 * @template {string} [TypeName=string]
 * @typedef {Object} TypedResource
 *   A resource with a unique `id` that is explicitly typed with a `typeName`
 *
 * ```ts
 * declare const resource: TypedResource<"User">
 *
 * resource.id // a non-empty string
 * resource.typeName // the literal string "User"
 * ```
 *
 * @property {string} [id]
 *   A unique identifier for the resource that must be a non-empty string
 *
 * @property {TypeName} typeName
 *   The reason for an explicit type name is to allow for more eplicit type
 * checking and an ease of use when discriminating between different types of
 * resources.
 */
