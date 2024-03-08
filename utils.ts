export const getFileName = (pathname: string) => {
  return pathname === "/" ? "./client/index.html" : `./client${pathname}`;
};

export const getHeaders = async (path: string) => {
  try {
    const fileSize = (await Deno.stat(path)).size;
    const ext = path.split(".").pop() || "";
    const types: { [key: string]: string } = {
      "html": "text/html",
      "js": "application/javascript",
      "css": "text/css",
    };
    const headers = new Headers();
    headers.set("content-length", fileSize.toString());
    headers.set("content-type", types[ext] || "text/plain");
    return headers;
  } catch (e) {
    console.error(e);
    return new Headers();
  }
};

export const creteFileResponse = async (path: string, status: number) => {
  const pathFile = getFileName(path);
  const body = (await Deno.open(pathFile)).readable;
  const headers = await getHeaders(pathFile);

  return new Response(body, {
    status,
    headers,
  });
};
