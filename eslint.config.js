// @ts-check

import typescript from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

/** @import {Linter} from "eslint" */

/**
 * This exists only because the react hooks plugin has not yet adopted the new
 * flat config format for ESLint and its maintainers don't intend to release a
 * flat config until React 19 is generally available for some reason. This
 * manually-constucted config was copied from
 * [this open PR](https://github.com/facebook/react/pull/29770).
 *
 * @type {Linter.Config}
 */
// TODO: Remove this manual stock config when the PR source is merged and released.
const reactHooksFlatConfig = {
  plugins: {
    // @ts-expect-error - each rule's `meta.type` property being typed as string instead of "problem" | "suggestion"
    "react-hooks": { rules: reactHooks.rules },
  },
  // @ts-expect-error - each rule's severity is typed as string instead of "error" | "off" | "warn"
  rules: reactHooks.configs.recommended.rules,
};

/** @type {Array<Linter.Config>} */
const config = [
  ...typescript.configs.recommended,
  reactHooksFlatConfig,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
