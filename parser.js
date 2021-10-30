const chalk = require("chalk");
const chevrotain = require("chevrotain");

const createToken = chevrotain.createToken;
// using createToken API
const Identifier = createToken({
  name: "Identifier",
  pattern: /([A-SV-Z])+/,
});

const Lparen = createToken({ name: "Lparen", pattern: /\(/ });
const Rparen = createToken({ name: "Rparen", pattern: /\)/ });

const WakeUp = createToken({ name: "WakeUp", pattern: /wake up!/ });
const With = createToken({ name: "With", pattern: /with/ });
const And = createToken({ name: "And", pattern: /and/ });
const InMind = createToken({ name: "InMind", pattern: /in mind/ });
const Until = createToken({ name: "Until", pattern: /until/ });

const Turtle = createToken({ name: "Turtle", pattern: /🐢/ });
const Thumbsup = createToken({ name: "Thumbsup", pattern: /👍/ });
const Thumbsdown = createToken({ name: "Thumbsdown", pattern: /👎/ });

const u = createToken({ name: "U", pattern: /U/ });
const w = createToken({ name: "w", pattern: /w/ });

const Minus = createToken({ name: "Minus", pattern: /➖/ });
const Plus = createToken({ name: "Plus", pattern: /➕/ });

const AndTakes = createToken({ name: "AndTakes", pattern: /and takes/ });

const Normal = createToken({ name: "Normal", pattern: /normal/ });
const Divergent = createToken({ name: "Divergent", pattern: /divergent/ });

const Is = createToken({ name: "Is", pattern: /is/ });
const Equals = createToken({ name: "Equals", pattern: /equals/ });

const Not = createToken({ name: "Not", pattern: /not/ });

// Punctation

// Data types

const Num = createToken({ name: "Number", pattern: /[Turtle]+/ });
const Str = createToken({ name: "String", pattern: /'"[Turtlei1]+"'/ });

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: chevrotain.Lexer.SKIPPED,
});

const Comment = createToken({
  name: "Comment",
  pattern: /(\/\/.*\n)|(\/\*.*\*\/)/,
  group: chevrotain.Lexer.SKIPPED,
});

let allTokens = [
  Equals,
  Identifier,
  Normal,
  Divergent,
  Lparen,
  Rparen,
  WakeUp,
  With,
  And,
  InMind,
  Until,
  Thumbsdown,
  Not,
  Is,
  Minus,
  Plus,
  Thumbsup,
  u,
  w,
  Turtle,
  Num,
  Str,
  WhiteSpace,
];

const { EmbeddedActionsParser, Lexer } = require("chevrotain");

function convertTurToNum(num) {
  num = num.replace(/X/gm, "");
  num = num.replace(/T/gm, "0");
  num = num.replace(/u/gm, "1");
  num = num.replace(/r/gm, "2");
  num = num.replace(/t/gm, "3");
  num = num.replace(/l/gm, "4");
  num = num.replace(/e/gm, "5");
  return parseInt(num, 6);
}

