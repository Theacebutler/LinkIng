import screenshotsRetry from "./screenshotsRetry";
import logger from "./logger";

const argv = process.argv.slice(2);

if (argv.length === 0) {
  logger.info("Usage: bun runScripts.ts [script]");
  logger.info("Available scripts:");
  logger.info("1: screenshots Retry");
  logger.info("Please choose a script number");
  process.exit(1);
}
if (argv.length > 1) {
  logger.info("Too many arguments");
  process.exit(1);
}

switch (argv[0]) {
  case "1":
    screenshotsRetry();
    break;
  default:
    logger.info("Unknown script: " + argv[0]);
    process.exit(1);
}
