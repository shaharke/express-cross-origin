function addCORS(res, origin, options) {
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', options.methods.join(','));
  res.header('Access-Control-Allow-Headers', options.headers.join(','));

  if (options.credentials) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }

}

module.exports = function(options) {
  var logger = options.logger;
  options.methods = options.methods || ['GET','PUT','POST','DELETE','PATCH'];
  options.headers = options.headers || ['authorization', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'];

  if (options.cerdentials) {
    logger && logger.warn('"cerdentials" was a typo in the original code. We will continue to support the typo form for a couple of versions, but you should really use the correct form.');
    options.credentials = options.cerdentials
  }
  options.credentials = options.credentials || true;

  (function checkOrigin() {
    if (typeof options.origin == 'string' && options.origin == '*' && logger) {
      logger.warn('Allowing access to all domains');
    }
  })();

  return function(req, res, next) {
    var requestOrigin = req.headers.origin;
    if (options.origin instanceof RegExp && options.origin.test(requestOrigin)) {
      addCORS(res, requestOrigin, options);
    } else if(options.origin instanceof Array && options.origin.indexOf(requestOrigin) > -1) {
      addCORS(res, requestOrigin, options);
    } else if (typeof options.origin == 'string') {
      addCORS(res, options.origin, options);
    }

    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }

  };

};
