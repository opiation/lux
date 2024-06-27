import { z } from "zod";

const schema = z.object({
  /**
   * What port should the server bind to?
   *
   * @default 4242
   */
  port: z.coerce.number().min(0).max(65535).default(4242),
});
/** @typedef {z.infer<typeof schema>} ServerConfig */

export const ServerConfig = {
  /**
   * Returns the default configuration for the server.
   */
  defaults() {
    /** @satisfies {ServerConfig} */
    const defaults = Object.freeze({
      port: 4242,
    });

    return defaults;
  },

  /**
   * Infer a {@link ServerConfig} from `Bun.env` or throw
   * @returns {ServerConfig}
   */
  fromBunEnv() {
    return this.fromEnv(globalThis?.Bun?.env ?? {});
  },

  /**
   * Infer a {@link ServerConfig} from `Deno.env` or throw
   * @returns {ServerConfig}
   */
  fromDenoEnv() {
    return this.fromEnv(
      /** @type {Record<string, any>} */ (globalThis)?.Deno?.env ?? {}
    );
  },

  /**
   * @param {Record<string, unknown>} env
   * @returns {ServerConfig}
   */
  fromEnv(env) {
    return schema.parse({
      port: env.PORT,
    });
  },

  /**
   * Infer a {@link ServerConfig} from `process.env` or throw
   * @returns {ServerConfig}
   */
  fromNodeEnv() {
    return this.fromEnv(globalThis.process?.env ?? {});
  },
};
