import { JSONLDSchema } from "@/lib/seo/types";

interface JSONLDScriptProps {
  schemas: JSONLDSchema | JSONLDSchema[];
}

/**
 * Component to inject JSON-LD structured data into the page head
 */
export default function JSONLDScript({ schemas }: JSONLDScriptProps) {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
  const jsonLdContent = JSON.stringify(
    schemaArray.length === 1 ? schemaArray[0] : schemaArray,
    null,
    0
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdContent }}
    />
  );
}
