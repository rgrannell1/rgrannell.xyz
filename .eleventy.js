
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginRss = require("@11ty/eleventy-plugin-rss")

let markdownIt = require("markdown-it")
let markdownItKatex = require("markdown-it-katex")
let options = {
  html: true,
  breaks: false,
  linkify: true
}

let markdownLib = markdownIt(options).use(markdownItKatex)

module.exports = function(eleventyConfig) {
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateRfc3339)
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addPassthroughCopy("css")

  eleventyConfig.setLibrary("md", markdownLib)
}
