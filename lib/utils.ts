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

// utils/throttle.ts

/**
 * Creates a throttled function that only invokes the provided function `func`
 * at most once per every `delay` milliseconds.
 *
 * @param func The function to throttle.
 * @param delay The number of milliseconds to throttle invocations to.
 * @returns A new throttled function.
 */
function throttle<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  // 1. A flag to track whether we are in the "cooldown" period.
  let inCooldown = false;

  // 2. Return a new function that wraps the original function.
  return function (...args: Parameters<F>) {
    // 3. If we are in the cooldown period, do nothing.
    if (inCooldown) {
      return;
    }

    // 4. If not in cooldown, execute the original function immediately.
    func(...args);

    // 5. Start the cooldown period.
    inCooldown = true;

    // 6. After the delay, reset the cooldown flag, allowing the function to be called again.
    setTimeout(() => {
      inCooldown = false;
    }, delay);
  };
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export { cx, cn, clamp, lerp, sleep, throttle, missingClass };
