import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs));
}

const cx = (...classnames: string[]) => {
  return classnames
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (typeof item === "object") {
        return Object.keys(item)
          .map((key) => {
            return item[key] ? key : void 0;
          })
          .join(" ");
      }
      return void 0;
    })
    .join(" ");
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function missingClass(string: string | undefined, prefix: string) {
  if (!string) {
    return true;
  }

  const regex = new RegExp(` ?${prefix}`, "g");
  return string.match(regex) === null;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export { cx, cn, lerp, sleep, missingClass };
