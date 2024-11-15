import alias from "@rollup/plugin-alias"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import path from "path"
import url from "url"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// Fonction pour obtenir tous les fichiers d'un répertoire récursivement
function getFiles(dir) {
  let files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files = files.concat(getFiles(fullPath))
    } else if (item.isFile() && fullPath.endsWith(".ts")) {
      files.push(fullPath)
    }
  }
  return files
}

export default {
  input: [
    "src/index.ts",
    getFiles("src/core"),
    getFiles("src/buttons"),
    getFiles("src/commands"),
    getFiles("src/listeners"),
    getFiles("src/namespaces"),
    getFiles("src/slash"),
    getFiles("src/tables"),
    getFiles("src/cron"),
  ].flat(),
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: "inline",
    entryFileNames: "[name].js",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
  plugins: [
    nodeResolve(),
    alias({
      entries: [
        {
          find: "#config",
          replacement: path.resolve(__dirname, "src/config.ts"),
        },
        {
          find: "#types",
          replacement: path.resolve(__dirname, "src/types.ts"),
        },
        {
          find: "#all",
          replacement: path.resolve(__dirname, "src/core/index.ts"),
        },
        {
          find: "#core",
          replacement: path.resolve(__dirname, "src/core"),
        },
        {
          find: "#tables",
          replacement: path.resolve(__dirname, "src/tables"),
        },
        {
          find: "#buttons",
          replacement: path.resolve(__dirname, "src/buttons"),
        },
      ],
    }),
    typescript(),
  ],
  preserveEntrySignatures: "strict",
  external: [/node_modules/],
}
