const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/validate-turnstile', async (req, res) => {
    const token = req.body.token;
    const secretKey = '0x4AAAAAAAyIrtgD2fX2JGJt4H2PCFSMkcE'; // Replace with your secret key

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `secret=${secretKey}&response=${token}`
        });

        const data = await response.json();
        console.log('Validation response:', data);

        if (data.success) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: data['error-codes'] });
        }
    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
