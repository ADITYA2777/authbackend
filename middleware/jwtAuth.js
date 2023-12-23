

const JWT = require("jsonwebtoken");

// router level middleware function
const jwtAuth = (req, res, next) => {
  // get cookie token(jwt token generated using json.sign()) form the request
  const token = (req.cookies && req.cookies.token) || null;

  // return response if there is no token(jwt token attached with cookie)
  if (!token) {
    return res.status(400).json({ success: false, message: "NOT authorized" });
  }

  // verify the token
  try {
    const payload = JWT.verify(token, process.env.SECRET);
    req.user = { id: payload.id, email: payload.email };
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
  next();
};

module.exports = jwtAuth;
