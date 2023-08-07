import { analyzeSentiment } from "../analyze.ts";
import { print } from "../fmt.ts";
import { getInput } from "../input.ts";
import { Handler } from "../type.ts";

const handler: Handler = async ({ input, HF_KEY }) => {
  while (!input) {
    input = await getInput();
    const result = await analyzeSentiment(input, HF_KEY);

    print(result);
    input = "";
  }
};

export default handler;
