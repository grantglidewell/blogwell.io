---
title: 'Making A Slack Build Bot For A JAM Stack Site'
description: 'I wanted to deploy my JAM stack site from slack, and let others in my organization do the same. Here is how I did it.'
date: '2020-02-16'
author: 'Grant Glidewell'
image: ''
---

![Wall-e photo by Lenin Estrada](https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2551&q=80)

There are times where we need to give _others_ control over when our site builds and re-deploys. I dont like relinquishing control, but thats exactly what has to happen from time to time.

Overall the goal here is to build an command in slack for non-technical or lazy technical people to rebuild and deploy a JAM stack site. We want this to be safe (ie. the user is someone who has permission to rebuild the site) and simple. Essentially a user should be able to type `/deploy-site` and there should be an immediate rebuild and deploy of the site if that user has permission. If that user doesn't have permission they should see a message telling them how to get access to the command.

#### Tech leveraged:

- Netlify CI/CD
- Zeit serverless functions
- Slack slash commands

These are choices that I made, however, this can be accomplished a number of different ways using many different services.

#### Netlify Setup

If you haven't used Netlify for CI/CD before you're in for a treat. Connect your repo to their service and instantly they will start up a build and publish the results to a URL that is live. The only thing that immediately needs to be set up is a [build hook](https://docs.netlify.com/configure-builds/build-hooks/). This will allow you to ping a URL and start a build.

#### Zeit Setup

What we need to ensure, is that not _every_ user in your org is able to execute this command. So lets put something in the way. This function will validate wether or not a user can start a build. If they arent authorized it will offer them the option to contact you and give you their slack ID so you can add them to the list. If you need more information on building and deploying functions to Zeit's Now their [docs](https://zeit.co/docs/v2/serverless-functions/introduction) are pretty useful.

```js
const fetch = require('node-fetch')

const WEBHOOK_URL = 'WEBHOOK_FROM_NETLIFY'

const authUsers = ['USER_ID_FROM_SLACK']

module.exports = async (req, res) => {
  const { body } = req
  if (authUsers.includes(body.user_id)) {
    const webhookRequest = await fetch(WEBHOOK_URL, { method: 'POST' })

    if (webhookRequest.statusText === 'OK') {
      res.json(
        'Successfully sent the build command, changes should be reflected on the live site in about 45 min.'
      )
    } else {
      res.json(
        `There was a problem sending the build command. error: ${webhookRequest}`
      )
    }
  } else {
    res.json(
      `You aren't authorized to send the build command, contact the administrator of this command, give them this id: ${body.user_id}`
    )
  }
}
```

#### Slack Setup

Creating a Slack App has become a point and click adventure. Lucky for me this is something ive been into since the release of Myst. As soon as you go to [create an app](https://api.slack.com/apps) you'll have a couple options. Select `Slash Commands` and you'll just fill in the information, and use the url to your Zeit serverless function.

This is a basic implementation that could probably use some polishing. I know each of these platforms are powerful of their own accord but I think this leans on the strengths of each. I would love to add another function to update who can run the build command, but never got around to working that out (data persistence is not something serverless functions are known for). Since thats the case each time you want to add an ID you have to push that new function to now. Its not so bad since you literally update your local file and run the `now` command, but it could surely be refined.
