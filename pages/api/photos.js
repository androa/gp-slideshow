import jwt from "next-auth/jwt";

const secret = process.env.SECRET || "abba";

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  if (token) {
    // Signed in
    return fetch("https://photoslibrary.googleapis.com/v1/mediaItems", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
      .then((res) => res.json())
      .then((data) => res.json(data));
  } else {
    // Not Signed in
    res.status(401);
  }
};
