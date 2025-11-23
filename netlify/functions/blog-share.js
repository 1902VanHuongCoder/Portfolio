/* eslint-disable no-undef */
const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

exports.handler = async function (event) {
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return { statusCode: 400, body: "Missing blog id" };
  }

  const docRef = db.collection("blogPosts").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return { statusCode: 404, body: "Blog not found" };
  }

  const blog = docSnap.data();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta property="og:title" content="${blog.title}" />
      <meta property="og:description" content="${
        blog.description || blog.title
      }" />
      <meta property="og:image" content="${blog.image}" />
      <meta property="og:url" content="https://yourdomain.netlify.app/blogs/${id}" />
      <meta property="og:type" content="article" />
      <title>${blog.title}</title>
      <script>
        // Redirect real users to the SPA blog page
        if (window.location.search.indexOf('fbclid') === -1) {
          window.location.replace('/blogs/${id}');
        }
      </script>
    </head>
    <body>
      <p>Redirecting...</p>
    </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html,
  };
};
