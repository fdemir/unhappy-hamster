import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/mod.ts";
import {
  DisplayType,
  SentimentAnalysisResponse,
  SentimentMap,
} from "./type.ts";
import { initSecret, removeSecret } from "./secret.ts";
import { MODEL_API } from "./constant.ts";
import {
  keypress,
  KeyPressEvent,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/keypress/mod.ts";
import { tty } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/tty.ts";

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
    input = await Input.prompt({
      message: "Enter the review:",
      validate: (value) => {
        if (value.length < 3) return "Please enter a valid input";

        return true;
      },
    });

    try {
      await analyzeSentiment(input, HF_KEY);
    } catch (err) {
      console.log(colors.red(err.message));
    }
    input = "";
  }
}

await main();
