
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
//  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.setLibrary("md", markdownLib)
}
