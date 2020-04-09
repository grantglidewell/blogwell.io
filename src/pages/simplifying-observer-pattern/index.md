---
title: 'Simplifying Observer Pattern'
description: 'The observer pattern is less complicated than you think. I attempt to simplify a powerful approach to creating a shared state object.'
date: '2020-04-09'
author: 'Grant Glidewell'
image: ''
---

![Haleakala Observatory above sunset clouds by Jad Limcaco](https://images.unsplash.com/photo-1496185055223-6e9d83d1c4e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60)

Recently I ran into a problem with React's Context API (unnecessary re-renders). I was in search of a way to communicate changes in a state-like object to subscribers. I was familiar with the 'observer pattern' from Rxjs and Riotjs, but I wanted to implement it myself instead of relying on a library. I also wanted something that was not actually tied to working with the DOM, or using class instances, or creating multiple abstractions that seem unnecessary.

In this article I'll cover a simple Node application using the pattern, and then get into how to tie it into React. Lets just start with the base implementation.

```js
function initObservable() {
  let observableData = []
  let observers = []

  const subscribe = obs => observers.push(obs)
  const unsubscribe = f => (observers = observers.filter(obs => obs !== f))

  const updateObservers = () => observers.forEach(obs => obs(observableData))

  const updateData = newData => {
    observableData = newData
    updateObservers()
  }

  const add = data => {
    updateData([
      ...observableData,
      {
        ...data,
        id: data.id || Date.now() + observableData.length,
      },
    ])
  }

  const remove = id => {
    updateData(observableData.filter(not => not.id !== id))
  }

  return {
    add,
    remove,
    subscribe,
    unsubscribe,
  }
}
```

Here we have a function that acts as a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) around some useful methods and data. We initialize a couple of variables, `observableData` and `observers` are both empty arrays. `subscribe` and `unsubscribe` only act to add and remove 'observers' from the array. `updateObservers` is where some magic happens, you can see we iterate through the observers list, executing each observer. In this instance observers must be functions, we'll get to how that works soon. `updateData` essentially handles the replacement of the `observableData` variable and then calls `updateObservers` so every subscriber stays in sync. We then have `add` and `remove` methods to update the `observableData` variable.

Now, how can we actually use this? Since it's a function we just have to instantiate it. This just means running the function. But we cant just execute `initObservable()`, we need to be able to use those methods, so we assign the return value from the function to a variable. Because we know what methods we want to use from this function we can destsructure those methods.

```js
const { add, remove, subscribe, unsubscribe } = initObservable()
```

Now we have the utility we need to use this observable. As I mentioned, we will first implement this with Node. Lets create a way to get some insight into whats going on. We need something to use the information when it changes. The simplest implementation is to log it out to the console. So lets create a function that logs out whatever data it's fed.

```js
const logger = id => console.log(id)
```

Now we need to subscribe to changes.

```js
subscribe(logger)
```

Every change to the state object will be logged using our logger function.

```js
add({ message: 'magic as an act of defiance', id: 1 })
// [ { message: 'magic as an act of defiance', id: 1 } ]
add({ message: 'resistance through beauty', id: 2 })
// [ { message: 'magic as an act of defiance', id: 1 },
// { message: 'resistance through beauty', id: 2 } ]
remove(1)
// [ { message: 'resistance through beauty', id: 2 } ]
```

So what happens when we run `add()`? The data passed to `add()` is combined with `observableData` and passed on to the `updateData()` function which actually replaces `observableData`. Now `updateData()` also triggers `updateObservers()` which iterates through the list of subscribed observers. In this implementation we execute them directly, this can be handled differently, sometimes with a specific method that is executed on the observer. However for simplicity's sake we pass the update function which is `logger` and we see the new state reflected as it is passed to that function and logged out. Running `remove()` shows us that the message attached to the specific ID we pass has been removed.

Basically we have an object, that when it is updated, all subscribers are aware of the change. Now on to implementing this is React. I used this pattern because I needed to update a component's state from one DOM branch to another. There are alternatives, we could lift state up, but these components are deep in the tree and Im not a fan of prop drilling. We could use Context API (and I did) however this results in re-renders in all branches that are wrapped in the provider. The issue is that _where this state is updated from doesn't matter_, and shouldn't re-render in response to the changes. You may think that this is what portals are for, and you'd be right. However in order to read from the same Context we encounter the issue where we are re-rendering components that just don't need it. With this Observer pattern we have decoupled the `add` and `remove` functions from the `subscribe` behavior we want. This is afaik not possible with Context.

If you just want to cut to a working example [here's a working code sandbox](https://codesandbox.io/s/gallant-dhawan-evyx1). If you want a short walk through of each part Ill provide that here.

Just like in the node implementation we create an observable function that returns the methods we want to use in our React app.

```js
// observer.js
const initNotes = () => {
  let Notes = []
  let observers = []
  const updateNotes = newNotes => {
    Notes = newNotes
    update()
  }
  const subscribe = obs => observers.push(obs)
  const unsubscribe = f => (observers = observers.filter(obs => obs !== f))

  const addNote = Note => {
    updateNotes([
      ...Notes,
      {
        ...Note,
        id: Note.id || Date.now() + Notes.length,
      },
    ])
  }
  const removeNote = id => {
    updateNotes(Notes.filter(not => not.id !== id))
  }

  const update = () => observers.forEach(obs => obs(Notes))

  return {
    addNote,
    removeNote,
    subscribe,
    unsubscribe,
  }
}

const NoteInstance = initNotes()

export default NoteInstance
```

What we export for use here is just an instance of the observer. In our application there are parts concerned with updating the state, and other parts that are concerned with consuming those state changes.

```js
// App.js
import React, { useState } from 'react'
import './styles.css'
import NoteInstance from './observer'

import NoteList from './NoteList'

export default function App() {
  const [message, setMessage] = useState('')
  const updateNotes = () => {
    NoteInstance.addNote({ message })
    setMessage('')
  }

  return (
    <div className="App">
      <h2>Add Notes</h2>
      <input
        type="text"
        value={message}
        onChange={evt => setMessage(evt.target.value)}
        onKeyUp={evt => {
          if (evt.keyCode === 13) {
            updateNotes()
          }
        }}
      />
      <button type="button" onClick={() => updateNotes()}>
        add
      </button>
      <NoteList />
    </div>
  )
}
```

App here is concerned only with updating internal and `NoteInstance` state. In our `updateNotes` function we call `NoteInstance.addNote()`, This allows us to update the state in our observer instance and then reset the local input's state. This component doesn't care about anything but updating that state. But it would be pretty pointless if we just updated state, We need to use that state somewhere else.

```js
// NoteList.js
import React, { useEffect, useState } from 'react'

import NoteInstance from './observer'

export default () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    NoteInstance.subscribe(setNotes)
    return () => {
      NoteInstance.unsubscribe(setNotes)
    }
  }, [])
  return notes.map(not => (
    <p key={not.id}>
      {not.message}{' '}
      <button onClick={() => NoteInstance.removeNote(not.id)}>X</button>
    </p>
  ))
}
```

NoteList does a couple things interacting with the observable. First and foremost we are using `useState` to create a local copy of the observer's provided data. The updater function provided by `useState` is perfect for our use case, as I mentioned above we have implemented our observer instance to execute it's observers directly so they much be functions. This is why. Now every time the data in the observable instance is updated the state in out component reflects those changes immediately. Note that we are unsubscribing in the cleanup return from useEffect. Another thing happening is that we are able to remove notes as well. There is a high level of flexibility and power in this pattern. Understanding how it work s and where it would be a good fit to use will help you immensely throughout your career.
