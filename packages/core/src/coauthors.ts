import { coauthor } from "./coauthor";
import type { Author } from "./schemas";

export const coauthors = (authors: Author[]) =>
  Promise.all(authors.map(coauthor)).then((coauthors) => coauthors.join("\n"));
