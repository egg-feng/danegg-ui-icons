import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const projectRootPath = resolve(dir, "..", "..", "..");
export const pathRoot = resolve(dir, "..");
export const pathSrc = resolve(pathRoot, "src");
export const pathComponents = resolve(pathSrc, "components");
export const buildOutput = resolve(projectRootPath, "dist", "icons-vue");
export const iVOutput = resolve(buildOutput, "dist");
export const pkgPath = resolve(pathRoot, "package.json");
