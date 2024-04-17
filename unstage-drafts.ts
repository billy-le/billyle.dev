import fs from "node:fs/promises";
import childProcess from "node:child_process";
import util from "node:util";
import fm from "front-matter";
import type { Post } from "src/content/_schemas/post";

const execPromise = util.promisify(childProcess.exec);

let data = "";

process.stdin.on("readable", () => {
  let chunk;

  while (null !== (chunk = process.stdin.read())) {
    data += chunk;
  }
});

process.stdin.on("end", async () => {
  // process all markdown files and unstage any draft posts
  const stagedFiles: string[] = [];
  const markdownFiles: string[] = [];

  data
    .split("\n")
    .filter((x) => x)
    .forEach((line) => {
      if (line.endsWith(".md")) {
        if (!line.startsWith("D")) {
          const markdownFile = line.split("\t")[1] as string;
          markdownFiles.push(markdownFile);
        }
      } else {
        stagedFiles.push(line);
      }
    });

  let draftCount = 0;

  for (const file of markdownFiles) {
    const content = await fs
      .readFile(file, { encoding: "utf-8" })
      .then((f) => fm<Post>(f));

    if (content.attributes.draft) {
      draftCount++;
      await execPromise(`git reset ${file}`);
    }
  }

  if (draftCount === markdownFiles.length && !stagedFiles.length) {
    throw Error("only draft posts were staged.");
  }
});
