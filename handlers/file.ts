import { readCSV } from "https://deno.land/x/csv/mod.ts";
import { Handler } from "../type.ts";
import { Input } from "@cliffy/prompt";
import { analyzeSentiment } from "../analyze.ts";
import { print } from "../fmt.ts";

// const f = await Deno.open("./example.csv");

// const list = [];
// for await (const row of readCSV(f, {
//   lineSeparator: "\r\n",
// })) {
//   for await (const cell of row) {
//     list.push(cell);
//   }
// }

const readFile = async (filename: string) => {
  const f = await Deno.open(filename);

  const list = [];
  for await (const row of readCSV(f, {
    lineSeparator: "\r\n",
  })) {
    for await (const cell of row) {
      list.push(cell);
    }
  }
  return list;
};

const handler: Handler = async ({ HF_KEY }) => {
  const fname = await Input.prompt({
    message: "Enter the file name:",
  });

  const fileContent = await readFile(fname);

  const result = await analyzeSentiment(fileContent, HF_KEY);

  print(result);
};

export default handler;
