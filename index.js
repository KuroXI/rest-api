const express = require('express');
const app = express();

// Addons
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const apiCache = require('apicache');

const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(apiCache.middleware('5 minutes'));

// Only apply the rate limit to API calls
app.use('/api', slowDown({
    windowMs: 60 * 1000,
    delayAfter: 100,
    delayMs: 1000,
    headers: true,
}));

// Timeouts
app.use((req, res, next) => {
    req.setTimeout(5000, () => {
        res.status(408).send("Request timed out")
    });
    next();
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ status: err.status || 500, message: err.message });
});

app.get('/test', (req, res) => {
    new Promise((resolve) => setTimeout(() => resolve("Resolved"), 10000));
    res.status(200).send({
        test: 'Yea its working'
    })
});

app.listen(PORT, () => console.log(`Listening to port : ${PORT}`)); 