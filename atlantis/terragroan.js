/**
 * Wrapper around terragrunt to display output succinctly on Atlantis.
 *
 * Terragrunt is notoriously verbose, which can cause Atlantis to output
 * hundreds of comments on single PRs, which can be annoying.
 *
 * This script will output just the final plan for resources to update on
 * successful terragrunt runs, but will output all terragrunt output on
 * errors.
 */

const shell = require('shelljs');
const path = require('path');

/**
 * Promisifies shelljs.exec
 *
 * @param {string} command - Command to execute in the local shell
 */
async function run(command) {
  return new Promise((resolve) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * Runs a plan via terragrunt. Output is only shown on error
 */
async function runPlan() {
  const { code, stderr } = await run('terragrunt plan -out plan.out');
  if (code != 0) {
    console.log(stderr);
    throw Error(`Failed to run plan in ${shell.pwd()}`);
  }
}

/**
 * Searches in subdirectories of the current directory to find the plan file produced
 * by terraform.
 */
async function findPlanFile() {
  const { stdout } = await run('find . -name plan.out');
  if (stdout.length == 0) {
    throw Error(
      `Could not find plan file named plan.out under dir ${shell.pwd()}`,
    );
  }
  return stdout;
}

/**
 * Prints a representation of the terraform plan output to the console
 *
 * @param {string} file - name of the plan file to show the output of
 */
async function printPlanFile(file) {
  const { dir, base } = path.parse(file);
  shell.cd(dir);

  const { stdout } = await run(`terraform show -no-color ${base}`);
  console.log(stdout);
}

/**
 * Main function
 */
async function main() {
  await runPlan();
  const planFile = await findPlanFile();
  await printPlanFile(planFile);
}

/**
 * Run the program, exiting with a status code of 1 on any error
 */
main().catch((err) => {
  console.error(err);
  process.exit(1);
});