---
author: PhilipTKC
title: Setting up MongoDB, Mongoose, GraphQL on NodeJS Part 3
date: 2022-10-3T00:00:00.001Z
summary: In this blog post we'll be configuring Apollo Server and querying and mutating our data.
category: NodeJS
published: true
---

### Recap 
In our previous blog post [Setting up MongoDB, Mongoose, GraphQL on NodeJS Part 2](/2022-10-3/setting-up-mongodb-mongoose-graphql-on-nodejs-part-2) we went over the following.

- Creating the entry point
- Configuring .env
- Setting up our database connection.

If you haven't already, Read through part 2.

In this blog post we'll cover how to configure Apollo Server.

### Database Collections

Head over to your MongoDB cluster that you created earlier and click on 'Browse Collections'.

Create your database by clicking on 'Create Database'. A modal should pop up asking you to enter a database name & collection name.

Let's call our database `demonstration` and a collection name of `users`. We can add more collections later.

Click on the user collection and click on 'Insert Document'. For simplicity sake we'll only use two fields.

- username
- email

You can add any value to these fields and then click `Insert`

* Remember to update the `<database-name>` portion of `MONGODB_URL` in `.env`

### App Services - GraphQL

Typically you should already have your GraphQL schema planned out. But we'll be using a service to automatically generate our schema based on sample data already in our database.

Click on `App Services` next to the `Atlas` tab and then `Create App`.

You can name this application anything you wish. 

The option to link your database should already be selected. Next click on `Create App Service`.

Once your application has been created under the `Data Access` category click on `Schema`.

You should now see a list of your databases and collections.

Click on `users` and then `Generate Schema` then `Generate schema from sampling`.

Your user Schema should now look like the following.

```json
{
  "title": "user",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "email": {
      "bsonType": "string"
    },
    "username": {
      "bsonType": "string"
    }
  }
}
```

### Downloading copy of GraphQL Schema

Under the `Build` category click on `GraphQL` and then click on the `Schema` tab next to `Explore`.

You should see an option to download the schema. Create the following folders with the following command

```shell
mkdir src/graphql src/graphql/mutations src/graphql/queries src/graphql/resolvers
```

And move `schema.graphql` to `src/graphql`

### Setting up GraphQL

Create a schema.ts file with the following command.

```shell
touch src/graphql/schema.ts
```

And add the following to `schema.ts`

```ts
import { gql } from "apollo-server-express";

const typeDefs = gql`` // Copy paste content of schema.graphql inbetween the back ticks

const resolvers = {};

export { typeDefs, resolvers };
```

At the moment resolvers is empty, However we'll add queries and mutations later on.

### Apollo Server Configuration

Create a new file with the following command

```shell
touch src/apollo-server.ts
```

And add the following.

```ts
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { Express } from "express";

import { typeDefs, resolvers } from "./graphql/schema";

export async function apolloServerExpress (httpServer: Server, app: Express) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [ ApolloServerPluginDrainHttpServer({ httpServer }), process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(), ],
  });

  await server.start();
  server.applyMiddleware({ app, cors: { origin: "*" } });

  await new Promise(resolve => resolve(httpServer.listen({ port: process.env.PORT })));
  console.log(`🚀 Server ready 🚀 on ${process.env.PORT}`);
}
```

Note that process.env.`NODE_ENV` has not been setup inside `.env`.

Update `index.ts` to the following

```ts
import cors from "cors";
import env from "dotenv";
import express from "express";
import http from "http";


import { databaseConnection } from "./database-connection";
import { apolloServerExpress } from "./apollo-server";

env.config();

const app = express();

app.use(cors());
app.use(express.json());

databaseConnection();

const httpServer = http.createServer(app);
apolloServerExpress(httpServer, app);
```

Start the server

```shell
npm run start:dev
```

And you should get the following output.

```shell
🚀 Server ready 🚀
```

### Mongoose Models

At this point everything seems to be working. However we've not completely set up yet, although we're close!

Create the following file 

