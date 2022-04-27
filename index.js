const express = require('express');
const app = express();
const port = 3000;
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message: 'Muitas requisições desse IP, tente novamente mais tarde',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use('/api/', limiter)

app.post('/test', limiter, (req, res) => {
    res.send("Teste")
})

app.listen(port, () => {
    console.log("Rodando...");
})