function addCORS(res, origin, options) {
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', options.methods);
  res.header('Access-Control-Allow-Headers', options.headers);
  res.header('Access-Control-Allow-Credentials', options.cerdentials);
}

module.exports = function(options) {

  var logger = options.logger;
  options.methods = options.methods || 'GET,PUT,POST,DELETE,PATCH';
  options.headers = options.headers || 'authorization, Origin, X-Requested-With, Content-Type, Accept';
  options.cerdentials = options.cerdentials || 'true';

  (function checkOrigin() {
    if (typeof options.origin == 'string' && options.origin == '*') {
      logger && logger.warn('Allowing access to all domains')
    }
  })()

  return function(req, res, next) {
    var origin = null;

    if (origin instanceof RegExp) {
      var requestOrigin = req.headers.origin;
      if (origin.test(requestOrigin)) {
        addCORS(res, requestOrigin, options);
      }
    } else if (typeof origin == 'string') {
      addCORS(res, origin, options);
    }

    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }

  }

}
