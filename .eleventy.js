
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginRss = require("@11ty/eleventy-plugin-rss")

let markdownIt = require("markdown-it")
const mathjaxPlugin = require("eleventy-plugin-mathjax");
let options = {
  html: true,
  breaks: false,
  linkify: true
}

let markdownLib = markdownIt(options)

module.exports = function(eleventyConfig) {
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateRfc3339)
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy("manifest.webmanifest")
  eleventyConfig.addPassthroughCopy("sw.js")
  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPlugin(mathjaxPlugin);

  eleventyConfig.setLibrary("md", markdownLib)
}
