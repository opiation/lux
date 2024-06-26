/**
 * An API client for interacting with the Ollama HTTP API along with some
 * niceties for safely parsing params and responses.
 *
 * @module Ollama
 */

import { z as Zod } from "zod";

/**
 * The completion JSON response paylaod from the request to `/generate` with
 * `stream: false`
 */
export const CompletionResponseBody = Zod.object({
  context: Zod.array(Zod.number()).nullish(),
  created_at: Zod.string().trim().min(1),
  done: Zod.boolean(),
  model: Zod.string().trim().min(1),
  /**
   * The core completion generated by the AI model
   *
   * This may be a stringified JSON value if the request params included
   * `format: "json"`.
   */
  response: Zod.string().trim().min(1),
});
/** @typedef {Zod.infer<typeof CompletionResponseBody>} CompletionResponseBody */

export const CompletionRequestParams = Zod.object({
  /**
   * The format in which to return a response
   *
   * Currently, the only accepted value is `"json"`.
   */
  format: Zod.literal("json").optional(),
  
  /**
   * Name of the AI model to use for completion generation
   *
   * Model names follow a `model:tag` format, where model can have an optional
   * namespace such as `example/model`. Some examples are `orca-mini:3b-q4_1`
   * and `llama3:70b`. The tag is optional and, if not provided, will default to
   * `latest`. The tag is used to identify a specific version.
   *
   * @example "llama3:70b"
   * @see {@link https://github.com/ollama/ollama/blob/main/docs/api.md#model-names}
   */
  model: Zod.string().trim().min(1),

  /** The prompt for which to generate a response */
  prompt: Zod.string().trim().min(1).optional(),

  /**
   * Should the API respond with a stream of response objects?
   *
   * If `false` the response will be returned as a single response object,
   * rather than a stream of objects.
   *
   * @default true
   */
  stream: Zod.boolean().optional().default(true),

  system: Zod.string().trim().min(1).optional()
});
/** @typedef {Zod.infer<typeof CompletionRequestParams>} CompletionRequestParams */

/**
 * @typedef {Object} APIOptions
 * @property {typeof globalThis.fetch} fetch
 *   Defaults to `globalThis.fetch`
 * @property {string} baseURL
 *   Defaults to `http://localhost:11434/api
 */

/** @satisfies {APIOptions} */
const defaultAPIOptions = Object.freeze({
  baseURL: "http://localhost:11434/api",
  fetch: globalThis.fetch
});

/**
 * Generate a _completion_ based on the given input `params`
 *
 * @param {CompletionRequestParams} params
 * @param {Partial<APIOptions>} [options]
 * @returns {Promise<CompletionResponseBody>}
 */
export async function generate(params, options) {
  const {
    baseURL = defaultAPIOptions.baseURL,
    fetch = defaultAPIOptions.fetch
  } = options ?? defaultAPIOptions;

  const response = await fetch(`${baseURL}/generate`, {
    body: JSON.stringify(params),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });

  const responseBody = await response.json();

  return CompletionResponseBody.parse(responseBody);
}
