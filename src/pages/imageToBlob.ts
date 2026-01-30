export const base64ToBlobUrl = (base64: string, mimeType = "image/png") => {
  // If the base64 has a prefix, extract it
  const hasPrefix = base64.startsWith("data:");

  let byteString;
  let actualMimeType = mimeType;

  if (hasPrefix) {
    const parts = base64.split(",");
    base64 = parts[1];
    actualMimeType = parts[0].split(":")[1].split(";")[0];
  }

  // 🔑 Clean up the base64 before decoding
  base64 = base64.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");

  // 🔑 Fix padding (Base64 length must be multiple of 4)
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  try {
    byteString = atob(base64);
  } catch (err) {
    console.error("Invalid base64 string:", err, base64);
    return null;
  }

  // Convert to Uint8Array
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: actualMimeType });
  return URL.createObjectURL(blob);
};
