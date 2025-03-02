import { fetchDataAndFilter } from "./filterFunction.js";

console.assert(
  JSON.stringify(fetchDataAndFilter([{ title: "JavaScript" }], "js")) ===
    JSON.stringify([{ title: "JavaScript" }]),
  "Test Failed"
);
console.assert(
  JSON.stringify(fetchDataAndFilter([{ title: "React" }], "vue")) ===
    JSON.stringify([]),
  "Test Failed"
);
console.assert(
  JSON.stringify(fetchDataAndFilter([], "test")) === JSON.stringify([]),
  "Test Failed"
);
console.assert(
  JSON.stringify(fetchDataAndFilter([{ title: "JS Framework" }], "JS")) ===
    JSON.stringify([{ title: "JS Framework" }]),
  "Test Failed"
);
