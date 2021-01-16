---
author: PhilipTKC
title: Aurelia 2 Todo List App
date: 2021-01-16T00:00:00.001Z
summary: Aurelia 2 Todo List App. Now that you've created your Aurelia 2 app and it's up and running. Navigate to `localhost:9000`. You'll be greeted by `Hello World!`
category: Aurelia2
published: true
---

Now that you've created your Aurelia2 app and it's up and running. Navigate to `localhost:9000`. You'll be greeted by `Hello World!`.

my-app.ts
```ts
export class MyApp {
  public message = 'Hello World!';
}
```

my-app.html
```html
<div class="message">${message}</div>
```

## Updating our Project Structure

Next lets update the project structure to look like the following.

- Create `css` folder
  - tailwind.css - Leave empty for now.
- Create `resources` folder
  - Create registry.ts - We'll use this to register all our components so they can be used globally. Leave empty for now.
- Create `components` folder
  - We'll add all our custom components to this folder.
- Create `pages` folder
  - Create dashboard.html & dashboard.ts
  - Create edit.html & edit.ts
- Create `services` folder.
  - Create data.json - Leave empty for now
  - Create todo-serivce.ts - Leave empty for now

Our project structure so far...

    └─ src
        ├── css
            └─ tailwind.css
        ├── resources
            ├─ components
            └─ registry.ts
        ├── pages
            ├─ dashboard.html
            ├─ dashboard.ts
            ├─ edit.html
            └─ edit.ts
        ├── services
            ├─ data.json
            └─ todo-service.ts
        ├─  main.ts
        ├─  my-app.css
        ├─  my-app.html
        ├─  my-app.ts
        └─  resource.d.ts

## Pages
        
### View Model

pages/dashboard.ts

```ts
import { IRouteableComponent } from "@aurelia/router";

export class Dashboard implements IRouteableComponent {}
```

pages/edit.ts

```ts
import { IRouteableComponent } from "@aurelia/router";

export class Edit implements IRouteableComponent {}
```

### View

Create dashboard.html and edit.html - These can be left empty for now.

Delete everything in `my-app.html` and replace with

```html
  <import from="pages/dashboard"></import>
  <import from="pages/edit"></import>

  <au-viewport name="main" default="dashboard"></au-viewport>
```

### Main.ts

Register `RouteConfiguration` and customize with the following, This will remove `#` from the URL. `localhost:9000/#/dashboard`

We'll register our custom components here from `registry.ts`, Comment out as registry.ts is empty and does not contain any exports yet.

```ts
import Aurelia, { RouterConfiguration } from 'aurelia';
import { MyApp } from './my-app';
// import * as components from "resources/registry";

Aurelia
  .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  // .register(components)
  .app(MyApp)
  .start();
```

## Configuring App Routes

For the purpose of demonstrating how we can route to another page, we'll add a `edit` page that can be routed to that takes an `id` parameter.

```ts
export class MyApp {
    static routes = [{
    path: "dashboard", instructions: [{ component: "dashboard" }]
  },
  {
    path: "edit/:id", instructions: [{ component: "edit" }]
  }]
}
```

In `index.ejs` in the root folder add the following inbetween the `<head></head>` tags

  <base href="/">

## Creating the Todo List

Inside `services/data.json` add the following or create your own.

```json
[
    {
        "content": "My first Todo",
        "date": "2021/01/01",
        "done": true,
        "id": 0,
        "title": "Hello World!"
    },
    {
        "content": "My second Todo",
        "date": "2021/01/01",
        "done": false,
        "id": 1,
        "title": "Finishing task is great fun!"
    },
    {
        "content": "My third Todo",
        "date": "2021/01/01",
        "done": false,
        "id": 2,
        "title": "Let's get this done!"
    }
]
```

Now that we have our mock data update `todo-service.ts` with

```ts
import data from "./data.json";

type NumberOrString = number | string;

export interface ITodoItem {
    content: string;
    date: NumberOrString;
    done: boolean;
    id: NumberOrString;
    title: string;
}

export class TodoService {
    retrieveTodos(): ITodoItem[] {
        return data;
    }

    retrieveTodo(id: string): ITodoItem {
        return data.find(x => x.id == id);
    }
}
```

In our `dashboard.ts` page inject `TodoService`

```ts
import { IRouteableComponent } from "@aurelia/router";

import { ITodoItem, TodoService } from "../services/todo-service";

export class Dashboard implements IRouteableComponent {
    private todos: ITodoItem[] = [];

    constructor(private readonly todoService: TodoService) { }

    load(): void {
        this.todos = this.todoService.retrieveTodos();
    }
}
```

To iterate through what is in our todo list, we can use the `repeat.for` attribute. Edit `dashboard.html` with the following.

```html
  <div>
    <div repeat.for="todo of todos">
      ${todo.title}
    </div>
  </div>
```

You should now see the titles of our todos - You can play around by adding more items to `data.json`.

## Adding Some Style (Optional)

Run the following in terminal to add TailWind.css to our project.

    npm install tailwindcss@latest postcss@latest autoprefixer@latest

In your CSS folder edit the tailwind.css file and add the following.

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

Run the following to create the tailwind configuration file.

    npx tailwindcss-cli@latest init

