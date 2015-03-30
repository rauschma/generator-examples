# Generator examples

This repository contains the code examples from the blog post “[ES6 generators in depth](http://www.2ality.com/2015/03/es6-generators.html)”.

Directories:

* `data/` The data used by the example `node/co_demo/`
* `node/` Node.js-based examples.
    * Install packages that the code depends on: `cd node/ ; npm install`
    * Use [babel-node](http://www.2ality.com/2015/03/babel-on-node.html) to run them.
* `nonblocking-counter/` Web-based example: a non-blocking counter shown on a web page. Uses Babel to run in current browsers.
    * Run online: [rauschma.github.io/generator-examples/nonblocking-counter/](https://rauschma.github.io/generator-examples/nonblocking-counter/)
    * Run offline: Download this repo to your hard drive. You can run `generator-examples/index.html` in your browser, directly from the file system.

