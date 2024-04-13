import type { z } from "zod";
import { coauthor } from "./coauthor";
import type { authorSchema } from "./schemas";

export const coauthors = (authors: z.infer<typeof authorSchema>[]) =>
  Promise.all(authors.map(coauthor)).then((coauthors) => coauthors.join("\n"));
