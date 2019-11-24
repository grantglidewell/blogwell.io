---
title: 'How the Internet works'

description: 'The server client model for curious new developers'

date: '2019-10-29'

author: 'Grant Glidewell'

image: ''
---

![Cords plugged into a network switch by Jordan Harrison](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80)

#### The Client

You, currently, reading this are using a client. Your browser as a client, makes what are called requests when you try to access a website. Specifically requests using the [HTTP protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview). As these requests leave your device (iPhone, TV, Oven etc...) they find there way using some in between bits we'll get into later. When these reach their destination it is up to the server to respond. The request/response model is one that is incredibly important to understand as it underpins most traffic on the internet. Essentially a client sends a request, and waits for the server to respond. Requests can use a few [methods](https://www.w3schools.com/tags/ref_httpmethods.asp), GET being the one that was used by your browser to get this web page. If you click the link to `methods` your browser will fire another GET request to w3schools explanation of more HTTP methods.

Some of these methods allow for more than just a 'give me what I'm asking for' statement and can pass meaningful data in the form of a `body`. POST is one of those methods that as a developer you will find indispensable. This method allows you to include whatever extra data you need the server to know about in order to make a change, or get the right information back. An example of a POST request is any form you fill out on a web page, this is making a POST request and the server receiving that POST `body` will have to know what to do with it. Like login information, emails, messages on social media, all of this is sent in the form of POST requests with a `body` containing the pertinent details, to a server.

#### The Server

This document was served to you by, you guessed it, a server. A server isn't necessarily a box in a cold room that handles client requests all day. A server is often just a program, running on a computer, than handles requests when they come in. Since this site is built with Gatsby, the files are 'static rendered'. Which means they become just html files. A web server by default will serve the `index.html` file for the given path. This convention goes a long way back in the history of the internet where you were sometimes expected to navigate file systems via a web browser. If you're on a mac, take a look at what happens when you put `file:///` in your browser address bar and PC users can put `file:///C:/`.

#### In Between Bits

This relationship is rarely happening in a way that involves just those two points. This communication usually involves what is called a DNS server. This is how a human readable name like `www.blogwell.io` resolves to an Internet Protocol address (usually a series of numbers like `192.168.1.1`) that allows the request to find its way to what you want to see. Dynamic Name Servers are part of your network configuration in your computer, they're usually associated with your internet service provider. You can change them if you want, both [google](https://developers.google.com/speed/public-dns) and [cloudflare](https://blog.cloudflare.com/announcing-1111/) offer alternatives to your ISP based DNS servers. Some say changing your DNS can increase speed of lookup, or offer some privacy benefits. While that is possible, they are just another part of the Client/Server relationship.

#### How To See It Working

If you are comfortable enough to open up a command line terminal, we can quickly make an example of how this behaves, both server and client. If you have [Node](https://nodejs.org/) installed, this should be as simple as copying a couple commands. Change directory into a temporary directory, you can just create one called `temp` if you want.

```bash
$ echo "<\!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body><h1>Served Locally</h1></body>
</html>
" >> index.html

$ npx http-server .

```

What this echo command will do is create an `index.html` file in the directory you're in with the contents in the quotes. The second command will use the npm package registry to pull in the `http-server` package, and run it in that directory (npx wont install that package in your current directory, it just runs it). You should see something like this:

```
Starting up http-server, serving .
Available on:
  http://127.0.0.1:8080
  http://192.168.1.58:8080
Hit CTRL-C to stop the server
```

If you go to that first address in your web browser, what you see is the contents of the html file you just created. What you are observing is a server running, and your browser acting as a client. You may be wondering why the address is an IP and not a human readable one. This server is meant for developing websites locally (all on one computer). So when that request is made, your computer doesn't reach out to a DNS, its the home IP address. You can also try a human readable address while that server is running. Go to `localhost:8080` and you should see the same thing. The other address there is a local IP address for other computers on your network to see what is served.

This illustrates how a server is less a big box somewhere, and more just a program that takes requests. You can run a server on any computer. The same goes for clients, though they are usually not thought of the same way servers are. The internet overall is a collection, a massive ...web if you will excuse how on the nose that analogy is, of servers and clients. Sending requests and responses to one another to get information where is needs to go.
