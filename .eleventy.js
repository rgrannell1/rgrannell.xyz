const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownItKaTeX = require("markdown-it-katex");
const markdownIt = require("markdown-it");
const Image = require("@11ty/eleventy-img");

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

module.exports = function (cfg) {
  cfg.addPlugin(syntaxHighlight);
  cfg.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true, typographer: true }).use(markdownItKaTeX),
  );

  const highlighter = syntaxHighlight;

  cfg.addNunjucksShortcode("image", imageShortcode);
  cfg.addLiquidShortcode("image", imageShortcode);
  cfg.addJavaScriptFunction("image", imageShortcode);

  cfg.addPlugin(highlighter);
  cfg.addPlugin(pluginRss);

  // copy these inodes as-is
  const passThrough = [
    "css",
    "fonts",
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
};
