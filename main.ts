import {
  compressImageController,
  serveStaticController,
} from "./controllers.ts";

const handler = (request: Request) => {
  const { pathname } = new URL(request.url);

  if (pathname === "/compressImage") {
    return compressImageController(request);
  } else {
    return serveStaticController(request);
  }
};

Deno.serve(handler);
