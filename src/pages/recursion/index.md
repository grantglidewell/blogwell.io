---
title: 'Learn Recursion from Mr Meeseeks'
description: Mr Meeseeks teaches recursion
date: '2018-08-31'
author: 'Grant Glidewell'
image: ''
---

Recursion is a concept that can be hard to grasp at first. So I’ve asked Mr Meeseeks to help me out. If you’re aware of this lovely character from the cartoon Rick and Morty, you may know where I’m going. If not, Mr Meeseeks is a magical character that is able to grant wishes. If you can, take a look at the episode. If not here’s a synopsis from wikipedia:

> When the rest of the Smith family asks Rick for solutions to several mundane problems, he gives the family a Meeseeks Box, a gadget capable of causing helpful beings named “Mr. Meeseeks” to materialize each time its button is pushed. These identical and short-lived creatures exist only to execute the first order they are given; once it is completed, they vanish. Rick warns the family to keep their tasks simple. — [https://en.wikipedia.org/wiki/Meeseeks_and_Destroy](https://en.wikipedia.org/wiki/Meeseeks_and_Destroy)

ill be referencing this repo in the article:
[github.com](https://github.com/grantglidewell/mrmeeseeks)

Consider for a moment, that functions are really just in existence for the brief time they are run and, like a Meeseeks, they die after they have served their purpose. If a Meeseeks is able to simply accomplish the request given to him, he is rewarded with a short life. However if the task is too complicated for one Meeseeks to complete, he can call another Meeseeks for backup. This is excellent! however, two Meeseeks isnt always better than one, and this can get out of control very quickly if handled improperly. Remember, Meeseeks arent Gods, just simple problem solvers.

When a Meeseeks needs another Meeseeks to help him, this is recursion. The function is set up to call itself under certain conditions. In the Rick and Morty episode first featuring this magical creature he calls himself to deal with a complex problem. The problem he faces is taking two strokes off of Jerry’s golf game. This is not a simple task in the slightest. In order to accomplish this an entire recursive colony of Meeseeks are called to help with this task. While only one Meeseeks is sufficient to accomplish other simpler tasks.

The key here is conditioning, lets leave the analogy for a bit here. When you need recursion to solve a problem in programming, you’re essentially creating a tree structure. This means that you have to handle a base case. The base is the input to the function for which it will not recurse. You can think of these cases as the end of a branch. In the case of my example code, if the desire sent to Mr Meeseeks is less than three words long, he will handle it himself.

![](https://cdn-images-1.medium.com/max/2000/1*ufBA7xFn9qkORjLpoYmAIA.png)

However, if recursion is necessary to continue processing the request, you must change the request (moving it towards the base case) before handing it back to the recursive function. Why? because we dont want to create an infinite loop. Back to Meeseeks.

In the episode, Jerry is hopeless at golf, and the Meeseeks called upon to help become despondent. Calling new after new after new Meeseeks to give assistance, but without really clearly defining _new_ tasks for them to solve. This is an infinite loop. If you dont change the ‘state’ passed to the recursive function, you will never reach the base case and the program is an infinite loop. In this example, the desire passed into the function is split into two smaller desires and handed to two new Meeseeks.

This is where the function calls itself, it is actually ‘recursing’.

![](https://cdn-images-1.medium.com/max/2000/1*bu2j1v7qxok1SZ4MR4yMxw.png)

Essentially what happens here is that the function will run again, but with only half of the request. This will happen repeatedly (recursively) until the base case is reached.

![](https://cdn-images-1.medium.com/max/2000/1*mJh4hWvg2S7_zj5RCWPF7A.png)

What we see here is the Meeseeks taking the desire, splitting it up into small enough segments (less than three words) and then fulfilling those requests.

You can see the Meeseeks spawn into existence until the chunks are small enough to start fulfilling the requests. then you see them poof out of existence. Don’t worry, they prefer it that way. Meeseeks don’t like existing for too long, it’s a sign that there might be an infinite loop.
