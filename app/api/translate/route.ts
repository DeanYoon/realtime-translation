import { NextResponse } from "next/server";
import * as deepl from "deepl-node";

const authKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY as string;
const translator = new deepl.Translator(authKey);

export async function POST(request: Request) {
  const data = await request.json();
  const { text } = data;
  const result = await translator.translateText(text, null, "ko");

  return NextResponse.json(result);
}
