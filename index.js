const express = require('express');
const app = express();
const port = 3000;
const JSONdb = require('simple-json-db');
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message: 'Muitas requisições desse IP, tente novamente mais tarde',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	handler: (request, response, next, options) => {

		let blockedUsers = db.get('blockedUsers')

		if(blockedUsers) {
			console.log("já tem, adicionando ao array")
			let data = {
				email: request.body.email,
				username: request.body.username,
				ip: request.ip
			}


			let index = blockedUsers.findIndex(x => x.email==request.body.email);
			index === -1 ? blockedUsers.push(data) : console.log("object already exists")

			// blockedUsers.push(data)
			db.set("blockedUsers", blockedUsers);
			
		} else {
			console.log("não tem, criando novo array")
			db.set("blockedUsers", [
				{
					email: request.body.email,
					username: request.body.username,
					ip: request.ip
				}
			])
		}
		response.status(options.statusCode).send(options.message)
	}
})
const db = new JSONdb('./storage.json');

app.use(express.json());
app.use('/api/', limiter)

app.post('/test', limiter, (req, res) => {
	res.send("Teste")
})

app.listen(port, () => {
    console.log("Rodando...");
})