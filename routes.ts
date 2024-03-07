import { TinifyClient } from "./tinifyClient.ts";

export const compressImage = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const client = new TinifyClient();
  const data = await client.compressImage(file as File);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const serveStatic = async (request: Request) => {
  const { pathname } = new URL(request.url);
  try {
    const fileName = pathname === "/"
      ? "./client/index.html"
      : `./client${pathname}`;
    const fileSize = (await Deno.stat(fileName)).size;
    const body = (await Deno.open(fileName)).readable;
    const headers = new Headers();
    headers.set("content-length", fileSize.toString());

    const ext = fileName.split(".").pop() || "";
    const types = {
      "html": "text/html",
      "js": "application/javascript",
      "css": "text/css",
    };
    headers.set("content-type", types[ext] || "text/plain");
    return new Response(body, { headers });
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      const notFoundFile = "./client/404.html";
      const notFourSize = (await Deno.stat(notFoundFile)).size;
      const notFoundBody = (await Deno.open(notFoundFile)).readable;
      const notFoundHeaders = new Headers();
      notFoundHeaders.set("content-length", notFourSize.toString());
      notFoundHeaders.set("content-type", "text/html");
      return new Response(notFoundBody, {
        status: 404,
        headers: notFoundHeaders,
      });
    }
    return new Response(null, { status: 500 });
  }
};
