import { defineDb, defineTable, column, NOW } from "astro:db";

const GuestbookEntries = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text({ optional: true }),
    website: column.text({ optional: true }),
    message: column.text(),
    created_at: column.date({ default: NOW }),
    approved_at: column.date({ optional: true }),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: { GuestbookEntries }
});
