import { creteFileResponse } from "./utils.ts";

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
