---
title: 'Testing with Cypress.io'
description: Testing react applications with Cypress
date: '2018-07-30'
author: 'Grant Glidewell'
image: ''
---

“Lone green treetop tree on the coastline field at Poipu Beach” by Todd Quackenbush on Unsplash. Its a tree, probably not a cypress, dont be so picky.

Testing, how does it work? Well, to be honest, I don’t know much about it. I have used jest a handful of times, I have manually tested UI, and done my best to error-proof (go ahead, laugh at that) response handlers in my front end code. But as for actually making a good habit of testing the overall functionality of my code I have fallen, staggeringly short of my goals. The main hurdle for me was getting down to **what needs to be tested**. There are schools of thought on this, but my opinion would follow along with [\*Guillermo Rauch](undefined) _when he tweeted_ - ‘\*Write tests. Not too many. Mostly integration.’

In those tests I want to cover as much ground as possible. Cypress.io gives it’s users tools to spin up a browser, and using a j-query-like syntax walk it through flows of behavior a user would actually go through. Considering our app requires auth to access it’s core behaviors, I needed something that would give me the ability to log in, render my UI, interact with it, and then test certain expected outcomes. Cypress.io has excellent [docs](https://docs.cypress.io/) and I was able to get up and going in minutes. I’ll only briefly cover that process. Installation through npm is just like any other package, upon running npm run cypress open for the first time you’ll be introduced to your new best friend: The Cypress test runner. It comes with examples of almost everything you could want to accomplish, and tests are listed out in their electron interface. You can select other browsers to run if you have them installed. Lots of room here to really go nuts if you want to. I did not. I just needed a test, so first things first, let’s create a test to ensure the app fails correctly when someone uses bad credentials.

![](https://cdn-images-1.medium.com/max/3064/1*oWxTwxSRwbGIelUQlq7M7g.png)

The first thing you may notice is that Cypress allows you to set up environment variables. This is excellent, as well as the ability to create custom commands (logging in with good credentials, navigating to a certain app segment, anything you need automated). Cypress uses mocha under the hood so writing assertions should be familiar to anyone who has used it before, and simple enough for anyone who has not. Line by line this test does the following-

go to the local instance of app

get the username input

input the environment value for an invalid username

check that the value in that field is correct

get the password field

input the environment value for an invalid password

check that the value in that field is correct

get the submit button

click it

expect the failure to log in message to appear.

Straight forward enough. Now when the test is run you are able to observe as chrome and cypress walk through the flow you’ve provided. The final outcome looks like this:

![](https://cdn-images-1.medium.com/max/2156/1*DoEULqX0JKUFKyr-iDl7SA.png)

Each assertion is highlighted, network requests displayed, each step is selectable and allows the user to interact with the DOM at that point in history. This is only a small example of the power of Cypress.io. Writing tests for our Accounts UI took a matter of hours, and that covers almost everything a user can do in the application. From spinning up an instance all the way through to managing teams of users and giving them access to an instance. Since the tests are so straightforward to write, changing them in response to changes in our user flows are just as simple. Could this have been done with Nightwatch, or Selenium? Probably. But I think the testing should complement the process of development, and not become another development project in and of itself.

Cypress does a great job of getting out of the way and letting me work. It also has integrations into CircleCI and has docker container available to use your browser of choice for the remote tests. If you’re in need of testing for your front end project, give Cypress a shot. It’s quick to start up, easy to implement, and it’s power is deep.
