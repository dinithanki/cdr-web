import { supabase } from "../config/supabase.js";

const BUCKET = "uploads";

// core reusable function
const uploadToSupabase = async (file, folder = "") => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

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