Run the following to build Tailwind

    npx tailwindcss-cli@latest build ./src/css/tailwind.css -o ./src/css/style.css
  
Add `style.css` to `my-app.ts`

```ts
import "./css/style.css";

export class MyApp { }
```

Update `my-app.html`

```html
<div class="container p-12 mx-auto">
    <au-viewport name="main" default="dashboard"></au-viewport>
</div>
```

If you are using VSCode, Install the [Tailwind Intellisense](https://tailwindcss.com/docs/intellisense){target=_blank}

See [TailWindCSS](https://tailwindcss.com/docs) on what TailwindCSS is and how it works.

## Creating Custom Components.

Now that you've seen how we can iterate through our todo list, We'll create our first component.

In your components folder create `resources/components/item.html` and it's View Model counterpart `resources/components/item.ts`.

Open `resources/components/item.ts` and add the following.

```ts
import { ICustomElementViewModel } from "aurelia";

export class Item implements ICustomElementViewModel { }
```

### Registering Item Component

Update `resources/registry.ts` with the following export.

```ts
export * from "./components/item";
```

And uncomment `.register(components)` from `main.ts`

### Using Item Component

Update `pages/dashboard.html` with the following.

```html
<div>
    <div repeat.for="todo of todos">
        <item></item>
    </div>
</div>
```

You should see nothing, however if you `resources/components/item.html` - You will see it repeated.

### Data binding our todo list items.

Let's pass some data to our item component to do so, we'll need to update `item.ts` with the following.

```ts
import { bindable, ICustomElementViewModel } from "aurelia";

export class Item implements ICustomElementViewModel {
    @bindable item;

    attached(): void {
      console.log(this.item);
    }
}
```

Update `pages/dashboard.html` with the following

```html
<div>
    <div repeat.for="todo of todos">
        <item item.bind="todo"></item>
    </div>
</div>
```

Check your developer console and you should see the contents of `todo`.

### Updating Item View

Update `resources/components/item.html` with the following.

```html
<div class="flex p-4 cursor-pointer select-none">
    <div click.delegate="editItem(item.id)">
        <div class="flex items-center">
            <h1 class="text-2xl font-bold">${item.title}</h1>
            <span class="ml-2 p-1 rounded ${item.done ? 'bg-green-100' : ' bg-red-100'}">
                ${item.done ? "✔" : "✘"}
            </span>
        </div>
        <div>
            ${item.content}
        </div>
    </div>
</div>
```

You'll notice `click.delegate=editItem(item.id)` - This is the function used to navigate to the edit page. It wont do anything just yet until we create it in the next section.

### Updating Item ViewModel

Add the `editItem` function.

```ts
import { bindable, ICustomElementViewModel, IRouter } from "aurelia";
import { ITodoItem } from "../../services/todo-service";

export class Item implements ICustomElementViewModel {
    constructor(@IRouter private readonly router: IRouter) { }
    ...
    editItem(id: string): void {
        this.router.load(`edit/${id}`);
    }
}
```

Once updated and saved, try clicking on one of your todo items, You should be navigated to `localhost:9000/edit/0` - 0 being the id of the todo item.

### Creating the Edit View Model

pages/edit.ts

```ts
import { IRouteableComponent } from "@aurelia/router";
import { ITodoItem, TodoService } from "../services/todo-service";

type Parameters = {
    id: string;
}

export class Edit implements IRouteableComponent {
    private item: ITodoItem;

    constructor(private readonly todoService: TodoService) { }

    load(parameters: Parameters): void {
        this.item = this.todoService.retrieveTodo(parameters.id);
    }
}
```

#### Creating Edit Item component.

In your components folder create `resources/component/edit-item.ts` and `resources/component/edit-item.html`.

edit.item.ts

```ts
import { ITodoItem } from './../../services/todo-service';
import { bindable, ICustomElementViewModel } from "aurelia";

export class EditItem implements ICustomElementViewModel {
    @bindable item: ITodoItem;
}
```

edit-item.html

```html
<div class="p-8 rounded bg-gray-50">Try editing the title or content!</div>

<div class="flex flex-col p-8 cursor-pointer select-none">
    <div>
        <div class="flex items-center">
            <h1 class="p-2 text-2xl font-bold" contenteditable textcontent.bind="item.title">${item.title}</h1>
            <span class="ml-2 p-1 rounded ${item.done ? 'bg-green-100' : ' bg-red-100'}">
                ${item.done ? "✔" : "✘"}
            </span>
        </div>
        <div class="p-2" contenteditable textcontent.bind="item.content">
            ${item.content}
        </div>
    </div>
    <div class="my-2">
        <label class="cursor-pointer"><input type="checkbox" checked.bind="item.done"> Done</label>
    </div>
</div>

<a load="/dashboard"><button class="px-2 py-1 bg-gray-100 rounded">Go Back</button></a>
```

## Add Edit-Item component to Edit

Update `pages/edit.html` with the following.

```html
<edit-item item.bind="item"></edit-item>
```

## Summary

- Created our app using the `npx makes` command.
- Defined our project structure.
- Created pages that can be routed to by defining static routes in `my-app.ts`
- Created custom components that are registed and can be used globally without using import.
- Data binded todos to custom component.



