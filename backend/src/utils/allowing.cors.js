export const allowingCors = (req, res, next) => {
  // CORS
  // ALLOWING Origin TO BACKEND
  res.setHeader("Access-Control-Allow-Origin", "*");
  // ALLOWING ACCESS TO BACKEN
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // POST, GET, PUT,....
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  // Authorization --> ACCEPT
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
};
