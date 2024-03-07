import { Tinify } from "./deps.ts";

export class TinifyClient {
  private tinify: Tinify;

  constructor() {
    const api_key = Deno.env.get("TINIFY_API_KEY") ||
      "02wCNkHldnf83pSxRP7Gm05HwQ8FplJv";
    this.tinify = new Tinify({ api_key });
  }

  async compressImage(file: File) {
    const arrBuffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(arrBuffer);
    const compressedImage = await (await this.tinify.compress(byteArray));

    const newImage = await compressedImage.toBase64();
    return { url: newImage.output.url, size: newImage.output.size };
  }
}
