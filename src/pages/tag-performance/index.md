---
title: 'Performance and Gatsby'
description: 'Getting the best performance out of a Gatsby site'
date: '2019-08-29'
author: 'Grant Glidewell'
image: ''
---

In our recent rebrand at Third and Grove we took on a Drupal headless build with a Gatsby front end. Throughout this process there were growing pains. These resulted from a few places: developers less familiar with React and Gatsby, using new and actively changing tools, and being at the edge of what that technology is capable of. We ran into some issues that we thought were really strange with bundle sizes, which turned out to be due to the way we were querying images. We also ran into load time issues with some SVGs that were being handled with a library called svgr. We also had a few fonts to load. Well, 18 (_yeah that’s right_). As a last resort implementing our own lazy loading helped bring us in a perfect lighthouse score!

![lighthouse performance of 400](https://i.imgur.com/8MUvZ8j.gif 'light performance score of 400')

Even though we won this war, there are lessons we would like to pass on, the first being that Gatsby documentation recommends using `useStaticQuery`.

```js
childImageSharp {
         fluid(maxWidth: 980, maxHeight: 480) {
           ...GatsbyImageSharpFluid_withWebp
         }
       }
```

However, if you do this, and are using gatsby-image with a query that accesses an image sharp child (see above), you are building a JSON object with a base64 encoded image. useStaticQuery is great, powerful, and super convenient. But without knowing this one piece of very important information, we were bloating our bundles beyond recognition. Once we discovered this we were able to re-plumb that same data through page queries (which do not have this behavior). For a few of these components we had to rewrite queries if they were in `gatsby-node.js` and used any fragment, we were hosed. Gatsby runs that file before declaring those fragments (including the gatsby image fragments that are so useful). So this clearly required some work as far as making sure gatsby image had everything it needed to do its job.

Once our data was re-plumbed and we had rid our js bundles from base64 images we had to take a look at another wart. This time in the form of SVGs and how we had implemented them in React. The library svgr is commonly used to make working with SVGs simple in React. You can treat them as React components and I thought this was a neat dev experience. Well I was dumbstruck when I realized that the tradeoff was a blocking render the converted svg components. Browsers are smart, they know what to do with a lot of different file types. JS in particular needs to be parsed and executed. The svgr library (or potentially the way the gatsby plugin for this library works) had takes what are essentially images that the browser will load asynchronously, and turned them into a blocking operation. So we backtracked our way to just allowing them to images, and load that way, as browsers intended. Another moderate refactor later and we were on to the next issue, fonting.

As I mentioned, we use a few fonts on our site. The fonts are an integral part of the look. And they look stunning. All 18 weights and variants! There is very little you can do in the way of compression for fonts, unlike images, which at build time we are able to cut down to a reasonable size no matter what the source. We started with woff files, by converting those to woff2 we saved about ⅓ on the total transfer of all of these. So now we’re looking at ~20kb over 18 fonts thats still a whopping 360k down the wire! First thing to do was see what fonts we were using on the homepage. After narrowing that down to only 8 we preloaded those particular fonts. The font definitions had to updated to reference the local preloaded fonts as well (I initially forgot this and doubled the load for some fonts, whoops).

```js
<link
  rel="preload"
  href="/Fonts/Canela/Canela-Black.woff2"
  as="font"
  crossOrigin="anonymous"
  type="font/woff2"
/>
```

After preloading, allowing our other fonts to render with blocking was important. Using `font-display` in the font-face definition gave us the behavior we were looking for. As much as they can be, fonts are under control. There are some other ideas around using JS to load fonts but I'm not sure the tradeoff of execution vs loading them with the native browser is worth it.

Finally, our scores were edging into the 80s depending on how we measured (remember to always use incognito with no extensions running). But that wasn't good enough. This is potentially a very fast site, and high scores aren't going to cut it. But the answer for that last 15% wasn't going to be found in Gatsby, we had already leveraged their lazy loading, image pre processing, everything. Good thing React still has some tricks up its sleeves! Why would we render a whole homepage with two sliders, and a lot more images below the fold. So we don't render anything below the fold, and when someone scrolls to a certain point that will kick off loading the rest of the page. This process is seamless and most users wont even know its happening. To see it in action give our homepage a hard refresh (cmd+shift+r) and open the network tab in the inspector. You'll see the initial payloads come in on page load, and then when you scroll down another few items coming in to fill out the rest of the page. The technique is used in windowing or virtualization for large lists, only here its handling a much less complex effect.

All of this combined to make our page extremely fast. Thanks in no small part to Gatsby’s build process. We do plan to contribute back in the form of writing some plugins to handle scrolling to hashed (anchor) URLS. Potentially a plugin to crawl pages and add `prelaod` tags for fonts used on those pages. Documentation on useStaticQuery that makes its actions a bit more transparent for users. We believe in open source and that Gatsby pushes boundaries with their data ingestion, plugin ecosystem, and build pipeline. Looking forward to making more impressively fast sites!
