import { gpt } from "./backend/openai.ts";

export async function writeHaiku(context) {
  try {
    const body = await context.request.body().value;
    const pixelArray = body.pixelArray;
    console.log(pixelArray);
    const prompt = `Pretend you are in the character of a serious, intense, and moody Japanese poet.
    Write me a haiku based on this array of pixel RGB values: ${pixelArray}.
    The haiku should capture the mood of the collection of colors in the pixels and must use the colors from the array.
    The haiku should be abstract, in English, and not reference pixels directly.
    `
    const messages = [{role: 'system', content: prompt}]

    const result = await gpt({
      messages,
    });

    // send back response.content
    context.response.body = result.content;
  } catch (error) {
    console.error(error);
    context.response.body = "Error getting GPT response.";
  }
}
