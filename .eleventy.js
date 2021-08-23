
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const markdownItKaTeX = require('markdown-it-katex');

let markdownIt = require("markdown-it")
let options = {
  html: true,
  breaks: false,
  linkify: true
}


module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.setLibrary("md", markdownIt({ html: true }).use(markdownItKaTeX))

  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateRfc3339)
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy("manifest.webmanifest")
  eleventyConfig.addPassthroughCopy("sw.js")
  eleventyConfig.addPassthroughCopy("images")

}
