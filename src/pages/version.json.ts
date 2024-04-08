import type { APIRoute } from "astro";
import childProcess from "child_process";
import { version } from "../../package.json";

const hash = childProcess.execSync("git rev-parse --short HEAD").toString().trim();

const versionMetadata = {
  hash,
  version,
};

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(versionMetadata), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
