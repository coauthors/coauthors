import { type Author, coauthors } from "@coauthors/core";
import { debug } from "./log";

const COAUTHORS_PREFIX = "coauthors:";

interface MessageInfo {
  result: string;
  isConverted: boolean;
}

export const convert = async (message: string): Promise<MessageInfo> => {
  debug(`Original commit message: ${message}`);

  const lines = message.split("\n");

  const coauthorsLineIndex = lines.findIndex((line) =>
    line.startsWith(COAUTHORS_PREFIX),
  );
  const coauthorsLine = lines.find((line) =>
    line.trimStart().startsWith(COAUTHORS_PREFIX),
  );

  const authors = coauthorsLine
    ?.substring(COAUTHORS_PREFIX.length, coauthorsLine.length)
    .split(",")
    .map(parseAuthor);

  const coauthorsResult = authors ? await coauthors(authors) : undefined;

  if (coauthorsLineIndex >= 0 && coauthorsResult) {
    lines[coauthorsLineIndex] = coauthorsResult;
  }

  return {
    isConverted: !!coauthorsLine,
    result: lines.join("\n"),
  };
};

const parseAuthor = (inputString: string): Author => {
  const input = inputString.trim();
  const parenthesesIndex = {
    open: input.indexOf("("),
    close: input.indexOf(")"),
  };

  if (parenthesesIndex.open >= 0 && parenthesesIndex.close >= 0) {
    return {
      user: input.slice(0, parenthesesIndex.open).trim(),
      name: input
        .slice(parenthesesIndex.open + 1, parenthesesIndex.close)
        .trim(),
    };
  }

  if (parenthesesIndex.open >= 0 && parenthesesIndex.close === -1) {
    throw new Error("parentheses should be closed");
  }

  return { user: input, name: undefined };
};
