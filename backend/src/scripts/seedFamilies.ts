import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import Family, { type IFamily } from "../models/Family.js";

// Shape of each entry in the JSON files
type SeedFamily = Pick<
  IFamily,
  | "name"
  | "city"
  | "group"
  | "guestType"
  | "status"
  | "confirmedCount"
  | "relationToGroom"
  | "notes"
  | "members"
>;

// Usage (run from the backend folder):
//   npm run seed:families -- src/data/families.json src/data/families-2.json
//                                                            -> seeds one or more files into an empty collection
//   npm run seed:families -- --reset <files>                 -> deletes ALL families first, then seeds
//   npm run seed:families -- --append <files>                -> adds the files, keeps existing families (skips same names)
//   npm run seed:families -- --sync <files>                  -> updates families with the same name from the files,
//                                                               creates the ones that don't exist yet
const args = process.argv.slice(2);
const reset = args.includes("--reset");
const append = args.includes("--append");
const sync = args.includes("--sync");
const files = args.filter((a) => !a.startsWith("--"));
if (files.length === 0) files.push("src/data/families.json");

// Same derivation the form uses: first member's numbers become primaryContact / phone
const withDerived = (f: SeedFamily) => ({
  ...f,
  primaryContact: f.members[0]?.contactNumber ?? "",
  phone: f.members[0]?.whatsappNumber ?? "",
  invitedCount: f.members.length,
});

async function main() {
  const all: SeedFamily[] = files.flatMap(
    (f) => JSON.parse(fs.readFileSync(path.resolve(f), "utf-8")) as SeedFamily[],
  );

  // The same family name in more than one file would create a duplicate, so keep the first one
  const seen = new Set<string>();
  const data = all.filter((f) => {
    const key = f.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (all.length > data.length) {
    console.log(`Skipped ${all.length - data.length} duplicate names across files`);
  }

  await connectDB();

  const existing = await Family.countDocuments();
  if (existing > 0 && !reset && !append && !sync) {
    console.error(
      `${existing} families already exist. Use --append to add more, --sync to update from the files, or --reset to delete them first.`,
    );
    return;
  }
  if (reset) {
    const { deletedCount } = await Family.deleteMany({});
    console.log(`Deleted ${deletedCount} existing families`);
  }

  if (sync) {
    let created = 0;
    let updated = 0;
    for (const f of data) {
      const res = await Family.updateOne(
        { name: f.name },
        { $set: withDerived(f) },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
      if (res.upsertedCount) created++;
      else if (res.modifiedCount) updated++;
    }
    console.log(`Synced ${files.join(", ")}: ${created} created, ${updated} updated`);
    return;
  }

  let toInsert = data;
  if (append) {
    // Skip families whose name already exists, so re-running does not create duplicates
    const names = new Set(
      (await Family.find({}, "name").lean()).map((f) => f.name.toLowerCase()),
    );
    toInsert = data.filter((f) => !names.has(f.name.toLowerCase()));
    const skipped = data.length - toInsert.length;
    if (skipped > 0) console.log(`Skipped ${skipped} families that already exist`);
  }

  const docs = toInsert.map(withDerived);

  if (docs.length === 0) {
    console.log("Nothing to insert");
    return;
  }

  const inserted = await Family.insertMany(docs);
  const memberCount = inserted.reduce((n, f) => n + f.members.length, 0);
  console.log(`Seeded ${inserted.length} families with ${memberCount} members from ${files.join(", ")}`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err.message ?? err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());