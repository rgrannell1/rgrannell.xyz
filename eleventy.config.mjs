import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { katex } from "@mdit/plugin-katex";
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
  cfg.addGlobalData("siteUrl", "https://rho.ie");
  cfg.setServerOptions({
    messageOnStart: ({ localhostUrl }) => {
      const { port } = new URL(localhostUrl);
      return `Listening on port ${port}`;
    },
  });
  cfg.addGlobalData("cssHash", () => {
    const cssDir = "./css";
    const files = fs.readdirSync(cssDir).filter(f => f.endsWith(".css"));
    const content = files.map(f => fs.readFileSync(path.join(cssDir, f))).join("");
    return crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
  });

  cfg.addFilter("date", (value, format) => {
    const date = new Date(value);
    return date.toISOString().slice(0, 10);
  });

  cfg.addFilter("year", (value) => {
    return new Date(value).getFullYear();
  });

  cfg.addPlugin(syntaxHighlight);
  cfg.addPlugin(pluginRss);
  cfg.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true, typographer: true }).use(katex),
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
    "audio",
    "specs",
    "me.jpg",
  ];

  for (const thing of passThrough) {
    cfg.addPassthroughCopy(thing);
  }
}
