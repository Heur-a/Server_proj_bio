const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
    target: 'https://api.openaq.org',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/v2'  // Redirige /api a /v2
    }
}));

app.listen(3000, () => {
    console.log('Proxy server running on http://localhost:3000');
});
