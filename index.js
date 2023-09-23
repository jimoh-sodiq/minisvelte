import * as fs from "fs";
import * as acorn from "acorn";

const content = fs.readFileSync("./app.svelte", "utf-8");

const ast = parse(content);
console.log(ast)

// const analysis = analyse(ast);

// const javascriptCode = generate(analysis);

// create the app.js file which contains the generated javascript code
fs.writeFileSync("./app.js", JSON.stringify(ast), "utf-8");

function parse(content) {
  let i = 0;
  let ast = {};
  ast.html = parseFragments(() => i < content.length); // ast = { "html" : []}
  return ast;

  function parseFragments(condition) {
    const fragments = [];
    while (condition) {
      const fragment = parseFragment();
      if (fragment) {
        fragments.push(fragment);
      }
    }
    return fragments;
  }

  function parseFragment() {
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  }

  function parseScript() {
    if (match("<script>")) {
      eat("<script>"); // updates the index i
      const startIndex = i;
      const endIndex = content.indexOf("</script>", i);
      const code = content.slice(startIndex, endIndex);
      ast.script = acorn.parse(code, { ecmaVersion: 2022 });
      i = endIndex 
      eat("</script>");
    }
  }

  function parseElement() {
    if (match("<")) {
      eat("<");
      const tagName = readWhileMatching(/[a-z]/);
      const attributes = parseAttributeList();
      eat(">");
      const endTag = `</${tagName}>`;

      const element = {
        type: "Element",
        name: tagName,
        attributes,
        children: parseFragments(() => !match(endTag)),
      };

      eat(endTag);
      return element;
    }
  }

  function parseAttributeList() {
    const attributes = [];
    skipWhiteSpace();
    while (!match(">")) {
      attributes.push(parseAttribute());
      skipWhiteSpace();
    }
  }
  function parseAttribute() {
    const name = readWhileMatching(/[^=]/);
    eat("={");
    const value = parseJavascript();
    eat("}");
    return {
      type: "Attribute",
      name,
      value,
    };
  }
  function parseExpression() {
    if (match("{")) {
      const expression = parseJavascript();
      eat("}");
      return {
        type: "Expression",
        expression,
      };
    }
  }
  function parseText() {
    const text = readWhileMatching(/[^<{]/);
    if (text.trim() !== "") {
      return {
        type: "Text",
        value: text,
      };
    }
  }
  function parseJavascript() {
    const js = acorn.parseExpressionAt(content, i, { ecmaVersion: 2022 });
    i = js.end;
    return js;
  }

  function match(str) {
    return content.slice(i, i + str.length) === str;
  }

  function eat(str) {
    if (match(str)) {
      i += str.length;
    } else {
      throw new Error(`Parse Error: expecting "${str}"`);
    }
  }

  function readWhileMatching(regex) {
    let startIndex = i;
    while (regex.test(content[i])) {
      i++;
    }
    return content.slice(startIndex, i);
  }

  function skipWhiteSpace() {
    readWhileMatching(/[\s\n]/);
  }
}

function analyse(ast) {}

function generate(analysis) {
  return "console.log('what')";
}
