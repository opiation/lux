// @ts-check

import { z as Zod } from "zod";

/**
 * @template {Zod.ZodTypeAny} ValueSchema
 * @template {Zod.ZodTypeAny} ErrorSchema
 * @param {ValueSchema} okSchema
 * @param {ErrorSchema} errorSchema
 * @returns {ResultSchema<ValueSchema, ErrorSchema>}
 */
export function result(okSchema, errorSchema) {
  return Zod.union([Ok(okSchema), Err(errorSchema)]);
}

/**
 * @template {Zod.ZodTypeAny} ValueSchema
 * @template {Zod.ZodTypeAny} ErrorSchema
 * @typedef {Zod.ZodUnion<[OkSchema<ValueSchema>, ErrSchema<ErrorSchema>]>} ResultSchema
 */

/**
 * @template {Zod.ZodTypeAny} ValueSchema
 * @param {ValueSchema} valueSchema
 * @returns {OkSchema<ValueSchema>}
 */
function Ok(valueSchema) {
  return Zod.object({
    success: Zod.literal(true),
    value: valueSchema,
  });
}

/**
 * @template {Zod.ZodTypeAny} ValueSchema
 * @typedef {Zod.ZodObject<{ success: Zod.ZodLiteral<true>; value: ValueSchema }>} OkSchema
 */

/**
 * @template {Zod.ZodTypeAny} ErrorSchema
 * @param {ErrorSchema} errorSchema
 * @returns {ErrSchema<ErrorSchema>}
 */
function Err(errorSchema) {
  return Zod.object({
    error: errorSchema,
    success: Zod.literal(false),
  });
}

/**
 * @template {Zod.ZodTypeAny} ErrorSchema
 * @typedef {Zod.ZodObject<{ error: ErrorSchema; success: Zod.ZodLiteral<false> }>} ErrSchema
 */

/**
 * @template Value
 * @param {Value} error
 */
export function err(error) {
  /** @satisfies {Result<any, Value>} */
  const r = Object.freeze({ error, success: /** @type {const} */ (false) });
  return r;
}

/**
 * @template Value
 * @param {Value} value
 */
export function ok(value) {
  /** @satisfies {Result<Value, any>} */
  const r = Object.freeze({ success: /** @type {const} */ (true), value });
  return r;
}

export const ErrorType = Zod.object({
  message: Zod.string().trim().min(1),
});
/** @typedef {Zod.infer<typeof ErrorType>} ErrorType */

/**
 * @template A
 * @template E
 * @typedef {Readonly<{ success: true; value: A }> | Readonly<{ error: E; success: false }>} Result
 */
