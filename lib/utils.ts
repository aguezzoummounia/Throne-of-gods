import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";
// import { MotionValue } from "motion/react";

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

const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

function encodedRedirect(type: string, path: string, message: string) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

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

const formatToTens = (number: number) => {
  if (number < 10) {
    return `0${number}`;
  } else {
    return number;
  }
};

const convertToMinuteSeconds = (duration: number) => {
  const ONE_MINUTE = 60; // seconds
  const minutes = Math.round(duration / ONE_MINUTE);
  const minutesInSeconds = ONE_MINUTE * minutes;

  let remainingSeconds;
  if (minutes) {
    remainingSeconds = Math.round(duration % minutesInSeconds);
  } else {
    remainingSeconds = Math.round(duration);
  }

  return `${formatToTens(minutes)}:${formatToTens(remainingSeconds)}`;
};

const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dateObj.toLocaleDateString("en-US", options);
};

// Define the types for block content and children
type Block = {
  _type: string;
  children?: Array<{ text: string }>;
};

type BlockContent = Block[] | null;

// Helper function to extract plain text from block content
const extractPlainText = (blocks: BlockContent): string | null => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks
    .map((block) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children.map((child) => child.text).join("");
      }
      return "";
    })
    .join(" ");
};

// const mapRange = (
//   inputLower: number,
//   inputUpper: number,
//   outputLower: number,
//   outputUpper: number
// ) => {
//   const INPUT_RANGE = inputUpper - inputLower;
//   const OUTPUT_RANGE = outputUpper - outputLower;

//   return (value: number) =>
//     outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0);
// };

// const setTransform = (
//   item: HTMLElement & EventTarget,
//   event: React.PointerEvent,
//   x: MotionValue,
//   y: MotionValue
// ) => {
//   const bounds = item.getBoundingClientRect();
//   const relativeX = event.clientX - bounds.left;
//   const relativeY = event.clientY - bounds.top;
//   const xRange = mapRange(0, bounds.width, -1, 1)(relativeX);
//   const yRange = mapRange(0, bounds.height, -1, 1)(relativeY);
//   x.set(xRange * 10);
//   y.set(yRange * 10);
// };

const generateLink = (value) => {
  let href;
  switch (value.linkType) {
    case "internal":
      const internalDoc = value?.internalDocument;
      href =
        internalDoc && internalDoc.slug
          ? internalDoc._type === "project"
            ? `/work/${internalDoc.slug}`
            : `/${internalDoc.slug}`
          : "/";
      break;
    case "external":
      href = value?.url || "/";
      break;
    case "email":
      href = value?.url ? `mailto:${value.url}` : "/";
      break;
    default:
      href = "/";
  }
  const target = value?.newWindow ? "_blank" : "_self";
  return { href, target };
};

export {
  cx,
  cn,
  sleep,
  formatDate,
  generateLink,
  formatToTens,
  missingClass,
  encodedRedirect,
  extractPlainText,
  ensureStartsWith,
  convertToMinuteSeconds,
};
