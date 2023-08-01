import { colors } from "@cliffy/ansi";

import {
  DisplayType,
  SentimentAnalysisResponse,
  SentimentMap,
} from "./type.ts";

import { initSecret } from "./secret.ts";
import { MODEL_API } from "./constant.ts";
import { getInput } from "./input.ts";

const DISPLAY: Record<SentimentMap, DisplayType> = {
  negative: {
    title: "👎 Negative:",
    color: colors.red,
  },
  positive: {
    title: "👍 Positive:",
    color: colors.green,
  },
  notr: {
    title: "🤷‍♂️ Notr: ",
    color: colors.gray,
  },
};

async function analyzeSentiment(review: string, HF_KEY: string) {
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

  const result = body[0];

  const mappedResult = result.reduce(
    (acc: Record<SentimentMap, number>, { label, score }) => {
      acc[label.toLowerCase() as SentimentMap] = score;
      return acc;
    },
    {} as Record<SentimentMap, number>
  );

  Object.keys(mappedResult).forEach((label) => {
    // @ts-ignore
    const percentage = mappedResult[label].toFixed(2) * 100;
    //@ts-ignore
    const { title, color } = DISPLAY[label];

    console.log(color(`${title} ${percentage}%`));
  });
}

async function main() {
  console.log("Exit with Ctrl + C");
  console.log("Reset HF_KEY with Ctrl + R");

  const HF_KEY = await initSecret();
  let input = "";

  while (!input) {
    input = await getInput();

    try {
      await analyzeSentiment(input, HF_KEY);
    } catch (err) {
      console.log(colors.red(err.message));
    }

    input = "";
  }
}

await main();
