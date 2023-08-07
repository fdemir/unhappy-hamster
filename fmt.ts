// deno-lint-ignore-file ban-ts-comment
// @ts-nocheck
// TODO: Object.keys is not type safe
import { colors } from "@cliffy/ansi";
import { DisplayType, SentimentAnalysisResult, SentimentMap } from "./type.ts";

export const DISPLAY: Record<SentimentMap, DisplayType> = {
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

const calculateMedian = (values) => {
  const sortedValues = values.slice().sort((a, b) => a - b);
  return sortedValues.length % 2 === 0
    ? (sortedValues[sortedValues.length / 2 - 1] +
        sortedValues[sortedValues.length / 2]) /
        2
    : sortedValues[Math.floor(sortedValues.length / 2)];
};

export const print = (data: SentimentAnalysisResult[]) => {
  // TODO: refactor this
  const allPositiveValues = data.map((item) => item.positive);
  const allNegativeValues = data.map((item) => item.negative);
  const allNotrValues = data.map((item) => item.notr);

  const medianPositive = calculateMedian(allPositiveValues);
  const medianNegative = calculateMedian(allNegativeValues);
  const medianNotr = calculateMedian(allNotrValues);

  const averageScores = {
    positive: medianPositive,
    negative: medianNegative,
    notr: medianNotr,
  };

  const KVResult = Object.keys(averageScores);

  KVResult.forEach((label) => {
    const percentage = averageScores[label].toFixed(2) * 100;
    const { title, color } = DISPLAY[label];

    console.log(color(`${title} ${percentage}%`));
  });
};
