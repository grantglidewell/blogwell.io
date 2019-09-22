---
title: 'Running JavaScript'
description: how to run javascript code
date: '2019-09-21'
author: 'Grant Glidewell'
image: ''
---

#### JavaScript, how do I run it?

This question may seem very simple, but it occurs to me that this question only seems simple once you've learned how to do it. After this point we seem to forget the wonder and amazement of seeing code run. We forget that one of our first questions when learning to write JS was likely 'without this prepared environment I'm working in, how would I run this?' So in this article I'll explore some options on how to run JavaScript code. We'll cover JS's home, the browser and how we can get code to run in the browser. We'll then explore running code outside of the browser using Nodejs.

##### JavaScript in the browser, at home

The original home for JavaScript is the browser. The intention for this language (once called Mocha, and LiveScript) was to provide a way for web developers to create more interactive web experiences. While it's outgrown that original role, JS is still _the_ native language of the web. That said, how do you make it do it's thing?

The easiest way to get this to happen is to create an HTML document. Anywhere you want to put it is fine, but it will probably be best to start an organized directory to keep your work. Let's call this folder `Developer` for now. So if I create an HTML file called `index.html` that looks like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script>
      // everything in here will run!
      console.log('JS is running!')
    </script>
    <title>Document</title>
  </head>
  <body></body>
</html>
```

You can open this in your browser of choice, and now you may be thinking 'hey, what gives?' But there's one more step here, right click the page and select `inspect`. In the inspector make sure you have the `console` tab open. Now you see it, don't you? What you've been looking for all along? Everything in that script tag is running in your browser. You can do whatever you want, like `document.body.append('Im a thing now!')` right in the console and see the result live! There are a couple of things to note. One is that writing code in the console does not edit your file directly, and another is that editing your file directly does not live reload your browser. You'll have to refresh to see any changes you make.

Some may also note that if they try to put the append code from the last paragraph into the script tag, they get an error. Well that has to do with where we put the script tag. Having the script tag in the head isn't always what you want. In this case, we are trying to execute an append on the body without the body actually existing! Because the code is executed (or run) from top to bottom, that line of code runs before the body is rendered, thus the error. One solution is to move to script tag to the bottom of the body tag. This way the script is executed after everything in the body tag is rendered. Another way to solve this is to use an `onload` function. That would look something like this:

```js
window.onload = function() {
  document.body.append('Im a thing now!')
}
```

Another question that often follows this is 'but... I want to just write JavaScript and not deal with the HTML tags.' This is a thing, you can absolutely do it. If you create a file in the same directory as your `index.html` file and call it `index.js`, you can use the `src` attribute of the script tag, instead of writing script in the html file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <script src="index.js"></script>
  </body>
</html>
```

Now you have JS, separate from html, running in the browser. Feel free to [createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement), [append](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append), [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), or [whatever](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) to your heart's content!

##### Are you too good for your home?

Well the home of JS might be the browser, but it's not always where we want to run our code. Nodejs provides us with a way to run code 'server side', this just means the code runs on our computer rather than in the browser. **Be Warned: this involves using the command line, which is out of the scope of this article.** First things first, you've got to have [Nodejs installed](https://nodejs.org/en/download/) on your machine. Now that we have that installed we need a file to run. We can use the one from the browser that we've already written. It should look like this:

```js
console.log('JS is running!')
window.onload = function() {
  document.body.append('Im a thing now!')
}
```

In your terminal `cd` into the directory where this file lives. Now that you have node installed you can run `node index.js`. So we get what we expect from the first line 'JS is running!', but the error after that is something that we should talk about. `Window` is something that only exists in the browser, node uses something called [`globals`](https://nodejs.org/api/globals.html), but again this is outside the scope of this article. You'll be able to run any JavaScript file in the command line like this but be aware that JS written for the browser will usually throw this kind of error. If we edit the `index.js` to look like this:

```js
console.log('JS is running!')
const hello = ['h', 'e', 'l', 'l', 'o']
hello.map((letter, index) => console.log(' '.repeat(index), letter))
```

Running that again should deliver no errors and a nice little message. For challenges that run in the browser like those from [codewars](https://www.codewars.com), [FreeCodeCamp](https://www.freecodecamp.org) and similar sites, running your code locally this way might allow for some more testing and debugging options (like logging out values as they pass through your function). Hope this was informative and you now have some insight into how you can run your code all over the place!
