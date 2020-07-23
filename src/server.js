require('dotenv').config()
import http from 'http';
import app from './app';

const HTTP_PORT = normalizePort(process.env.PORT || 8000);
app.set('port', HTTP_PORT);
 http.createServer(app).listen(HTTP_PORT, onListening);

function onListening() {
    let addr = this.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Web server listening on ' + bind);
}

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val;            
    if (port >= 0) return port;             
    return false;
}
