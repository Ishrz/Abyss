import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const imageKitUpload = async (
  buffer,
  filename,
  folder = "Abyss/Products"
) => {
  const images =await client.files.upload({
    file: await toFile(buffer),
    fileName: filename,
    folder:folder
  });

  return images
};
