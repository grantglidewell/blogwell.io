---
title: 'Moving From useReducer To Redux'
description: 'When custom tooling falls short, reach for something familiar and well proven.'
date: '2020-10-30'
author: 'Grant Glidewell'
image: ''
---

![Perfect Winecellar by David Vogel](https://images.unsplash.com/photo-1528823872057-9c018a7a7553?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)

#### What We Were Doing

Our application involves a multistep form. This form changes depending on a user's location, as well as some other decisions they are able to make. In the process of development we have moved from local state, to lifting state up, to using a context provider, and eventually to a large customized global state solution involving useReducer.

Our project is heavily typed TS/React. I dont just mean that we have compile time typechecking. We do some nifty runtime type checking as well. I can discuss that in another post perhaps. But this means that not just our components and internal code need to be typed, but also our IO. There are some unique problems this causes when dealing with global state.

Our global state solution worked fine, until we were given new requirements that involved needing to split our global stores up so we werent dealing with a large single `useReducer` at the core of our store. This is not only ugly, but becoms very hard to isolate and flatten so that references are easy to surface. We needed to combine multiple reducers. There are packages out there that do just that. But looking at their code it seemed like there was quite a bit going on. Maybe our custom solution had outlived it's utility.

#### Weighing Redux

Our team has all used redux in one form or another on previous projects. We like it in general but know better than to reach for it too soon. In this case the timing seemed right. All of the groundwork was basically laid out in our existing reducer, it's nice that this is a pattern we can basically copy paste over. But does this actually meet all of our needs making the work to transition worth the effort?

We needed to ensure that whatever direction we went played well with how our types are set up. Redux has excellent type support, their `RootState` convention gives us the insight we want to see from our global store. Our immediate need was better organization. `combineReducers` is exactly what we wanted and also allows us to manage our copious types for each sub-store to be co-located appropriately. 

#### The Actual Work

Now that we had landed on Redux and accepted it was the right choice, we got to work. Our global store was central, so this involved splitting the reducer and their accompanying types into sub-stores, and then migrating to the redux hooks where that state was consumed.  Since we wanted to split our stores up we were able to progressively convert the app over to Redux. 

For example, in one section of our application we have a wizard flow. The user progresses through a flow of choices and this has an impact on a set of products the user can choose from that matches their needs. Pretty standard stuff. First we create a store as per the [Redux documentation](https://redux.js.org/api/createstore). However we know that we are going to need multiple sub-stores, so we use [`combineReducers`](https://redux.js.org/api/combinereducers) instead of passing a single reducer to `createStore`. We also need to split up our `ROOT_STATE` type. This essentially [describes the shape of each substore](https://redux.js.org/recipes/usage-with-typescript#typing-the-usedispatch-hook). Our root state was essentially constructed alongside our combined reducers.

```javascript
const reducers = combineReducers({
  PLAN_WIZARD: REDUCER_PLAN_WIZARD,
  UTILS: REDUCER_UTILS,
  CART: REDUCER_CART,
});

export type ROOT_STATE = ReturnType<typeof reducers>
```

Now for the easy part, `useReducer` uses exactly the same pattern as a redux reducer. This entire conversion consisted of cutting us a very long reducer into smaller reducers. Once we had a few stores moved over we were then tasked with hunting down where that state was consumed and modified and switching out the `dispatch` calls from `useReducer` to `useDispatch` calls from Redux. This could be done progressively without breaking everything. 

Let me emphasize how important that is. Our application was originally designed to be ephemeral. This mean using almost no state at all. Due to some constraints added through the course of development we had to add some local state. Eventually this became so hard to manage we converted to something global. Considering this progression you can imagine there be dragons. And there probably were, but honestly this transition, mostly due to the matching APIs, was incredibly smooth. 

The common wisdom around Redux is "dont use it unless you need it". Which I advocate personally and have done so in many projects. However, I think this new set of tools with react hooks makes progressive adoption a real option. Previously this would have looked very different. We would have been pulling lifted and prop drilled local state out of many different places and converting that logic to something Redux could handle. So I guess its time to change the common wisdom. A path has been laid to move slowly in a direction that frightened many devs historically. 

The progression would look like this:
 - useState
 - lift state up and prop drill
 - useReducer for larger state handling
 - use a Context provider with useReducer
 - convert to Redux

This is a clear path for anyone building with React. Yes yes, there are lots of other aspects like async actions and libraries such as MobX that could be mentioned. But if you want to start building and not worry about the pain of converting, these patterns painlessly convert into one another, what more can you ask for?