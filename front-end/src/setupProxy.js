const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://upload-service:82/',
            pathRewrite: {
                '^/api': '',
            },
        })
    );
};
