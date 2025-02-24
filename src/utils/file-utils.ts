export function isBase64DataURL(dataURL: string) {
  if (typeof dataURL !== "string") return false;
  const base64Match = dataURL.match(/^data:[^;]+;base64,([^,]+)$/);

  if (base64Match) {
    const base64Data = base64Match[1];

    try {
      atob(base64Data);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

async function convertUrlToBlob(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error converting image URL to Blob:", error);
    return null;
  }
}

export function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    if (blob instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    } else {
      convertUrlToBlob(blob).then((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        }
      });
    }
  });
}
