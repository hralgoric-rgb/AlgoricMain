import imagekit from "@/app/(microestate)/lib/imagekit";

export async function uploadToImageKit(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.type;
  const fileName = file.name;

  const uploadResult = await imagekit.upload({
    file: `data:${mimeType};base64,${base64}`,
    fileName,
  });

  return uploadResult.url;
}
