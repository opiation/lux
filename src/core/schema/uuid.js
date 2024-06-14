import { v4, validate } from "uuid";
import { z } from "zod";

/**
 * @param {string} value
 * @returns {value is `${string}-${string}-${string}-${string}-${string}`}
 */
function isUUID(value) {
  return validate(value);
}

const schema = z.string().refine(isUUID);

/**
 * @example
 * ```js
 * UUID.is(UUID.generate())
 * // true
 * ```
 *
 */
// TODO: Primary source documentation to the UUID v4 spec
export const UUID = Object.assign(
  schema,
  Object.freeze({
    /**
     * Generate a random UUIDv4
     *
     * @returns {UUID}
     */
    generate() {
      if (
        globalThis &&
        globalThis.crypto &&
        typeof globalThis.crypto.randomUUID === "function"
      ) {
        return globalThis.crypto.randomUUID();
      } else {
        return /** @type {UUID} */ (v4());
      }
    },

    /**
     * Is the given value a {@link UUID}?
     */
    is: isUUID,

    /**
     * Is the given `value` the _nil_ {@link UUID}?
     *z
     * @param {unknown} value
     * @returns {value is typeof UUID.Nil}
     */
    isNil(value) {
      return value === UUID.Nil;
    },

    /**
     * @satisfies {UUID}
     */
    Nil: "00000000-0000-0000-0000-000000000000",

    typeName: "UUID",
  })
);
/** @typedef {z.infer<typeof schema>} UUID */
