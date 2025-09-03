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

  const response = await fetch(
    import.meta.env.VITE_CLOUDINARY_URL,
    {
      method: "POST",
      body: formData,
    }
  );

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
  const response = await fetch(
    `${import.meta.env.VITE_CLOUDINARY_URL}/${publicId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CLOUDINARY_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  const data = await response.json();
  return data.result;
}

export { uploadImage, deleteImage, uploadImages };
