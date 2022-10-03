---
author: PhilipTKC
title: Setting up MongoDB, Mongoose, GraphQL on NodeJS Part 2
date: 2022-10-3T00:00:00.000Z
summary: In this blog post we'll be configuring the server files.
category: NodeJS
published: true
---

### Recap 
In our previous blog post [Setting up MongoDB, Mongoose, GraphQL on NodeJS Part 1](/2021-01-16/setting-up-mongodb-mongoose-graphql-on-nodejs-part-1) we went over the following.

- Creating a MongoDB database on Atlas
- Setting up our NodeJS server project

If you haven't already, Read through part 1.

In this blog post we'll cover how to configure and start our server.

### Creating the entry point

Run the following

```shell
touch src/index.ts
```

And now add the following.

`console.log('Hello world!')`

To run the server run the following command

`npm run start:dev`

The console should output the following. `Hello world!`. Make any changes and nodemon will watch for any changes inside the `src` folder with the following extensions `.ts` or `.js`

Now that we can run our server, Let's proceed to the next step.

### Server Configuration

Add the following imports

```ts
import cors from "cors";
import env from "dotenv";
import express from "express";
import http from "http";
```

For further reading see the following.

- [Cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.

- [Dotenv](https://github.com/motdotla/dotenv)

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

- [Express](https://expressjs.com/)

Express.js, is a back end web application framework for building RESTful APIs with Node.js

- [Http](https://nodejs.org/api/http.html)

The HTTP interfaces in Node.js are designed to support many features of the protocol 

### Environment Variables Configuration

Add the following line to load our environment variables.

`env.config();`

At the moment our .env is empty. Let's add something!

Previously we had created our Database in Atlas, Under the `Deployment` tab click on `Database` and click on `Connect`.

Select the `Connect your application` option and copy your connecting string to `.env`.

Your `.env` should now look like the following.

```
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster_url>?retryWrites=true&w=majority
```

`MONGODB_URL` can be accessed with `process.env.MONGODB_URL`

### Express

To create our Express Application add the following.

```ts
const app = express();
// Register the following middleware.
app.use(cors());
app.use(express.json());
```

You'll notice that we don't have any middleware to determine who can access our data. This process is up to you on how you want to implement this. In this example we'll be using Firebase.

### Database Connection

Run the following

```shell
touch database-connection.ts
```

And add the following.

```ts
import mongoose from "mongoose";

export async function databaseConnection() {
  const databaseURL = process.env.MONGODB_URL;

  try {
    if (databaseURL) {
      await mongoose.connect(databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
    } else {
      throw "No database connection string found";
    }
  } catch (error) {
    console.error(error);
  }
}
```

Import the following inside `index.ts`

```ts
import { databaseConnection } from "./database-connection";
```

And add the following line at the end of the file.

`databaseConnection();`

Run the following command to start the server

`npm run start:dev`

While nothing will happen, If everything is going well there should be no errors.

### Next

We'll be going over setting up Apollo Server which will allow us to query our data.

[setting-up-mongodb-mongoose-graphql-on-nodejs-part-3](/2022-10-3/setting-up-mongodb-mongoose-graphql-on-nodejs-part-3)