```shell
touch src/graphql/user-model.ts
``` 

And add the following.

```ts
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: false },
    username: { type: String, required: false },
    email: { type: String, required: false },
  },
  { collection: "users" }
);

const UserModel = mongoose.model("users", userSchema);

export { UserModel };
```

### Query

Create the following file

```
touch src/graphql/queries/user.ts
```

And add the following

```ts
import { UserModel } from "../user-model";

interface Args {
  query: {
    _id: string;
  };
}

// Note that `user` matches the name inside our typeDefs - Type Queries {}
export async function user(parent: never, { query }: Args) {
  const { _id } = query;

  return await UserModel.findOne({ _id });
}
```

Note that this is a single query for querying a single user by _id. You can experiment by creating different queries, for example returning all users.

```ts
import { UserModel } from "../user-model";

// Note that `users` matches the name inside our typeDefs - Type Queries {}
export async function users(parent: never) {
  return UserModel.find({});
}
```

### Resolvers

Create a new file inside the resolvers folder

```shell
touch src/graphql/resolvers/queries.ts
```

And update the file with the following.

```ts
import { user } from "../queries/user";
import { users } from "../queries/users";

export default {
  user,
  users
}
```

Next open `schema.ts`

And import the following.


```ts
import queries from "./resolvers/queries";
```

and update `resolvers` with the following.

```ts
const resolvers = {
  Query: queries
};
```

### Querying your data

Now that we've set up a single query, Let's use GraphQL to query your users!

Run the server with

```shell
npm run start:dev
```

And open your browser and enter the following

`http://localhost:4000/graphql`

Note that this playground is not enabled on Production.

Enter the following Query

```graphql
query Query($userQuery: UserQueryInput) {
  user(query: $userQuery) {
    _id
    email
    username
  }
}
```

Then click on Query Variables and enter the following

```json
{
  "userQuery": {
    "_id":  "" // Enter the ID of your user
  }
}
```

or Retrieve all users

```graphql
query {
  user {
    _id
    email
    username
  }
}
```

What you should see is the object user that was returned from your database!

User Response

```json
{
  "data": {
    "user": {
      "_id": "",
      "email": "",
      "username": ""
    }
  }
}
```

Users Response

```json
{
  "data": {
    "users": [
      {
        "_id": "",
        "email": "",
        "username": ""
      }
    ]
  }
}
```

### Mutations

Create the following file.

```shell
touch src/graphql/mutations/update-one-user.ts
```

And add the following.

```ts
import { UserModel } from "../user-model";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    _id: string;
  },
  set: {
    username: string;
  },
}

// Note that `updateOneUser` matches the name inside our typeDefs - Type Mutations {}
export async function updateOneUser(parents: never, { query, set }: QuerySet) {
  const { _id } = query;
  const { username } = set;

  return UserModel.findOneAndUpdate({ _id },
    { 
      $set: { username },
    },
    { new: true });
}
```

By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.

This mutation will find the user and update the username.

Create a new file within resolvers.

```shell
touch src/graphql/resolvers/mutations.ts
```

And add the following

```ts
import { updateOneUser } from "../mutations/update-one-user";

export default {
  updateOneUser
}
```

Now we have our first mutation, We'll need to update our resolver object in `schema.ts`. It should now look like the following.

```ts
const resolvers = {
  Query: queries,
  Mutation: mutations
};
```

### Mutating User

Let's run our mutation, Enter the following.

```graphql
mutation UpdateOneUserMutation($updateOneUserSet: UserUpdateInput!, $updateOneUserQuery: UserQueryInput) {
  updateOneUser(set: $updateOneUserSet, query: $updateOneUserQuery) {
    _id
    email
    name
  }
}
```

Then click on Query Variables and enter the following

```json
{
  "updateOneUserQuery":{
    "_id":  "" // ID of user
  },
  "updateOneUserSet": {
    "username": "SomeOtherUserName"
  }
}
```

## Summary

So far we've achieved the following.

- To Be Summarized

