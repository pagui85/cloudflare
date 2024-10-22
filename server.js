const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = '0x4AAAAAAAyJkJ3rb6RkrtLOVEqQ48O73ro';

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
    console.log("Verification route hit");

    const responseKey = req.body['cf-turnstile-response'];
    console.log("Response Key:", responseKey);
    const remoteIP = req.ip;

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${SECRET_KEY}&response=${responseKey}&remoteip=${remoteIP}`
    });

    const data = await response.json();
    console.log("Verification result:", data);

    res.json(data);  // Ensure JSON response to the client
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
