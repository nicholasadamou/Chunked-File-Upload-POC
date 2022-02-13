const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://localhost:82/', // needs to be upload-service:8080 to work within docker
            pathRewrite: {
                '^/api': '',
            },
        })
    );
};
