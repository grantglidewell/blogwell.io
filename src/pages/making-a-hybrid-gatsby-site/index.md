---
title: 'Making A Hybrid Gatsby Site'
description: 'Gatsby can create much more than a static site, the hybrid approach leverages React as well as static to create something awesome'
date: '2020-02-04'
author: 'Grant Glidewell'
image: ''
---

![untitled - flowers by Wyatt Ryan](https://images.unsplash.com/photo-1503355538147-f17290cbfaec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)

#### Why combine?

A while back, [I wrote an article for BigCommerce](https://medium.com/bigcommerce-developer-blog/blazing-speed-without-the-pain-points-try-the-new-bigcommerce-gatsby-and-netlify-cms-starter-d8a343608637) about dealing with issues that are prevalent in e-commerce sites built with Gatsby. Essentially the issue is that we don't want to static render too much content in situations where that content changes a lot. This helps to avoid any issues where a user might see a flash of incorrect information about a product.

This issue isn't limited to e-commerce though. While rebuilding [grantglidewell.com](https://www.grantglidewell.com) I simply didn't want to string together a bunch of rebuild hooks to handle updating it whenever I published a new article, or new YouTube video, or changed something else somewhere on the internet. Now to be clear, this is totally possible to do, but I felt it was cleaner and more obvious to future Grant what was going on if I just kept everything as simple as possible for this tiny project.

#### How it works

With a regular Gatsby site you want to leverage the GraphQL hydration that happens at build time as much as possible. With a hybrid approach there is a deliberate split in your data sourcing. So some data will be pulled in during the build process and other data will be pulled in on the client. This is possible because **Gatsby isnt a static site generator**, it's a PWA generator. Just like any other web app that uses React we can do _so much_ on the client it's insane. Be cautious with this approach as going too far down this path might defeat the purpose of using a meta-framework like Gatsby entirely.

There are some things you may need to be aware of if your first exposure to React was through Gatsby. Since this approach wont use Gatsby's GraphQL layer we have a few states to handle. Plumbing data at build time with Gatsby doesn't need to consider a loading state, or an error state, as that will just abort the build and you have to fix the query or bad data reference to complete it. However when you fetch data on the client side, we relinquish some control and need to handle these cases explicitly.

There are options, one might be [React Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html), however that is as of this writing experimental and unlikely to support server side rendering anytime soon. There are some excellent writings out there about using a [state machine]https://kyleshevlin.com/what-are-state-machines to handle these states. I would recommend [Kyle Shevlin's article](https://kyleshevlin.com/enumerate-dont-booleanate) that covers a very detailed implementation of this approach.

If you want something more complex the source code for the [BigCommerce + Netlify starter](https://github.com/bigcommerce/gatsby-bigcommerce-netlify-cms-starter) covers the use of [context API](https://github.com/bigcommerce/gatsby-bigcommerce-netlify-cms-starter/tree/master/src/context) to achieve the same result.

The simplest way to do this?

```js
const RandomDog = () => {
  const [dogUrl, setState] = useState('')
  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(data => data.json)
      .then(json => setState(json.message))
  }, [])
  return <img src={dogUrl} alt="random dog" />
}
```

Essentially this is all you have to do to get data into a React component from an external source. This does nothing to handle loading, errors etc. But it's a place to start. I get into more detail in [this video](https://youtu.be/V9UsdrTtfJg).

#### Decisions

What this really comes down to is deciding where you want to leverage Gatsby, and where you dont. Gatsby solves some interesting problems, but isn't always the best solution for some areas. They break this down [in their documentation](https://www.gatsbyjs.org/docs/adding-app-and-website-functionality/), but I think it makes it seem more complex to accomplish this than it actually is. Gatsby is a React meta-framework, and even though it uses server rendering, you don't lose the ability to use React for what it's great at.

Im a fan of a lot of what Gatsby has to offer. Part of what it has done is provide an on ramp to a lot of developers into using React. Learning where React begins and Gatsby ends is an important part of becoming proficient in this style of development. I plan to address more of these issues in forthcoming articles, but sufficed to say that a hybrid Gatsby does nothing more than leverage React for data acquisition on the client rather than queries run at build time.
