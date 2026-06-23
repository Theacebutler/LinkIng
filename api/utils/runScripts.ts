import screenshotsRetry from "./screenshotsRetry";

const argv = process.argv.slice(2);

if (argv.length === 0) {
  console.log("Usage: bun runScripts.ts [script]");
  console.log("Available scripts:");
  console.log("1: screenshots Retry");
  console.log("Please choose a script number");
  process.exit(1);
}
if (argv.length > 1) {
  console.log("Too many arguments");
  process.exit(1);
}

switch (argv[0]) {
  case "1":
    screenshotsRetry();
    break;
  default:
    console.log("Unknown script:", argv[0]);
    process.exit(1);
}
