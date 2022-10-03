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

First and foremost you'll need to create a [mongoDB account](https://www.mongodb.com/). Best of all it's free to use, head over there and create your account and complete the onboarding process.

### Projects

To create a project. Click on the `Projects` tab and click on `New Project`

### Creating your Database

Click on your newly created project and create a new database. For this example simply create a `Shared` cluster.

### Creating user to access data

Under the `Security` tab click on `Quickstart`. You'll have two options. Username and Password or Certificate. For this example we'll use the Username and Password option. Create a database user and complete the neccessary steps to complete the proccess.

### Creating our Backend with NodeJS (Prerequisites)

#### Create Folder

```shell
mkdir backend-server
cd backend-server
mkdir src
```

#### Create package.json

Run the following command `npm init -y`

#### Typescript

We'll be using Typescript so we'll need to install the following packages.

`npm install typescript @types/node --save-dev`

#### Create tsconfig.json

Run the following

```shell
npx tsc --init --rootDir src --outDir dist --esModuleInterop \
--resolveJsonModule --lib es6 --module commonjs \
--allowJs true --noImplicitAny true
```

#### Install Dependencies

We'll be using the following packages.

- apollo-server-core
- apollo-server-express
- cors
- dotenv
- express
- mongoose

Run the following

```shell
npm install apollo-server-core apollo-server-express cors dotenv express mongoose
```

```shell
npm install @types/cors @types/express @types/nodemon --save-dev
```

### Folder Structure & Files

Your folder structure should now have the following.

- node_modules
- ./src
- package-lock.json
- package.json
- tsconfig.json

We'll also need to create an additional files to store our environment variables and configure nodemon

```shell
touch .env nodemon.json
```

Edit nodemon.json and add the following.

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "ts-node ./src/index.ts"
}
```

Inside the package.json file add the following script.

`"start:dev": "nodemon"`

### Next…
In the next blog post we'll configure the server.

