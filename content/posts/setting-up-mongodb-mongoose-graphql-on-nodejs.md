---
author: PhilipTKC
title: Setting up MongoDB, Mongoose, GraphQL on NodeJS
date: 2021-01-16T00:00:00.001Z
summary: In this blog post we'll be going over on how to use MongoDB, Mongoose and GraphQL on NodeJS.
category: NodeJS
published: true
---

In this blog post we'll be going over on how to use MongoDB, Mongoose and GraphQL on NodeJS.

### The database for modern applications

    MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.

First and foremost you'll need to create a [mongoDB account](https://www.mongodb.com/). Best of all it's free to use, head over there and create your account.

### Creating your Database

...

### Create your first Admin User

...

### Creating our Backend with NodeJS (Prerequisites)

Package.json

```json
{
  "dependencies": {
    "apollo-server-express": "^2.19.2",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "graphql": "^15.4.0",
    "mongoose": "^5.11.13"
  },
  "devDependencies": {
    "@types/express": "^4.17.11",
    "@types/node": "^14.14.22",
    "ts-node": "^9.1.1",
    "typescript": "^4.1.3"
  },
  "scripts": {
    "start": "npx nodemon src/index.ts"
  }
}
```

tsconfig.json

```json
{
    "compilerOptions": {
        "esModuleInterop": true,
        "module": "commonjs",
        "moduleResolution": "Node",
        "outDir": "./dist",
        "resolveJsonModule": true,
        "rootDir": ".",
        "strict": true,
        "target": "es6"
    }
}
```

Install Dependencies

```
npm install
```

### Connecting to your Database

index.ts

```ts
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from "./schema"; // We'll be creating this in the next section
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const databaseURL = `mongodb+srv://<Username>:<Password>@<DbUrl>/<Database>?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
    typeDefs, resolvers
})

server.applyMiddleware({ app });

app.listen(5000).on("listening", () => {
    mongoose.connect(databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => {
        console.log('Connected')
    }).catch((err) => {
        console.error(err);
    });
})

```

#### GraphQL Schemas

### User Schema Example

```ts
import mongoose from 'mongoose'
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    { collection: 'users' }
);

const User = mongoose.model('Users', userSchema)

export { User };
```

Note that the `_id` field will be automatically generated for us.

```ts
import { User } from "./user-schema";

const typeDefs = gql`
   type User {
     _id: ID!
     name: String!
     email: String!
   }
   
   type Query {
       getUsers(): [User]
       getUser(_id: ID!): User
    }

    type Mutation {
        addUser(name: String!, email: String!): User
    }

    const resolvers = {
    Query: {
        getUsers: (parent: any, args: any) => {
            // Without filters, Find and return everything.
            return User.find({});
        }
        getUser: (parent: any, args: any) => {
            // or use User.findById({ _id: args.id })
            return User.find({ email: args.email })
        }
    },
    Mutation: {
        addUser: (parent: any, args: any) => {
            // args = { name, email }
            return User.create(args)
        }
    }
`

export { typeDefs, resolvers };
```

#### Starting the Server

Run in terminal

```
npm start
```

If successfully configured, You should see the message "Connected".

Navigate to `http://localhost:5000/graphql` and you should be greeted with GraphQL Playground.

### Next...

In the next blog post we'll discover how to use Apollo Client to send queries and mutations.
