async function uploadImage(file) {
  // Check type of file
  if (!file || typeof file !== "object") {
    console.log("Invalid file when uploading to Cloudinary");
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", "paulto-porfolio");

  const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Cloudinary error:", errorData);
  }

  const data = await response.json();
  return { secure_url: data.secure_url, public_id: data.public_id };
}

// Upload multiple images
async function uploadImages(files) {
  const promises = Array.from(files).map((file) => uploadImage(file));
  return Promise.all(promises);
}

// Function to delete image use URL out of Cloundinary
async function deleteImage(publicId) {
  let res;
  try {
    res = await fetch("/.netlify/functions/delete-cloudinary-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: publicId }),
    });
  } catch (error) {
    console.error("Error deleting image from Cloudinary: ", error);
  }
  return {
    success: res.ok,
    data: await res.json(),
  };
}

export { uploadImage, deleteImage, uploadImages };
