import { db, GuestbookEntries } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(GuestbookEntries).values([
    { id: 1, name: "Ruben Arakelyan", email: "ruben@arakelyan.uk", website: null, message: "This is a test message\nover two lines.\n<script>alert(\"PWNED!\");</script>\nNice try!", approved_at: new Date() },
    { id: 2, name: "Ruben Arakelyan", email: null, website: "https://www.wackomenace.co.uk", message: "This is a test message\nover two lines." },
  ]);
}
