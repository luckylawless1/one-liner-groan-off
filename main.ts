// One-Liner Groan-Off — entry program for make.fun bounty
// u-alfasurya91-the-one-liner-groan-off-5a1febd5
//
// Writes one original one-line dad joke to /output/entry.txt.
// The joke is a fresh twist, written for this bounty: a dad is asked for
// his best joke and answers by pointing at his own son — the son IS the
// joke. Setup and punchline land inside a single line, no wasted words.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "My son asked for my best joke. I said, 'You're looking at it,' and pointed at him.";

const OUTPUT_DIR = "/output";
const ENTRY_PATH = join(OUTPUT_DIR, "entry.txt");

function main(): void {
  // The grader mounts /output. Create the root if it is missing, but never
  // remove the root itself — clear only its contents.
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const name of readdirSync(OUTPUT_DIR)) {
    rmSync(join(OUTPUT_DIR, name), { recursive: true, force: true });
  }

  // Gate: UTF-8 text, 1 to 140 characters, not only whitespace — and it
  // must stay one line, since the entry is a single one-liner.
  const byteLength = Buffer.byteLength(JOKE, "utf8");
  if (JOKE.length < 1 || JOKE.length > 140 || JOKE.trim().length === 0) {
    throw new Error(
      `entry must be 1-140 non-whitespace characters, got ${JOKE.length}`,
    );
  }
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (byteLength > 140) {
    throw new Error(`entry must be at most 140 bytes, got ${byteLength}`);
  }

  writeFileSync(ENTRY_PATH, JOKE, "utf8");

  // Verify what landed on disk matches the joke exactly, byte for byte.
  const written = Buffer.from(JOKE, "utf8");
  const onDisk = readFileSync(ENTRY_PATH);
  if (!written.equals(onDisk)) {
    throw new Error("verification failed: /output/entry.txt differs from the joke");
  }

  console.log(`wrote ${ENTRY_PATH} (${JOKE.length} characters)`);
  console.log(JOKE);
}

main();
