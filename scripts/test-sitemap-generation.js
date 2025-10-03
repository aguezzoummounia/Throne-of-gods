/**
 * Simple test script to validate sitemap generation
 * This script tests the sitemap routes directly
 */

const http = require("http");
const { spawn } = require("child_process");

async function testSitemapGeneration() {
  console.log("🔍 Testing Sitemap Generation...\n");

  // Start Next.js dev server
  console.log("🚀 Starting Next.js dev server...");
  const server = spawn("npm", ["run", "dev"], {
    stdio: "pipe",
    shell: true,
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    // Test sitemap.xml endpoint
    console.log("📋 Testing sitemap.xml endpoint...");
    const sitemapResponse = await fetch("http://localhost:3000/sitemap.xml");

    if (sitemapResponse.ok) {
      const sitemapContent = await sitemapResponse.text();
      console.log("✅ Sitemap.xml generated successfully");
      console.log(`   Content length: ${sitemapContent.length} characters`);

      // Basic validation
      if (
        sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>') &&
        sitemapContent.includes(
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ) &&
        sitemapContent.includes("</urlset>")
      ) {
        console.log("✅ XML structure is valid");
      } else {
        console.log("❌ XML structure is invalid");
      }

      // Count URLs
      const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
      console.log(`   URLs found: ${urlCount}`);
    } else {
      console.log(`❌ Sitemap.xml request failed: ${sitemapResponse.status}`);
    }

    // Test robots.txt endpoint
    console.log("\n🤖 Testing robots.txt endpoint...");
    const robotsResponse = await fetch("http://localhost:3000/robots.txt");

    if (robotsResponse.ok) {
      const robotsContent = await robotsResponse.text();
      console.log("✅ Robots.txt generated successfully");
      console.log(`   Content length: ${robotsContent.length} characters`);

      // Basic validation
      if (
        robotsContent.includes("User-agent: *") &&
        robotsContent.includes("Sitemap:")
      ) {
        console.log("✅ Robots.txt structure is valid");
      } else {
        console.log("❌ Robots.txt structure is invalid");
      }
    } else {
      console.log(`❌ Robots.txt request failed: ${robotsResponse.status}`);
    }

    console.log("\n✅ Sitemap generation test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    // Clean up server
    server.kill();
    console.log("\n🛑 Server stopped");
  }
}

// Polyfill fetch for older Node.js versions
if (!global.fetch) {
  global.fetch = require("node-fetch");
}

// Run test if script is executed directly
if (require.main === module) {
  testSitemapGeneration().catch(console.error);
}

module.exports = { testSitemapGeneration };
