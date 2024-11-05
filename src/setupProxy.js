const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1/search',
    createProxyMiddleware({
      target: 'https://openapi.naver.com',
      changeOrigin: true,
      pathRewrite: {
        '^/v1/search': '/v1/search',
      },
    })
  );
};