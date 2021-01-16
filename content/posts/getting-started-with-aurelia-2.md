---
author: PhilipTKC
title: Getting Started with Aurelia 2
date: 2021-01-16T00:00:00.000Z
summary: Before we get started, Make sure you have NodeJS installed. If you do not see the following page to install it.
category: Aurelia2
published: true
---

Before we get started, Make sure you have NodeJS installed. If you do not see the following page to install it. [NodeJS Installation](https://codey.netlify.app/node-js/start){target="_blank"}.

Aurelia 2 requires at least version 14.5.0, You can check what version of NodeJS you have by using the following command in terminal.
    
`node -v` or `nodejs -v`

To check what NPM version you are using run
    
`npm -v`

Once NodeJS is installed, We can finally create our Aurelia2 app. In your terminal run the following.

    npx makes aurelia getting-started -s typescript

OR

Run the following command in terminal and pick the following options.

    npx makes aurelia

1.  **Please name this new project** - -started
2.  **Would you like to use the default setup or customize your choices?** - Custom Aurelia 2 App
3.  **Which bundler would you like to use?** - Webpack
4. **What transpiler would you like to use?** - TypeScript
5. **Do you want to use Shadow DOM or CSS Module?** - No
6. **What CSS preprocessor to use?** - Plain CSS
7.  **What unit testing framework to use?** - None
8. **Do you want to setup e2e test?** - No
9. **What kind of sample code do you want in this project?** - Bare Minimum
10. **Do you want to install npm dependencies now?** - Yes, Use npm

Once the NPM dependencies are installed. Open the project in your favourite IDE. (Visual Studio Code <3).

Or change directory using the following.

    cd getting-started
    npm start

See the following for the project structure of your application.

- [Aurelia2 Project Structure](https://codey.netlify.app/aurelia-2/start){target="_blank"}

## Next Up

Creating a [Todo List App](2021-01-16/aurelia-2-todo-list)