const dbDAO = require("./databaseDAO");

const JwtStrategy = require("passport-jwt").Strategy;
const opts = {};
opts.jwtFromRequest = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.auth_token;
  }
  return token;
};
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

// jwt_payload is the decrypted token and it contains the user id
// the func makes a call to the db and confirms the user exists
module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
  dbDAO
    .getUserByID(jwt_payload.id)
    .then(function (user) {
      if (user) {
        // we dont want to return all the user's data. only return what's required
        return done(null, { id: user.id });
      } else {
        // The token is valid but the id in the token doesn't correspond to a user in the db
        // e.g., the user deletes their account but the cookie is still in the browser
        return done(null, false);
      }
    })
    .catch((err) => done(err));
});
