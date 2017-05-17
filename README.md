# [WIP] AO3.js

Unofficial client library for Archive of Our Own.

# Usage

Exports a class with a bunch of static methods

## Authentication

*Note: you have access to most `GET` requests even if you don't have an ao3 account.*

Basic `GET` requests do not require authentication but certain actions (such as viewing works with adult content) require creating a session. The client takes care of this for you. Making `POST` requests, however, requires an account and authentication.

```
import Client from 'ao3';

Client.setCredentials({
  user: 'nerdbrogirl',
  password: 'everythingmustbegay'
});

// alternatively

Client.login({
  user: 'tumblrina',
  password: 'femslashfemslashfemslash'
}).then(/...); // returns request data

```

Requests that require authentication internally call `login()` with the values you set in `setCredentials()` on an as needed basis. Directly calling `login()` will create a session on archiveofourown.org and automatically configure your request headers so all future requests are authenticated. It also returns a promise with the request data in case you want to use that info for anything. Either way works.

## Methods

### worksFilter()

Takes two arguments, the tag you are searching for and query parameters. Returns a filtered list of works.

Example:
```
try {
  const { data } = await Library.worksFilter('Overwatch (Video Game)', {
    query: 'lol',
    page: 2
  });
  console.log(data);
} catch (err) {
  console.error(err);
}

```

### work()

Takes a work ```id``` as a parameter.

Example
```
try {
  const { data } = await Client.work('9249503');
  console.log(data);
} catch (err) {
  console.error(err);
}

```

More to come...
