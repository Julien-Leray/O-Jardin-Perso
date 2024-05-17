import globals from "globals";

import path from "path";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import { fileURLToPath } from "url";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended });

export default [
  { languageOptions: { globals: globals.node } },
  ...compat.extends("airbnb-base"),
];