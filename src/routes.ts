export const routes = [
  { path: "blog", instructions: [{ component: "blog" }] },
  { path: "blog/:page", instructions: [{ component: "blog" }] },
  { path: "blog/:date/:id", instructions: [{ component: "post" }] },
  { path: "author/:author", instructions: [{ component: "author" }] },
  { path: "author/:author/:page", instructions: [{ component: "author" }] },
];
