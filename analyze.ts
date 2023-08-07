// deno-lint-ignore-file ban-ts-comment
import { MODEL_API } from "./constant.ts";
import {
  SentimentAnalysisResponse,
  SentimentAnalysisResult,
  SentimentMap,
} from "./type.ts";

export async function analyzeSentiment(
  review: string | string[],
  HF_KEY: string
) {
  const response = await fetch(MODEL_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
    },
    body: JSON.stringify({ inputs: review }),
  });

  const body: SentimentAnalysisResponse = await response.json();

  // @ts-ignore
  if (body.error) throw new Error(body.error);

  // @ts-ignore
  const mappedResult = body.map((result) => {
    const item = result.reduce(
      // @ts-ignore
      (acc: Record<SentimentMap, number>, { label, score }) => {
        acc[label.toLowerCase() as SentimentMap] = score;
        return acc;
      },
      {} as Record<SentimentMap, number>
    );

    return item;
  }) as SentimentAnalysisResult[];

  return mappedResult;
}
