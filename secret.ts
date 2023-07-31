import { Secret } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/secret.ts";

const HF_KEY_NAME = "HF_KEY";

export async function initSecret() {
  let HF_KEY = localStorage.getItem(HF_KEY_NAME);

  if (!HF_KEY) {
    HF_KEY = await Secret.prompt("Enter HF_KEY: ");

    localStorage.setItem(HF_KEY_NAME, HF_KEY);
  }

  return HF_KEY;
}

export function removeSecret() {
  localStorage.removeItem(HF_KEY_NAME);
}
