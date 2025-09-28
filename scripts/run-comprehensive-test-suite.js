#!/usr/bin/env node

/**
 * Comprehensive test suite runner for RippleImage optimization
 * Executes all test categories and generates performance reports
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const testCategories = {
  "Unit Tests - Hooks": [
    "hooks/__tests__/useDeviceCapabilities.test.ts",
    "hooks/__tests__/usePerformanceMonitor.test.ts",
    "hooks/__tests__/useResourceManager.test.ts",
    "hooks/__tests__/useMobileOptimizations.test.tsx",
    "hooks/__tests__/comprehensive-hooks.test.ts",
  ],
  "Unit Tests - Utilities": [
    "lib/__tests__/device-classifier.test.ts",
    "lib/__tests__/performance-monitor.test.ts",
    "lib/__tests__/performance-profiler.test.ts",
    "lib/__tests__/resource-manager.test.ts",
    "lib/__tests__/mobile-optimizations.test.ts",
    "lib/__tests__/shader-manager.test.ts",
    "lib/__tests__/shader-cache.test.ts",
    "lib/__tests__/texture-scaling.test.ts",
  ],
  "Integration Tests": [
    "components/__tests__/ripple-comprehensive-integration.test.tsx",
    "components/__tests__/ripple-integration.test.tsx",
    "components/__tests__/footer-ripple-integration.test.tsx",
  ],
  "Performance Benchmarking": [
    "lib/__tests__/performance-benchmarking.test.ts",
  ],
  "Visual Regression Tests": [
    "components/__tests__/visual-regression-quality-modes.test.tsx",
    "glsl/__tests__/shader-visual-regression.test.ts",
  ],
  "Mobile Device Simulation": [
    "lib/__tests__/mobile-device-simulation.test.ts",
  ],
};

function runTestCategory(categoryName, testFiles) {
  console.log(`\n🧪 Running ${categoryName}...`);
  console.log("=".repeat(50));

  const startTime = Date.now();

  try {
    // Run tests for this category - use space-separated files instead of pipe
    const testFiles_escaped = testFiles.map((f) => `"${f}"`).join(" ");
    const command = `npx vitest run --reporter=verbose --coverage.enabled=true ${testFiles_escaped}`;

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
    coverage: {
      // This would be populated by vitest coverage
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  };

  // Write report to file
  const reportPath = path.join(
    process.cwd(),
    "test-results",
    "comprehensive-test-report.json"
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
  console.log("\n📊 Test Suite Summary");
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
    `\n📄 Full report saved to: test-results/comprehensive-test-report.json`
  );
}

function runPerformanceBenchmarks() {
  console.log("\n🚀 Running Performance Benchmarks...");
  console.log("=".repeat(50));

  try {
    // Run performance-specific tests with detailed output
    const command =
      "npx vitest run lib/__tests__/performance-benchmarking.test.ts --reporter=verbose";
    const output = execSync(command, { encoding: "utf8" });

    console.log(output);

    // Extract performance metrics from output
    const fpsMatches = output.match(/(\d+)fps/g) || [];
    const memoryMatches = output.match(/(\d+(?:\.\d+)?)MB/g) || [];

    return {
      fps: fpsMatches,
      memory: memoryMatches,
      rawOutput: output,
    };
  } catch (error) {
    console.error("Performance benchmarks failed:", error.message);
    return null;
  }
}

function checkTestCoverage() {
  console.log("\n📈 Checking Test Coverage...");
  console.log("=".repeat(50));

  try {
    // Run all tests with coverage
    const command =
      "npx vitest run --coverage.enabled=true --coverage.reporter=text --coverage.reporter=json";
    const output = execSync(command, { encoding: "utf8" });

    console.log(output);

    // Try to read coverage report
    const coveragePath = path.join(
      process.cwd(),
      "coverage",
      "coverage-summary.json"
    );
    if (fs.existsSync(coveragePath)) {
      const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
      return coverage.total;
    }

    return null;
  } catch (error) {
    console.error("Coverage check failed:", error.message);
    return null;
  }
}

async function main() {
  console.log("🧪 RippleImage Optimization - Comprehensive Test Suite");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);

  const results = [];

  // Run each test category
  for (const [categoryName, testFiles] of Object.entries(testCategories)) {
    const result = runTestCategory(categoryName, testFiles);
    results.push(result);

    // Short pause between categories
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Generate and display report
  const report = generateTestReport(results);
  printSummary(report);

  // Run performance benchmarks
  const perfResults = runPerformanceBenchmarks();
  if (perfResults) {
    console.log("\n🚀 Performance Benchmark Results:");
    console.log(`FPS measurements: ${perfResults.fps.join(", ")}`);
    console.log(`Memory measurements: ${perfResults.memory.join(", ")}`);
  }

  // Check overall coverage
  const coverage = checkTestCoverage();
  if (coverage) {
    console.log("\n📈 Coverage Summary:");
    console.log(`Statements: ${coverage.statements.pct}%`);
    console.log(`Branches: ${coverage.branches.pct}%`);
    console.log(`Functions: ${coverage.functions.pct}%`);
    console.log(`Lines: ${coverage.lines.pct}%`);
  }

  // Exit with appropriate code
  const hasFailures = results.some((r) => !r.success);
  process.exit(hasFailures ? 1 : 0);
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: node run-comprehensive-test-suite.js [options]

Options:
  --help, -h     Show this help message
  --category     Run specific category only
  --performance  Run only performance benchmarks
  --coverage     Run only coverage check

Examples:
  node run-comprehensive-test-suite.js
  node run-comprehensive-test-suite.js --category "Unit Tests - Hooks"
  node run-comprehensive-test-suite.js --performance
  `);
  process.exit(0);
}

if (args.includes("--performance")) {
  runPerformanceBenchmarks();
  process.exit(0);
}

if (args.includes("--coverage")) {
  checkTestCoverage();
  process.exit(0);
}

const categoryFilter = args.find((arg) => arg.startsWith("--category="));
if (categoryFilter) {
  const categoryName = categoryFilter.split("=")[1];
  if (testCategories[categoryName]) {
    const result = runTestCategory(categoryName, testCategories[categoryName]);
    console.log(result.success ? "✅ Success" : "❌ Failed");
    process.exit(result.success ? 0 : 1);
  } else {
    console.error(`Unknown category: ${categoryName}`);
    console.log(
      "Available categories:",
      Object.keys(testCategories).join(", ")
    );
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
