const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use('/api', router);

require('./service/route.js')(app, router);

app.set('port', port);
app.set('trust proxy', true);
app.listen(app.get('port'));
console.log(`Server listening on port ${port}`);

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
        console.log('error:', error);
        console.log('invalid json sent. caught a json parser error');
        res.status(400).json({ status: 400, error: 'invalid json sent' });
    } else {
        console.log("STARTED")
        next();
    }
});

