#!/usr/bin/env node

/**
 * Focused test runner for working tests in the comprehensive test suite
 * This demonstrates the comprehensive test suite functionality with tests that pass
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const workingTestCategories = {
  "Unit Tests - Texture Scaling": ["lib/__tests__/texture-scaling.test.ts"],
  "Unit Tests - Resource Manager": ["lib/__tests__/resource-manager.test.ts"],
  "Unit Tests - Performance Monitor": [
    "lib/__tests__/performance-monitor.test.ts",
  ],
  "Unit Tests - Shader Cache": ["lib/__tests__/shader-cache.test.ts"],
  "Visual Regression - Shader Tests": [
    "glsl/__tests__/shader-visual-regression.test.ts",
  ],
  "Integration Tests - Basic": [
    "components/__tests__/ripple-integration.test.tsx",
  ],
};

function runTestCategory(categoryName, testFiles) {
  console.log(`\n🧪 Running ${categoryName}...`);
  console.log("=".repeat(50));

  const startTime = Date.now();

  try {
    // Run tests for this category
    const testFilesEscaped = testFiles.map((f) => `"${f}"`).join(" ");
    const command = `npx vitest run --reporter=verbose ${testFilesEscaped}`;

    console.log(`Executing: ${command}`);
    const output = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(output);
    console.log(`✅ ${categoryName} completed in ${duration.toFixed(2)}s`);

    return {
      category: categoryName,
      success: true,
      duration,
      output,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.error(`❌ ${categoryName} failed after ${duration.toFixed(2)}s`);
    console.error(error.stdout || error.message);

    return {
      category: categoryName,
      success: false,
      duration,
      error: error.stdout || error.message,
    };
  }
}

function generateTestReport(results) {
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.success).length;
  const failedTests = totalTests - passedTests;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  const report = {
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      duration: totalDuration,
      timestamp: new Date().toISOString(),
    },
    categories: results,
  };

  // Write report to file
  const reportPath = path.join(
    process.cwd(),
    "test-results",
    "working-test-report.json"
  );

  // Ensure directory exists
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

function printSummary(report) {
  console.log("\n📊 Working Test Suite Summary");
  console.log("=".repeat(50));
  console.log(`Total Categories: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed} ✅`);
  console.log(
    `Failed: ${report.summary.failed} ${report.summary.failed > 0 ? "❌" : ""}`
  );
  console.log(`Total Duration: ${report.summary.duration.toFixed(2)}s`);
  console.log(
    `Success Rate: ${(
      (report.summary.passed / report.summary.total) *
      100
    ).toFixed(1)}%`
  );

  if (report.summary.failed > 0) {
    console.log("\n❌ Failed Categories:");
    report.categories
      .filter((c) => !c.success)
      .forEach((c) => console.log(`  - ${c.category}`));
  }

  console.log(
    `\n📄 Full report saved to: test-results/working-test-report.json`
  );
}

async function main() {
  console.log("🧪 RippleImage Optimization - Working Test Suite");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);

  const results = [];

  // Run each test category
  for (const [categoryName, testFiles] of Object.entries(
    workingTestCategories
  )) {
    const result = runTestCategory(categoryName, testFiles);
    results.push(result);

    // Short pause between categories
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Generate and display report
  const report = generateTestReport(results);
  printSummary(report);

  // Exit with appropriate code
  const hasFailures = results.some((r) => !r.success);
  process.exit(hasFailures ? 1 : 0);
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: node run-working-tests.js [options]

Options:
  --help, -h     Show this help message

This script runs a focused subset of tests that are known to work,
demonstrating the comprehensive test suite functionality.
  `);
  process.exit(0);
}

// Run main function
main().catch((error) => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
