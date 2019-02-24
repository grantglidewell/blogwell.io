---
title: 'Relationships are hard'
description: making decisions in a react redux application
date: '2019-01-07'
image: ''
---

## Relational content in react/redux

At [Zesty.io](https://www.zesty.io/) we recently released our new content management ui. This was a huge undertaking, were re-building our core product. Previously the app was a PHP monolith, our new release is built in React/Redux and relies heavily on a new golang rest api. This means we are now relying on calls to an api rather than directly manipulating a database. There are clear advantages with this approach, one being the code can be much cleaner as it’s purpose becomes more singular. It did, however, make some actions more difficult. One of those issues came in the form of relationships.

> In any CMS users are going to want to create relationships.

Generally a relationship is simple, an ID on item (in this case an article), will point to another related piece of data (in this case an author for that article). In Zesty's context relationships are a little bit more complex. What matters here are that we dont just have content items, we have fields attached to those content items which define what they are and how they behave in different contexts.

![](https://github.com/grantglidewell/sdjs-relationship-resolution/raw/master/listview.png)
In our list view here we see some articles. They have titles, images, dates, tags, and what we actually care about here is Authors. Authors are not references directly from the 'content item' object. Since authors are a separate piece of data, they show up in the content item as a relationship (ie. `[contentID:3829239;fieldID:9239923]`). In order to resolve these authors to the names you see here, we have to look up the item in our store, and then look up the correct field on that item. So the data we are dealing with could be incomplete in our store in two places. We may need to get fields, or the related author. Either one of these pieces missing will result in the UI not being able to display the author. We have loading states to handle that, which is another issue altogether.

> We considered a few options for dealing with where the responsibility for resolving relationships should live in our application.

First thought was that the component trying to load the data would be the first to know that the data was not present. This component could trigger a fetch as soon as it became aware that the data it needs to display is not available. This works in a few other places in our app. However this is a bad idea because while the component is aware that the data isnt available, it's a very high level component that is totally unaware if the data it's looking for is also unavailable to other components and would result in multiple redundant fetch requests.

![](https://github.com/grantglidewell/sdjs-relationship-resolution/raw/master/listview3.png)
The highlighted author here would make fetching based on the data availability to the component highly inefficient. There are other reasons that the component level is a bad place for this behavior to live, but this reason is enough to move on.

We also considered doing this work in an action/reducer, but that quickly fell apart as that would lead away from predictability in our store.

[Actions are payloads of information that send data from your application to your store. They are the only source of information for the store.](https://redux.js.org/basics/actions) The redux docs are clear that actions are not a good place to have any sort of branching logic. They do however offer a place for these behaviors. Middleware [provides a third-party extension point between dispatching an action, and the moment it reaches the reducer.](https://redux.js.org/advanced/middleware)

In our app we are fetching a lot of data, for reasons. We should ensure first and foremost that we are not making duplicate calls. So our first piece of middleware accomplishes that goal.

```javascript
export const fetchResource = store => next => action => {
  if (action.type === 'FETCH_RESOURCE') {
    if (`The request is not already in flight`) {
      inflight.push(action.uri)
      return request(action.uri)
    }
  }
}
```

We essentially wrap every resource call and catalog which requests are in flight. And only allow unique requests to send. This could serve many other purposes but for now this is all we needed to accomplish.

We needed a way to know as soon as possible that an item has some relational data. This information lives on the field. So we peek at fields as they come in.

```javascript
export const resolveFieldOptions = store => next => action => {
  if (action.type === 'FETCH_FIELDS_SUCCESS') {
    if (`field contains relationships`) {
      parseRelationships().then(relatedItem => {
        dispatch({ type: 'FETCH_RESOURCE', uri: `uri.to.${relatedItem}` })
      })
    }
  }
}
```

If a field has a relationship, we go ahead and request the related resource. If the resource is the same as another, we have already accounted for that with our fetchResource middleware. In this scenario we are freed up in all areas of the app. We are able to deal with items and know that in the background the related data will just show up. I'm not a fan of magic in programming, but having written the so called 'man behind the curtain' I have a much better feeling about this abstraction.
