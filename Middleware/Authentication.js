const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  // const token = req.signedCookies.token;
  const token = req.headers["x-access-token"];
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
};
const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError("Unauthorized to acess");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermission,
};
