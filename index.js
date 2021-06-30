const Interpreter = require("./interpreter");
const Parse = require("./parser");

function exec(text) {
  const ast = Parse(text);
  const o = new Interpreter(ast);
  o.interpret();
}

module.exports = exec;
