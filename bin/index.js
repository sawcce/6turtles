#! /usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fs = require("fs");
const { cwd } = require("process");

const execute = require("../index.js");

const usage = "\nUsage: 6t <file> to be executed";
const options = yargs.usage(usage).help(true).argv;

let fPath = cwd() + "\\" + options["_"][0];

if (fPath != undefined) {
  let exists = fs.existsSync(fPath);
  if (exists == true) {
    let startTime = Date.now();

    console.log(chalk.green("Running program"));

    let program = fs.readFileSync(fPath, "utf8");
    execute(program);

    let duration = Date.now() - startTime;

    console.log(chalk.gray(`${duration} ms`));
  } else {
    console.log(chalk.red(`File "${fPath}" doesn't exists`));
  }
}
