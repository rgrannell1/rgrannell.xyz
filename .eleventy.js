const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownItKaTeX = require("markdown-it-katex");
const eleventyPluginSyntaxHighlighter = require(
  "@11ty/eleventy-plugin-syntaxhighlight",
);
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
    markdownIt({ html: true }).use(markdownItKaTeX),
  );

  const highlighter = eleventyPluginSyntaxHighlighter;

  cfg.addNunjucksShortcode("image", imageShortcode);
  cfg.addLiquidShortcode("image", imageShortcode);
  cfg.addJavaScriptFunction("image", imageShortcode);

  cfg.addPlugin(highlighter);
  //cfg.addLiquidFilter("dateToRfc3339", pluginRss.dateRfc3339);
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
    "me.png",
  ];

  for (const thing of passThrough) {
    cfg.addPassthroughCopy(thing);
  }
};
