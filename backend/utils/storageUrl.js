const DEFAULT_SUPABASE_BUCKET = "uploads";

const normalizeBaseUrl = (url) => url?.trim().replace(/\/$/, "");

const getPublicStorageBaseUrl = () => {
  const supabaseUrl = normalizeBaseUrl(process.env.SUPABASE_URL);

  if (!supabaseUrl) return "";

  return `${supabaseUrl}/storage/v1/object/public/${DEFAULT_SUPABASE_BUCKET}`;
};

export const resolvePublicStorageUrl = (image, folder, fallback = "") => {
  const rawImage = image?.trim();

  if (!rawImage) return fallback;

  const publicStorageBaseUrl = getPublicStorageBaseUrl();

  if (/^https?:\/\//i.test(rawImage)) {
    try {
      const url = new URL(rawImage);
      const marker = `/storage/v1/object/public/${DEFAULT_SUPABASE_BUCKET}/`;
      const markerIndex = url.pathname.indexOf(marker);

      if (publicStorageBaseUrl && markerIndex >= 0) {
        const storagePath = decodeURIComponent(
          url.pathname.slice(markerIndex + marker.length),
        );

        return `${publicStorageBaseUrl}/${encodeURI(storagePath)}`;
      }
    } catch {
      return rawImage;
    }

    return rawImage;
  }

  if (!publicStorageBaseUrl) return fallback;

  const imagePath = rawImage.startsWith(`${folder}/`)
    ? rawImage
    : `${folder}/${rawImage}`;

  return `${publicStorageBaseUrl}/${encodeURI(imagePath)}`;
};
