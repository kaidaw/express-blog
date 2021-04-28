import render from "./render.js";
//import _ from "lodash";

fetch("/api/blog")
  .then((response) => {
    return response.json();
  })
  .then((info) => {
    render(info);
  });
