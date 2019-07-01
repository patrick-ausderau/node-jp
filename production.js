module.exports = (app, port) => {
  console.log('production server on:', port);
  app.enable('trust proxy');

  app.listen(port);
};

const redirect = (app) => {
app.use((req, res, next) => {
    if (req.secure) {
      console.log('req secure, nothing to do');
      next();
    } else {
      console.log('req unsecure, force redirect');
      const proxypath = process.env.PROXY_PASS || '' 
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });
}
 
