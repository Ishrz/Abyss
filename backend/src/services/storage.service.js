import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const imageKitUpload = async ({
  buffer,
  fileName,
  folder = "Abyss/Products",
}) => {
  const images = await client.files.upload({
    file: await toFile(buffer),
    fileName: fileName,
    folder: folder,
  });

  return images;
};