class Parser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE("top", () => {
      let programBody = $.SUBRULE($.actions);

      return { type: "Program", body: programBody };
    });

    $.RULE("actions", () => {
      let actions = [];
      $.OPTION(() => {
        $.MANY(() => {
          actions.push($.SUBRULE($.action));
        });
      });

      return actions;
    });

    $.RULE("action", () => {
      let action;

      $.OR([
        {
          ALT: () => (action = $.SUBRULE($.varAndCall)),
        },
      ]);

      return action;
    });

    $.RULE("varAndCall", () => {
      let id = $.CONSUME(Identifier).image;

      let val;

      $.OR([
        {
          ALT: () => {
            val = $.SUBRULE($.variableAssignement, { ARGS: [id] });
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.functionCall, { ARGS: [id] });
          },
        },
      ]);

      return val;
    });

    $.RULE("variableAssignement", (id) => {
      let ret;

      $.OR([
        {
          ALT: () => {
            $.CONSUME(Is);
            let val = $.SUBRULE($.expression);
            ret = { type: "VariableAssignement", id, val };
          },
        },
        {
          ALT: () => {
            let type;

            $.OR1([
              {
                ALT: () => {
                  $.CONSUME(Minus);
                  $.CONSUME1(Minus);
                  type = "Decrement";
                },
              },
              {
                ALT: () => {
                  $.CONSUME(Plus);
                  $.CONSUME1(Plus);
                  type = "Increment";
                },
              },
            ]);

            ret = { type, id };
          },
        },
      ]);

      return ret;
    });

    $.RULE("functionCall", (id) => {
      let args;
      let condition = true;

      $.CONSUME(WakeUp);

      $.OPTION(() => {
        $.CONSUME(With);
        args = $.SUBRULE($.argsList);
        $.CONSUME(InMind);
      });

      $.OPTION1(() => {
        $.CONSUME(Until);
        condition = $.SUBRULE($.expression);
      });

      $.CONSUME(Turtle);

      return { type: "FunctionCall", id, args, condition };
    });

    $.RULE("function", () => {
      let funcType;

      $.OR([
        {
          ALT: () => (funcType = $.CONSUME(Normal).image),
        },
        {
          ALT: () => (funcType = $.CONSUME(Divergent).image),
        },
      ]);

      $.OPTION({
        DEF: () => {
          $.CONSUME(AndTakes);
          $.SUBRULE($.funcArgsList);
        },
      });

      $.CONSUME(Lparen);
      let body = $.SUBRULE($.actions);
      $.CONSUME(Rparen);
      return { type: "Function", body };
    });

    $.RULE("funcArgsList", () => {
      let args = [];

      args.push($.CONSUME(Identifier));

      $.OPTION(() => {
        $.MANY({
          DEF: () => {
            $.CONSUME(And);
            args.push($.CONSUME1(Identifier));
          },
        });
      });

      return args;
    });

    $.RULE("argsList", () => {
      let args = [];

      args.push($.SUBRULE($.expression));

      $.OPTION(() => {
        $.MANY({
          DEF: () => {
            $.CONSUME(And);
            args.push($.SUBRULE1($.expression));
          },
        });
      });

      return args;
    });

    $.RULE("expression", () => {
      let val;

      let final = [
        {
          ALT: () => {
            val = $.SUBRULE($.function);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE2($.functionCall);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE2($.binaryExpression);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.turtleExpression);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE1($.value);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.not);
          },
        },
      ];

      $.OR(final);
      return val;
    });

    $.RULE("value", () => {
      var val;
      $.OR([
        {
          ALT: () => {
            val = $.SUBRULE($.number);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.string);
          },
        },
        {
          ALT: () => {
            val = $.SUBRULE($.identifier);
          },
        },
      ]);
      return val;
    });

    $.RULE("turtleExpression", () => {
      $.CONSUME(Turtle);
      let val;

      $.OR([
        {
          ALT: () => {
            let left = $.SUBRULE($.value);
            let type = "Multiplication";
            $.OR1([
              {
                ALT: () => {
                  $.CONSUME(w);
                  type = "Multiplication";
                },
              },
              {
                ALT: () => {
                  $.CONSUME(u);
                  type = "Division";
                },
              },
              {
                ALT: () => {
                  $.CONSUME(Plus);
                  type = "Addition";
                },
              },
              {
                ALT: () => {
                  $.CONSUME(Minus);
                  type = "Substraction";
                },
              },
            ]);
            let right = $.SUBRULE1($.value);

            val = { type, left, right };
          },
        },
        {
          ALT: () => {
            let s = $.SUBRULE2($.value);
            let plusMin = 1;
            $.OR2([
              {
                ALT: () => {
                  $.CONSUME(Thumbsup);
                  plusMin = 1;
                },
              },
              {
                ALT: () => {
                  $.CONSUME(Thumbsdown);
                  plusMin = -1;
                },
              },
            ]);
            let off = $.SUBRULE($.number).value * plusMin;
            val = { type: "StringOffset", string: s, offset: off };
          },
        },
      ]);

      $.CONSUME1(Turtle);
      return val;
    });

    $.RULE("not", () => {
      $.CONSUME(Not);
      let right = $.SUBRULE($.expression);
      return { type: "NotExpression", right };
    });

    $.RULE("binaryExpression", () => {
      let left = $.SUBRULE($.value);
      $.CONSUME(Equals);
      let right = $.SUBRULE($.expression);
      return { type: "BinaryExpression", left, right };
    });

    $.RULE("string", () => {
      let str = $.CONSUME(Str).image.replace(/"|'/gm, "");
      return { type: "Literal", value: str };
    });

    $.RULE("number", () => {
      let num = $.CONSUME(Num).image;
      return { type: "Literal", value: convertTurToNum(num) };
    });

    $.RULE("identifier", () => {
      let id = $.CONSUME(Identifier).image;
      return { type: "Identifier", value: id };
    });

    //$.expressionExcept("binaryExpression");
    //$.expressionExcept("not");
    //$.expressionExcept("functionCall");
    //$.expressionExcept("function");

    this.performSelfAnalysis();
  }
}

function parseInput(text) {
  const lexer = new Lexer(allTokens);
  const p = new Parser();

  const lexingResult = lexer.tokenize(text);

  p.input = lexingResult.tokens;
  let res = p.top();

  if (p.errors.length > 0) {
    console.log(chalk.redBright("Errors while Parsing"));
    console.log(p.errors);
  }

  return res;
}

module.exports = parseInput;
