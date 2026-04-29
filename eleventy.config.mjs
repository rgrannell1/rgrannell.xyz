import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownItKaTeX from "markdown-it-katex";
import markdownIt from "markdown-it";
import Image from "@11ty/eleventy-img";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const constants = {
  FORMATS: ["webp", "jpeg"],
};
constants.WIDTHS = (function () {
  const arr = [null];

  for (let width = 200; width < 1600 / 50; width += 50) {
    arr.push(width);
  }

  return arr;
})();

function imageShortcode(src, alt, sizes = "100vw") {
  const opts = {
    widths: constants.WIDTHS,
    formats: constants.FORMATS,
    sizes,
  };

  Image(src, opts);

  const attr = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(Image.statsSync(src, opts), attr);
}

export default function (cfg) {
  cfg.addGlobalData("siteUrl", "https://rgrannell.xyz");
  cfg.addGlobalData("cssHash", () => {
    const cssDir = "./css";
    const files = fs.readdirSync(cssDir).filter(f => f.endsWith(".css"));
    const content = files.map(f => fs.readFileSync(path.join(cssDir, f))).join("");
    return crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
  });

  cfg.addPlugin(syntaxHighlight);
  cfg.addPlugin(pluginRss);
  cfg.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true, typographer: true }).use(markdownItKaTeX),
  );

  cfg.addNunjucksShortcode("image", imageShortcode);
  cfg.addLiquidShortcode("image", imageShortcode);
  cfg.addJavaScriptFunction("image", imageShortcode);

  const passThrough = [
    "css",
    "fonts",
    "js",
    "manifest.webmanifest",
    "sw.js",
    "icons",
    "img",
    "videos",
    "specs",
    "me.jpg",
  ];

  for (const thing of passThrough) {
    cfg.addPassthroughCopy(thing);
  }
}
