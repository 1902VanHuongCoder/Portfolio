/* eslint-disable no-undef */
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Use Cloudinary Search API to get all images in the folder
    const result = await cloudinary.search
      .expression("folder:paulto-porfolio")
      .max_results(100)
      .execute();
    return {
      statusCode: 200,
      body: JSON.stringify(result.resources),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
