import path from "node:path";
import { copyFile } from "node:fs/promises";
import consola from "consola";
import chalk from "chalk";
import { build } from "esbuild";
import GlobalsPlugin from "esbuild-plugin-globals";
import vue from "unplugin-vue/dist/esbuild";
import { emptyDir } from "fs-extra";
import { version } from "../package.json";
import { iVOutput, pathSrc, buildOutput, pkgPath } from "./path";
import type { BuildOptions, Format } from "esbuild";

const buildBundle = () => {
  const getBuildOptions = (format: Format) => {
    const options: BuildOptions = {
      entryPoints: [
        path.resolve(pathSrc, "index.ts"),
        path.resolve(pathSrc, "global.ts"),
      ],
      target: "es2018",
      platform: "neutral",
      plugins: [
        vue({
          isProduction: true,
          sourceMap: false,
        }),
      ],
      bundle: true,
      format,
      minifySyntax: true,
      banner: {
        js: `/*! Danegg UI Icons Vue v${version} */\n`,
      },
      outdir: iVOutput,
    };
    if (format === "iife") {
      options.plugins!.push(
        GlobalsPlugin({
          vue: "Vue",
        })
      );
      options.globalName = "DaneggUIIconsVue";
    } else {
      options.external = ["vue"];
    }

    return options;
  };
  const doBuild = async (minify: boolean) => {
    await Promise.all([
      build({
        ...getBuildOptions("esm"),
        entryNames: `[name]${minify ? ".min" : ""}`,
        minify,
      }),
      build({
        ...getBuildOptions("iife"),
        entryNames: `[name].iife${minify ? ".min" : ""}`,
        minify,
      }),
      build({
        ...getBuildOptions("cjs"),
        entryNames: `[name]${minify ? ".min" : ""}`,
        outExtension: { ".js": ".cjs" },
        minify,
      }),
      copyFile(pkgPath, path.join(buildOutput, "package.json")),
    ]);
  };

  return Promise.all([doBuild(true), doBuild(false)]);
};

consola.info(chalk.blue("cleaning dist..."));
await emptyDir(buildOutput);
consola.info(chalk.blue("building..."));
await buildBundle();
