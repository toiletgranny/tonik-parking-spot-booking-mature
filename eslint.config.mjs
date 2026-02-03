import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import boundaries from "eslint-plugin-boundaries"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Team rule: a feature folder never imports from another feature folder.
    // Pages in src/app put features together; shared code lives in
    // src/components and src/lib. See CLAUDE.md.
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { alwaysTryTypes: true } },
      "boundaries/elements": [
        {
          type: "feature",
          pattern: "src/features/*",
          capture: ["featureName"],
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "feature" } },
              disallow: {
                to: {
                  element: {
                    type: "feature",
                    captured: {
                      featureName: "!{{ from.element.captured.featureName }}",
                    },
                  },
                },
              },
              message:
                "Features can't import from other features. Move shared code to src/lib or src/components, or compose the features in a page in src/app.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])

export default eslintConfig
