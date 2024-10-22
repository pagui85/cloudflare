const express = require('express');
const bodyParser = require('body-parser');
const turnstilePlugin = require('@cloudflare/pages-plugin-turnstile');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = '0x4AAAAAAAyJkJ3rb6RkrtLOVEqQ48O73ro';

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/verify', turnstilePlugin({ secret: SECRET_KEY }), async (req, res) => {
    const formData = await req.formData();
    const responseKey = formData.get('cf-turnstile-response');
    const remoteIP = req.ip;

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${SECRET_KEY}&response=${responseKey}&remoteip=${remoteIP}`
    });

    res.send('wait')
    const data = await response.json();

    if (data.success) {
        res.send('Verification successful!');
    } else {
        res.send('Verification failed!');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
