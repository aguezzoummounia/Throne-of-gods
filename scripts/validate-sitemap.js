#!/usr/bin/env node

/**
 * Script to validate sitemap generation and test sitemap functionality
 */

const {
  generateSitemapUrls,
  generateSitemapXML,
  generateRobotsTxt,
  validateSitemapUrls,
  getSitemapStats,
} = require("../lib/seo/sitemap");
const { SitemapMonitor } = require("../lib/seo/sitemap-monitor");

async function validateSitemap() {
  console.log("🔍 Validating Sitemap Generation...\n");

  try {
    // Generate sitemap URLs
    console.log("📋 Generating sitemap URLs...");
    const urls = generateSitemapUrls();
    console.log(`✅ Generated ${urls.length} URLs`);

    // Validate URLs
    console.log("\n🔍 Validating URLs...");
    const { valid, invalid } = validateSitemapUrls(urls);
    console.log(`✅ Valid URLs: ${valid.length}`);
    if (invalid.length > 0) {
      console.log(`❌ Invalid URLs: ${invalid.length}`);
      invalid.forEach((url) => console.log(`   - ${url.url}`));
    }

    // Generate statistics
    console.log("\n📊 Sitemap Statistics:");
    const stats = getSitemapStats(valid);
    console.log(`   Total URLs: ${stats.totalUrls}`);
    console.log(`   High Priority (≥0.8): ${stats.byPriority.high}`);
    console.log(`   Medium Priority (0.5-0.8): ${stats.byPriority.medium}`);
    console.log(`   Low Priority (<0.5): ${stats.byPriority.low}`);
    console.log("   Change Frequencies:");
    Object.entries(stats.byChangeFreq).forEach(([freq, count]) => {
      console.log(`     ${freq}: ${count}`);
    });

    // Test XML generation
    console.log("\n🔧 Testing XML generation...");
    const xml = generateSitemapXML(valid);
    console.log(`✅ Generated XML (${xml.length} characters)`);

    // Validate XML structure
    if (
      xml.includes('<?xml version="1.0" encoding="UTF-8"?>') &&
      xml.includes(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      ) &&
      xml.includes("</urlset>")
    ) {
      console.log("✅ XML structure is valid");
    } else {
      console.log("❌ XML structure is invalid");
    }

    // Test robots.txt generation
    console.log("\n🤖 Testing robots.txt generation...");
    const robotsTxt = generateRobotsTxt();
    console.log(`✅ Generated robots.txt (${robotsTxt.length} characters)`);

    if (robotsTxt.includes("User-agent: *") && robotsTxt.includes("Sitemap:")) {
      console.log("✅ robots.txt structure is valid");
    } else {
      console.log("❌ robots.txt structure is invalid");
    }

    // Test sitemap monitor
    console.log("\n📡 Testing sitemap monitor...");
    const monitor = new SitemapMonitor();
    const health = monitor.getHealthStatus();
    console.log(
      `✅ Monitor initialized - ${health.characterCount} characters tracked`
    );
    console.log(
      `✅ Health status: ${health.isHealthy ? "Healthy" : "Unhealthy"}`
    );

    // Sample URLs for verification
    console.log("\n🔗 Sample URLs:");
    const sampleUrls = valid.slice(0, 5);
    sampleUrls.forEach((url) => {
      console.log(
        `   ${url.url} (priority: ${url.priority}, freq: ${url.changeFrequency})`
      );
    });

    console.log("\n✅ Sitemap validation completed successfully!");
  } catch (error) {
    console.error("❌ Sitemap validation failed:", error);
    process.exit(1);
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  validateSitemap();
}

module.exports = { validateSitemap };
