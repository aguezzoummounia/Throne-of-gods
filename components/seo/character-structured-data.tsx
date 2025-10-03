import { CharacterSEO } from "@/lib/seo/character";
import { SEOGenerator } from "@/lib/seo/generator";

interface CharacterStructuredDataProps {
  character: any;
}

export default function CharacterStructuredData({
  character,
}: CharacterStructuredDataProps) {
  // Generate enhanced character schemas (includes Person, powers, and faction)
  const enhancedSchemas =
    CharacterSEO.generateEnhancedCharacterSchemas(character);

  // Generate breadcrumb schema
  const breadcrumbSchema = CharacterSEO.generateCharacterBreadcrumbs(character);

  // Generate relationship schema
  const relationshipSchema =
    CharacterSEO.generateCharacterRelationshipSchema(character);

  // Combine all schemas
  const combinedSchema = [
    ...enhancedSchemas,
    breadcrumbSchema,
    relationshipSchema,
  ];

  return (
    <>
      {combinedSchema.map((schema, index) => (
        <script
          key={`character-schema-${index}`}
          id={`character-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: SEOGenerator.generateJSONLDScript(schema),
          }}
        />
      ))}
    </>
  );
}
