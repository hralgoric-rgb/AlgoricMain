import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/app/(microestate)/lib/imagekit";

export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const fileName = file.name;

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: "Only JPG, JPEG, and PNG formats are allowed" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    const imageData = `data:${mimeType};base64,${base64}`;

    const uploadResult = await imagekit.upload({
      file: imageData,
      fileName: fileName,
    });


    return NextResponse.json({
      success: true,
      url: uploadResult.url,
    });
  } catch (error: any) {

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
