export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);

  return new Response(searchParams);
}
