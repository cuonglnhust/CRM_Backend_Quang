import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        callback(null, true);
    }
}));

app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true
}));
app.use(bodyParser.json({ limit: '500mb' }));

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../build')))

// Setup middlewares
import { isIP } from 'net';
app.use((req, res, next) => {
    if (isIP(req.hostname) == 0) {
        req.baseUri = req.protocol + '://' + req.hostname + '/';
    } else {
        if (!req.secure) {
            let port = app.get('port');
            req.baseUri = req.protocol + '://' + req.hostname + (port == 80 ? '' : (':' + port)) + '/';
        } else {
            let port = app.get('https_port');
            req.baseUri = req.protocol + '://' + req.hostname + (port == 443 ? '' : (':' + port)) + '/';
        }
    }
    next();
});

// Setup other routes
app.use('/api', routes);

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

export default app;