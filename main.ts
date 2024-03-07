import { compressImage, serveStatic } from "./routes.ts";

const handler = (request: Request) => {
  const { pathname } = new URL(request.url);

  if (pathname === "/compressImage") {
    return compressImage(request);
  } else {
    return serveStatic(request);
  }
};

Deno.serve(handler);
