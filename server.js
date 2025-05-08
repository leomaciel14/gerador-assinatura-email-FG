const cors_proxy = require('cors-anywhere');

const host = 'localhost';
const port = 8080;

cors_proxy.createServer({
    originWhitelist: [], // Libera todas as origens
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
    console.log(`Servidor proxy com CORS rodando em http://${host}:${port}/`);
});
