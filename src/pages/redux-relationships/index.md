---
title: 'Relationships are hard'
description: making decisions in a react redux application
date: '2019-01-07'
image: ''
---

## Relational content in react/redux

We recently released our new content management ui. This was a huge undertaking, were re-building our core product. Previously the app was a PHP monolith, our new release is built in React/Redux and relies heavily on a new golang rest api. This means we are now relying on calls to an api rather than directly manipulating a database. There are clear advantages with this approach, one being the code can be much cleaner as it’s purpose becomes more singular. It did, however, make some actions more difficult. One of those issues came in the form of relationships.

In any CMS users are going to want to create relationships.
In general a relationship is simple, an ID on item (in this case an article), will point to another related piece of data (in this case an author for that article). In Zesty's context relationships are a little bit more complex. What matters here are that we dont just have content items, we have fields attached to those content items which define what they are and how they behave in different contexts.

![](https://github.com/grantglidewell/sdjs-relationship-resolution/raw/master/listview.png)
In our list view here we see some articles. They have titles, images, dates, tags, and what we actually care about here is Authors.
