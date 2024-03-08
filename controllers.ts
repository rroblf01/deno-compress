import { TinifyClient } from "./tinifyClient.ts";
import { creteFileResponse } from "./utils.ts";

export const compressImageController = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const client = new TinifyClient();
  const data = await client.compressImage(file as File);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const serveStaticController = async (request: Request) => {
  const { pathname } = new URL(request.url);
  try {
    return await creteFileResponse(pathname, 200);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return await creteFileResponse("/404.html", 404);
    }

    console.error(e);
    return await creteFileResponse("/500.html", 404);
  }
};
