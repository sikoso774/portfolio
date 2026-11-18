// Résumé Markdown des résultats Vitest, pour la page « Summary » d'un job GitHub Actions.
//
// Lit le rapport JSON de Vitest (`--reporter=json --outputFile.json=…`) et affiche
// un tableau par fichier de test, les tests les plus lents et le détail des échecs.
// Il complète le bloc « Vitest Test Report » écrit par le reporter github-actions.
//
// Usage : node scripts/test-summary.mjs [rapport.json] >> "$GITHUB_STEP_SUMMARY"

import { existsSync, readFileSync } from "node:fs";
import { relative } from "node:path";

const input = process.argv[2] ?? "test-results/vitest.json";

if (!existsSync(input)) {
  console.log(`## Results by file\n\nNo test report found at \`${input}\`.`);
  process.exit(0);
}

const report = JSON.parse(readFileSync(input, "utf8"));
const ANSI = /\u001b\[[0-9;]*m/g;
const seconds = (ms) => `${(ms / 1000).toFixed(2)} s`;
const count = (tests, status) =>
  tests.filter((t) => t.status === status).length;

const files = report.testResults
  .map((file) => {
    const tests = file.assertionResults;
    return {
      name: relative(process.cwd(), file.name).replaceAll("\\", "/"),
      tests,
      failed: count(tests, "failed"),
      duration: file.endTime - file.startTime,
    };
  })
  // Les fichiers en échec d'abord, puis l'ordre alphabétique
  .sort((a, b) => b.failed - a.failed || a.name.localeCompare(b.name));

const lines = ["", "## Results by file", ""];
lines.push("| | File | Tests | Passed | Failed | Skipped | Duration |");
lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: |");
for (const file of files) {
  const passed = count(file.tests, "passed");
  const skipped = file.tests.length - passed - file.failed;
  lines.push(
    `| ${file.failed ? "❌" : "✅"} | \`${file.name}\` | ${file.tests.length} | ${passed} | ${file.failed} | ${skipped} | ${seconds(file.duration)} |`,
  );
}

const slowest = files
  .flatMap((file) => file.tests.map((test) => ({ ...test, file: file.name })))
  .sort((a, b) => b.duration - a.duration)
  .slice(0, 5);
lines.push("", "### Slowest tests", "");
for (const test of slowest) {
  lines.push(
    `- ${seconds(test.duration)} — ${test.fullName} (\`${test.file}\`)`,
  );
}

const failures = files.flatMap((file) =>
  file.tests
    .filter((test) => test.status === "failed")
    .map((test) => ({ ...test, file: file.name })),
);
if (failures.length > 0) {
  lines.push("", `### Failures (${failures.length})`, "");
  for (const test of failures) {
    // Le message d'erreur et le début de la pile suffisent : la suite est interne à Vitest
    const message = test.failureMessages
      .join("\n")
      .replace(ANSI, "")
      .trim()
      .split("\n")
      .slice(0, 14)
      .join("\n");
    lines.push(
      `<details><summary>❌ ${test.fullName} (<code>${test.file}</code>)</summary>`,
      "",
      "~~~text",
      message.length > 2000 ? `${message.slice(0, 2000)}\n…` : message,
      "~~~",
      "",
      "</details>",
    );
  }
}

console.log(lines.join("\n"));
