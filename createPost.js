const fs = require('fs')
const { resolve } = require('path')

const articleName = process.argv
  .map((arg, i) => (i > 1 ? arg : null))
  .filter(a => a)
  .join('-')

if (!articleName) {
  console.error(
    '\x1b[31m',
    'You must provide an article name in the following format:'
  )
  console.error('\x1b[36m', '$> yarn new this is the article name', '\x1b[0m')
  return
}

if (!fs.existsSync(resolve(`src/pages/${articleName}`))) {
  fs.mkdirSync(resolve(`src/pages/${articleName}`))
} else {
  console.error(
    '\x1b[31m',
    `Looks like you already have an article with the name ${articleName}`,
    '\x1b[0m'
  )
  return
}
const date = new Date()
fs.writeFileSync(
  resolve(`src/pages/${articleName}/index.md`),
  `---
title: '${articleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')}'
description: ''
date: '${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}'
author: 'Grant Glidewell'
image: ''
---

Write something dope about ${articleName}

`
)
