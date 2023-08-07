import { initSecret } from "./secret.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

import FileHandler from "./handlers/file.ts";
import TextHandler from "./handlers/text.ts";
import { Handler } from "./type.ts";

async function main() {
  console.log("Exit with Ctrl + C");
  console.log("Reset HF_KEY with Ctrl + R");

  const HF_KEY = await initSecret();
  const input: string | string[] = "";

  const strategies: Record<string, Handler> = {
    text: TextHandler,
    file: FileHandler,
  } as const;

  await Select.prompt({
    message: "Select input type",
    options: [
      { name: "Text", value: "text" },
      { name: "File", value: "file" },
    ],
  })
    .then(async (type) => {
      await strategies[type]({
        input,
        HF_KEY,
      });
    })
    .catch((error) => {
      console.log(colors.red(error.message));
    });
}

await main();
