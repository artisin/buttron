# buttron

[![Build Status](https://travis-ci.org/artisin/buttron.svg?branch=master)](https://travis-ci.org/artisin/buttron)
[![NPM](https://nodei.co/npm/buttron.png?compact=true)](https://npmjs.org/package/buttron)

# About

The myth, the legend, the origin of ctr. Buttron is a 3433 line Stylus program that taught me how to program quite literally. In retrospect, it was a romanticly naive endeavor, but it taught me some invaluable lessons and more importantly, I think I can safely claim I created the most sophisticated Stylus program ever to grace this earth.

Buttron is backed by 163 tests and it's intended for novelty purposes, but you can use it as you see fit. 

# Usage

You can either plop `buttron.styl` in your Stylus project or install it via npm and pipe it through the Stylus `.use(fn)`.



```js
var stylus  = require('stylus'),
    buttron = require('buttron');

stylus(fs.readFileSync('./example.styl', 'utf8'))
  .use(buttron())
  .render(function(err, css){
    if (err) return console.error(err);
    console.log(css);
  });
```


Best, te