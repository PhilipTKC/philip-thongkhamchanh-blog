/* eslint-disable @typescript-eslint/no-var-requires */
const markdownIt = require("markdown-it");
const attrs = require("markdown-it-attrs");
const bracketedSpans = require("markdown-it-bracketed-spans");
const customBlock = require("markdown-it-custom-block");
const divs = require("markdown-it-div");
const hljs = require("highlight.js");

const emoji = require('markdown-it-emoji');
const twemoji = require('twemoji');

const labelErrorMessage = `<span class="label">Labels are not formatted correctly. Should be formatted as ["one", "two"]</span>`;
const labelLink = (label) => `<a><span class='label mr-3 mb-4'>${label}</span></a>`;

const customBlocks = {
  labels(labels) {
    let parsed;
    try {
      parsed = JSON.parse(labels);
    } catch (_) {
      return labelErrorMessage;
    }

    return `<div class="mb-4">${parsed
      .map((label) => {
        return labelLink(label);
      })
      .join("")}</div>`;
  },
};

function highlighter(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + "</code></pre>";
    } catch (__) {
      //
    }
  }

  return '<pre class="hljs"><code>' + markdownIt().utils.escapeHtml(str) + "</code></pre>";
}

const markdownItConfig = markdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    return highlighter(str, lang);
  },
})
  .use(attrs)
  .use(bracketedSpans)
  .use(customBlock, customBlocks)
  .use(divs)
  .use(emoji);

markdownItConfig.renderer.rules.emoji = function (token, idx) {
  return twemoji.parse(token[idx].content);
};

module.exports = markdownItConfig;
