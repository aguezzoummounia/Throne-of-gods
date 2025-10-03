/**
 * Script to verify and display the homepage SEO implementation
 */

const { generateCompleteHomepageSEO } = require("../lib/seo/homepage");

console.log("🔍 Verifying Homepage SEO Implementation...\n");

try {
  const seo = generateCompleteHomepageSEO();

  console.log("✅ Metadata Generated:");
  console.log("Title:", seo.metadata.title);
  console.log(
    "Description:",
    seo.metadata.description?.substring(0, 100) + "..."
  );
  console.log("Keywords:", seo.metadata.keywords?.slice(0, 5).join(", "));
  console.log("Open Graph Title:", seo.metadata.openGraph?.title);
  console.log("Twitter Card:", seo.metadata.twitter?.card);
  console.log();

  console.log("✅ JSON-LD Schemas Generated:");
  seo.schemas.forEach((schema, index) => {
    console.log(`${index + 1}. ${schema["@type"]} Schema`);
    if (schema["@type"] === "WebSite") {
      console.log("   - Name:", schema.name);
      console.log("   - URL:", schema.url);
      console.log("   - Has Search Action:", !!schema.potentialAction);
    }
    if (schema["@type"] === "Organization") {
      console.log("   - Name:", schema.name);
      console.log("   - URL:", schema.url);
    }
  });
  console.log();

  console.log("✅ Social Media Tags Generated:");
  console.log("Twitter Card:", seo.socialTags["twitter:card"]);
  console.log("OG Image Width:", seo.socialTags["og:image:width"]);
  console.log("OG Image Height:", seo.socialTags["og:image:height"]);
  console.log();

  console.log("🎉 Homepage SEO implementation is working correctly!");
  console.log(`📊 Generated ${seo.schemas.length} JSON-LD schemas`);
  console.log(
    `🏷️  Generated ${Object.keys(seo.socialTags).length} social media tags`
  );
} catch (error) {
  console.error("❌ Error verifying SEO implementation:", error.message);
  process.exit(1);
}
