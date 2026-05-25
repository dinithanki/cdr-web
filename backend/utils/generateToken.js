import jwt from "jsonwebtoken";

export const getAuthCookieOptions = () => {
  const isProductionLike =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.RENDER) ||
    (process.env.FRONTEND_URL || process.env.CLIENT_URL)?.startsWith(
      "https://",
    );

  return {
    httpOnly: true,
    sameSite: isProductionLike ? "none" : "lax",
    secure: isProductionLike,
    path: "/",
  };
};

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
    ...getAuthCookieOptions(),
  });

  return token;
};
