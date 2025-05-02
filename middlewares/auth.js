const adminAuth = (req, res, next) => {
  console.log("Auth middleware being checked!!!");
  const token = "xyz";
  const isAuthorised = token === "xyz";
  if (!isAuthorised) {
    res.status(401).send("Not authorised!");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
