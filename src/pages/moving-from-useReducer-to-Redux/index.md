---
title: 'Moving From useReducer To Redux'
description: ''
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