export const routes = [
  { path: "articles", instructions: [{ component: "articles" }] },
  { path: "blog/:page", instructions: [{ component: "blog" }] },
  { path: ":date/:id", instructions: [{ component: "post" }] },
  { path: "author/:author", instructions: [{ component: "author" }] },
  { path: "author/:author/:page", instructions: [{ component: "author" }] },
];
