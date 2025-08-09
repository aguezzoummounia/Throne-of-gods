export default async function CharactersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  // if (!character) return notFound();

  console.log("character is : ", slug);
  return <div>CharactersPage</div>;
}
