import { Input } from "@cliffy/prompt";

function validateInput(value: string) {
  if (value.length < 3) return "Please enter a valid input";

  return true;
}

export function getInput(customValidator?: (value: string) => boolean) {
  return Input.prompt({
    message: "Enter the review:",
    validate: customValidator || validateInput,
  });
}
