import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const userId = user?.id || user?._id;

  const token = jwt.sign(
    { id: userId, role: user?.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    httpOnly: true, //prevent client side js from accessing the cookie
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV !== "development", //only send cookie over https in production
  });

  return token;
};
