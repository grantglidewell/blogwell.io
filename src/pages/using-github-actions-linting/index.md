---
title: 'Staged linter enforcement with GitHub Actions'
description: 'Code consistency is important, but so is flow, accomplish consistency without ruining workflow'
date: '2019-12-15'
author: 'Grant Glidewell'
image: ''
---

![Sentinel enforcing code consistency](https://i.pinimg.com/originals/00/2a/d1/002ad15b7bc85380f619d026fa125ef6.jpg)

#### Why linting matters

If you've ever worked on a project with multiple developers, you probably already know this. Working with others is an important skill, however, sometimes bikeshedding gets in the way of getting work done. Using some automation like prettier and eslint will enable your team to get work done and spend less time discussing single vs double quotes, or wether or not destructuring props should be standard practice (single quotes and yes, btw).

#### Why split it up

Coding momentum is hard to maintain. I am in that habit of making what I call 'micro commits', as I work I like to commit and push my changes in small increments so I have a clear record of each step I took and am rarely at risk of losing lots of work. Sometimes, if linting standards are _too strict_, I get distracted solving lint nit picks that have nothing to do with what I actually working on.

At work recently we had a discussion on exactly this issue in setting up an internal project. While linting issues aren't pertinent to my code solution to whatever task Im working on, they should be addressed at some point. The recent addition of github actions seemed like a nice middle ground against setting up some external CI to solve for this.

#### How

There are a couple ways to set up GitHub actions, what we are going to set up is a Workflow, so not actually an action. A workflow calls one or many actions in... you guessed it, a workflow. Essentially all we need to do is make sure our project's dependencies are installed, and then we need yarn to run the linting script that enforces out standards at a more strict level. Adding this to your repo under `.github/workflows/nodejs.yml` will allow you to connect the action as a requirement for PR's into the `master` branch.

```
name: Lint
on: [push]
jobs:
  build:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: borales/actions-yarn@v2.0.0
        with:
          cmd: install # will run `yarn install` command
      - uses: borales/actions-yarn@v2.0.0
        with:
          cmd: eslint:github-action
```

Now we have a workflow that will call our script, but no script! So lets make one. In this script we are essentially turning all warning level violations into failure scenarios. This way you can use a single configuration for eslint and know that warnings will only be enforced at the PR level.

```
"eslint:github-action": "node ./node_modules/eslint/bin/eslint . --ignore-path .gitignore --max-warnings 0"
```

This creates what I think is a very flexible and powerful workflow for teams. The annoyance of having to solve all of your linting errors before a push is resolved, and your master branch is safe from glaring inconsistencies. Linting in stages like this maintains tight standards without forcing what may be an uncomfortable workflow on the whole team.
