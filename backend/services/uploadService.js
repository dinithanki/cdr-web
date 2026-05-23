import { supabase } from "../config/supabase.js";
import crypto from "crypto";

const BUCKET = "uploads";
let bucketReadyPromise;

const sanitizeFileName = (fileName = "upload") =>
  fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const ensureStorageConfig = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase storage environment variables are missing");
  }
};

const ensureBucketReady = async () => {
  ensureStorageConfig();

  if (!bucketReadyPromise) {
    bucketReadyPromise = (async () => {
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();

      if (listError) {
        throw new Error(`Supabase bucket check failed: ${listError.message}`);
      }

      const bucket = buckets?.find((item) => item.name === BUCKET);

      if (!bucket) {
        const { error: createError } = await supabase.storage.createBucket(
          BUCKET,
          {
            public: true,
            fileSizeLimit: "5MB",
          },
        );

        if (createError) {
          throw new Error(
            `Supabase bucket creation failed: ${createError.message}`,
          );
        }

        return;
      }

      if (!bucket.public) {
        const { error: updateError } = await supabase.storage.updateBucket(
          BUCKET,
          {
            public: true,
            fileSizeLimit: "5MB",
          },
        );

        if (updateError) {
          throw new Error(
            `Supabase bucket public access update failed: ${updateError.message}`,
          );
        }
      }
    })().catch((error) => {
      bucketReadyPromise = null;
      throw error;
    });
  }

  return bucketReadyPromise;
};

// core reusable function
const uploadToSupabase = async (file, folder = "") => {
  if (!file) {
    throw new Error("No image file was provided");
  }

  if (!file.mimetype?.startsWith("image/")) {
    throw new Error("Only image uploads are allowed");
  }

  await ensureBucketReady();

  const fileName = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(
    file.originalname,
  )}`;

  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
};

// ✅ PROFILE IMAGE
export const uploadProfileImage = (file) => {
  return uploadToSupabase(file, "users");
};

// ✅ PRODUCT IMAGE
export const uploadProductImage = (file) => {
  return uploadToSupabase(file, "products");
};
