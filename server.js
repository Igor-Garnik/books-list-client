const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const authHeader = "x-auth-token";
const authToken = "bad18eba1ff45jk7858b8ae88a77fa30";

server.use(middlewares);
server.use((req, res, next) => {
  if (isAuthorized(req)) {
    conole.info(req)
    next();
  } else {
    res.sendStatus(401);
  }
});

server.use(router);
server.listen(3004);

function isAuthorized(req) {
  const token = req.get(authHeader);
  return token && token === authToken;
}
