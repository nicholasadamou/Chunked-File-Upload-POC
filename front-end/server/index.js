const express = require('express');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path');
const expressWinston = require('express-winston');
const winston = require('winston');
const frameguard = require('frameguard');
const csp = require('helmet-csp');

const routes = require('./routes');

//=====================================================
// INITIALIZATION

require('dotenv').config();

const app = express();

//=====================================================
// LOGGING

const logger = winston.createLogger({})
logger.add(new winston.transports.Console())

app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console()
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.json()
	)
}));

//=====================================================
// CONFIGURATION

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

const UPLOAD_SERVICE = `${process.env.UPLOAD_SERVICE_HOST}:${process.env.UPLOAD_SERVICE_PORT}`;
logger.info(`UPLOAD_SERVICE: ${UPLOAD_SERVICE}`);

//=====================================================
// MIDDLEWARE

const proxyErrorHandler = (error, request, response) => {
	switch (error && error.code) {
		case 'ECONNRESET': return response.status(504).send('Time Out');
		case 'ECONNREFUSED': return response.status(502).send();
		case 'ENOTFOUND': return response.status(404).send();
		default: return response.status(500).send('An unexpected error has occurred');
	}
}

app.use('/', express.static(path.join(__dirname, '..', 'build')))
app.use('/dist', express.static(path.join(__dirname, '..', 'build')))

// The X-Frame-Options header tells browsers to prevent your web-page from being
// put in an iframe. When browsers load iFrames, they’ll check the
// value of the X-Frame-Options header and abort loading if it’s not allowed.
// X-Frame-Options: DENY will prevent anyone from putting this page in an iframe.
app.use(frameguard({ action: 'deny' }))

// The Content-Security-Policy header is used for specifying content-related policies.
// This includes the frame-ancestors policy which is used to prevent click-jacking.
// The frame-ancestors directive of none is roughly equal to X-Frame-Options: DENY.
app.use(
	csp({
		directives: {
			defaultSrc: ["'self'"],
			frameAncestors: ["'none'"],
		},
	}),
)

app.use('/', routes)

app.use(
	'/api',
	createProxyMiddleware({
		target: UPLOAD_SERVICE,
		changeOrigin: true,
		pathRewrite: {
			'^/api': '',
		},
		secure: false,
		setHeaders(res, path, stat) {
			res.set('Content-Type', 'application/json')
			res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
			res.set('Pragma', 'no-cache')
			res.set('Expires', '0')
		},
		onError: proxyErrorHandler
	}),
)

//=====================================================

const httpserver = http.createServer(app)
httpserver.listen(PORT, () => logger.info(`Server Running on port ${PORT}`))
