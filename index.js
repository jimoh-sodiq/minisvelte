import * as fs from "fs";

const content = fs.readFileSync("./app.svelte", "utf-8");

const ast = parse(content);

const analysis = analyse(ast);

const javascriptCode = generate(analysis);

// create the app.js file which contains the generated javascript code
fs.writeFileSync("./app.js", javascriptCode, "utf-8");

function parse(content) {
  let ast = {};
  console.log("parsing");

  return ast;
}
function analyse(ast) {}
function generate(analysis) {
  return "console.log('what')";
}
