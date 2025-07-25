import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/app/(microestate)/lib/imagekit";
import { requireAuth } from "@/app/(microestate)/lib/authorize";

export const POST = requireAuth(
  async (
    request: NextRequest,
    context: { userId: string; userRole: string; userEmail: string }
  ) => {
    try {
      const { userId, userRole } = context;

      console.log(
        "📸 File upload request from user:",
        userId,
        "Role:",
        userRole
      );

      const formData = await request.formData();

      // Handle both single file and multiple files
      const files = formData.getAll("file") as File[];
      const images = formData.getAll("images") as File[];
      const documents = formData.getAll("documents") as File[];

      // Get upload configuration from form data
      const uploadType = (formData.get("uploadType") as string) || "general"; // property, profile, document, general
      const folder = (formData.get("folder") as string) || null;
      const watermark = (formData.get("watermark") as string) || "false";
      const resize = (formData.get("resize") as string) || "true";
      const maxWidth = parseInt(formData.get("maxWidth") as string) || 800;
      const maxHeight = parseInt(formData.get("maxHeight") as string) || 600;

      // Combine all file arrays
      const allFiles = [...files, ...images, ...documents].filter(
        (file) => file instanceof File
      );

      if (!allFiles || allFiles.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "No files provided",
          },
          { status: 400 }
        );
      }

      console.log(
        `📸 Processing ${allFiles.length} files for upload type: ${uploadType}`
      );

      // File type configurations
      const fileTypeConfigs = {
        image: {
          extensions: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"],
          maxSize: 10 * 1024 * 1024, // 10MB
          folder: "images",
        },
        document: {
          extensions: ["pdf", "doc", "docx", "txt", "rtf"],
          maxSize: 50 * 1024 * 1024, // 50MB
          folder: "documents",
        },
        video: {
          extensions: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
          maxSize: 100 * 1024 * 1024, // 100MB
          folder: "videos",
        },
        audio: {
          extensions: ["mp3", "wav", "ogg", "m4a", "aac"],
          maxSize: 25 * 1024 * 1024, // 25MB
          folder: "audio",
        },
        general: {
          extensions: [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "pdf",
            "doc",
            "docx",
            "txt",
            "mp4",
            "mp3",
          ],
          maxSize: 50 * 1024 * 1024, // 50MB
          folder: "general",
        },
      };

      // Upload type specific configurations
      const uploadConfigs = {
        property: {
          baseFolder: "properties",
          watermarkText: "100Gaj",
          resize: true,
          allowedTypes: ["image"],
        },
        profile: {
          baseFolder: "profiles",
          watermarkText: null,
          resize: true,
          allowedTypes: ["image"],
        },
        document: {
          baseFolder: "documents",
          watermarkText: null,
          resize: false,
          allowedTypes: ["document", "image"],
        },
        verification: {
          baseFolder: "verification",
          watermarkText: "100Gaj - Verification",
          resize: true,
          allowedTypes: ["image", "document"],
        },
        general: {
          baseFolder: "uploads",
          watermarkText: null,
          resize: false,
          allowedTypes: ["image", "document", "video", "audio", "general"],
        },
      };

      const config =
        uploadConfigs[uploadType as keyof typeof uploadConfigs] ||
        uploadConfigs.general;

      const uploadPromises = allFiles.map(async (file, index) => {
        try {
          // Validate file
          if (!file.name) {
            throw new Error("Invalid file name");
          }

          const extension = file.name.split(".").pop()?.toLowerCase();
          if (!extension) {
            throw new Error("File must have an extension");
          }

          // Determine file type
          let fileType = "general";
          for (const [type, typeConfig] of Object.entries(fileTypeConfigs)) {
            if (typeConfig.extensions.includes(extension)) {
              fileType = type;
              break;
            }
          }

          // Check if file type is allowed for this upload type
          if (!config.allowedTypes.includes(fileType as any)) {
            throw new Error(
              `File type '${fileType}' not allowed for upload type '${uploadType}'`
            );
          }

          const typeConfig =
            fileTypeConfigs[fileType as keyof typeof fileTypeConfigs];

          // Validate file extension
          if (!typeConfig.extensions.includes(extension)) {
            throw new Error(
              `Invalid file type. Only ${typeConfig.extensions.join(
                ", "
              )} are allowed for ${fileType} files`
            );
          }

          // Validate file size
          if (file.size > typeConfig.maxSize) {
            const maxSizeMB = (typeConfig.maxSize / (1024 * 1024)).toFixed(1);
            throw new Error(
              `File size too large. Maximum ${maxSizeMB}MB allowed for ${fileType} files`
            );
          }

          // Convert file to buffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // Generate folder path
          const baseFolder =
            folder || `${config.baseFolder}/${userRole}s/${userId}`;
          const fileTypeFolder = `${baseFolder}/${typeConfig.folder}`;

          // Generate unique filename
          const timestamp = Date.now();
          const sanitizedOriginalName = file.name.replace(
            /[^a-zA-Z0-9.-]/g,
            "_"
          );
          const uniqueFileName = `${uploadType}_${timestamp}_${
            index + 1
          }_${sanitizedOriginalName}`;

          console.log(
            `📸 Uploading: ${file.name} as ${uniqueFileName} to ${fileTypeFolder}`
          );

          // Prepare upload options
          const uploadOptions: any = {
            file: buffer,
            fileName: uniqueFileName,
            folder: fileTypeFolder,
            useUniqueFileName: true,
            tags: [uploadType, fileType, userRole, userId],
          };

          // Add transformations for images
          if (fileType === "image") {
            const transformations: any = {};

            // Add watermark if enabled
            if (watermark === "true" && config.watermarkText) {
              transformations.pre = `l-text,i-${encodeURIComponent(
                config.watermarkText
              )},fs-50,l-end`;
            }

            // Add resize if enabled
            if (resize === "true" && config.resize) {
              transformations.post = [
                {
                  type: "transformation",
                  value: `w-${maxWidth},h-${maxHeight},c-maintain_ratio`,
                },
              ];
            }

            if (Object.keys(transformations).length > 0) {
              uploadOptions.transformation = transformations;
            }
          }

          // Upload to ImageKit
          const uploadResult = await imagekit.upload(uploadOptions);

          console.log(`✅ Successfully uploaded: ${uploadResult.url}`);

          return {
            success: true,
            url: uploadResult.url,
            fileId: uploadResult.fileId,
            fileName: uploadResult.name,
            originalName: file.name,
            fileType: fileType,
            size: file.size,
            thumbnailUrl: uploadResult.thumbnailUrl,
            folder: fileTypeFolder,
            uploadType: uploadType,
            mimeType: file.type,
          };
        } catch (uploadError: any) {
          console.error(
            `❌ Failed to upload ${file.name}:`,
            uploadError.message
          );
          return {
            success: false,
            error: uploadError.message,
            originalName: file.name,
            fileType: fileType,
          };
        }
      });

      const results = await Promise.all(uploadPromises);

      // Separate successful uploads from failures
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      console.log(
        `📸 Upload complete: ${successful.length} successful, ${failed.length} failed`
      );

      if (successful.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "All file uploads failed",
            details: failed.map((f) => f.error),
            failed: failed,
          },
          { status: 400 }
        );
      }

      // Return results
      const response = {
        success: true,
        message: `${successful.length} file(s) uploaded successfully`,
        count: successful.length,
        files: successful,
        uploadType: uploadType,
        ...(failed.length > 0 && {
          warnings: `${failed.length} file(s) failed to upload`,
          failed: failed,
        }),
      };

      // For single file upload, also return the URL directly for backward compatibility
      if (successful.length === 1) {
        response.url = successful[0].url;
        response.fileId = successful[0].fileId;
      }

      return NextResponse.json(response);
    } catch (error: any) {
      console.error("❌ File upload error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "File upload failed",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
);
