const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://upload-service:8080/', // needs to be 8080 to work within docker
            pathRewrite: {
                '^/api': '',
            },
        })
    );
};
