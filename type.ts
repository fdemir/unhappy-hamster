export type Sentiment = "Positive" | "Negative" | "Notr";

export type SentimentMap = Lowercase<Sentiment>;

export type SentimentAnalysisResult = {
  label: Sentiment;
  score: number;
};

export type SentimentAnalysisResponse = [SentimentAnalysisResult[]];

export type SentimentAnalysisError = {
  error?: string;
};

export type SentimentAnalysisRequest = {
  inputs: string;
};

export type DisplayType = {
  title: string;
  color: (text: string) => string;
};
