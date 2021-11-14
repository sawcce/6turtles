const reader = require("readline-sync");
const chalk = require("chalk");

function offsetString(str, offset) {
  let fn = "";

  for (let char of str) {
    fn += String.fromCharCode(char.charCodeAt(0) + offset);
  }

  return fn;
}

function evaluate(value, data) {
  switch (value.type) {
    case "NotExpression":
      return !evaluate(value.right, data);
      break;
    case "BinaryExpression":
      let ld = data;
      return evaluate(value.left, ld) == evaluate(value.right, ld);
      break;
    case "StringOffset":
      return offsetString(evaluate(value.string, data), value.offset);
      break;
    case "Addition":
      return evaluate(value.left, data) + evaluate(value.right, data);
      break;
    case "Division":
      return evaluate(value.left, data) - evaluate(value.right, data);
      break;
    case "Multiplication":
      return evaluate(value.left, data) * evaluate(value.right, data);
      break;
    case "Division":
      return evaluate(value.left, data) / evaluate(value.right, data);
      break;
    case "Identifier":
      return data[value.value];
      break;
    case "Literal":
      return value.value;
      break;
    default:
      console.log("DEFAULT");
      return value;
      break;
  }
}

Object.prototype.evluateMultiple = function (data) {
  return this.map((val) => evaluate(val, data)).join(" ");
};

class Interpreter {
  constructor(ast) {
    this.program = ast;
    this.body = this.program.body;
    this.data = {};

    this.actions = {
      PRIN: (args) => {
        console.log(args.evluateMultiple(this.data));
      },
      ASK: (args) => {
      },
    };

    this.defaultExec = (action) => {
      this.launch(this.data[action.id].body);
    };
  }

  execute(action) {
    let toExec = this.actions[action.id];
    if (toExec) {
      toExec(action.args);
    } else {
      this.defaultExec(action);
    }
  }

  interpret() {
    let actions = this.body;
    console.log(actions);
    this.launch(actions);
  }

  launch(actions) {
    for (const action of actions) {
      switch (action.type) {
        case "FunctionCall":
          if (action.condition === true) {
            this.execute(action);
            continue;
          }
          while (evaluate(action.condition, this.data) == true) {
            this.execute(action);
          }
          break;

        case "Increment":
          this.data[action.id] += 1;
          break;

        case "Decrement":
          this.data[action.id] += -1;
          break;

        case "VariableAssignement":
          this.data[action.id] = evaluate(action.val, this.data);
          break;

        default:
          console.log(action.type);
          break;
      }
    }
  }
}

module.exports = Interpreter;
