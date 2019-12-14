---
title: 'Making a URL shortener'

description: 'Netlify, a domain, and some help from Kent C Dodds'

date: '2019-12-14'

author: 'Grant Glidewell'

image: ''
---

![cinquecento in the city by Adam Griffith](https://images.unsplash.com/photo-1494009041405-cb00eb38b186?ixlib=rb-1.2.1&auto=format&fit=crop&w=2125&q=80)

#### Initial Project Setup

This was inspired by [this post](https://twitter.com/kentcdodds/status/1205610365289025536) from Kent C Dodds.

Create a github repo, the only file it needs is a `_redirects` file containing something along these lines:

```
/youtube   https://www.youtube.com/channel/UCTUuyVBYiopWoTEJu6ptDbg
/github    https://github.com/grantglidewell/
/twitter   https://twitter.com/GrantGlidewell
/blog      https://blogwell.io

/*         https://grantglidewell.com

```

#### Set Up Netlify

Make an account and connect that repository. No need to select build options, just deploy that thing!
The default behavior of Netlify is to re-deploy your repo every time the master branch is updated, this is exactly the behavior we want. If you have a custom domain (preferably a short one) follow the documentation in netlify to make that connection.

#### Automate

This is where things diverge a bit. Kent created [a package](https://www.npmjs.com/package/netlify-shortener) that allows you to use an npm script to add a redirect to the URL shortener. Install it, and add this script to your `package.json`

```json
"scripts": {
    "shorten": "netlify-shortener"
  }
```

Now if you run `yarn shorten http://whatever.com whatever` the package will write a new line to your redirects, and then push that change to your github repo. This is great and getting more useful.

Add your url

But I want to run this from anywhere! Kent has a solution for that, he make an alias in his bash profile. It looks like this:

```bash
alias shorten="pushd ~/code/shortner-repo/ && npm run shorten \"{$1}\" \"{$2}\" && popd"
```

However, Us ZSH users trying to implement that same functionality needed to do something a bit different:

```bash
alias shorten() {
  pushd ~/code/shortner-repo/
  yarn shorten $1 $2
  popd
}
```

now anywhere on the command line you can run `shorten url name`!
