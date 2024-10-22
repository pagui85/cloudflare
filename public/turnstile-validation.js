<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Turnstile Auto-Redirect</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .message {
            display: none; /* Hide the message initially */
            color: red; /* Optional: Make the message red */
        }
    </style>
</head>
<body>
    <h3>Forwarding to album</h3>
    <div class="cf-turnstile" data-sitekey="0x4AAAAAAAyIrl4uZ9JdEYxp"></div>
    <div class="message" id="message">Please complete the verification.</div>

    <script>
        window.onload = function () {
            const turnstileElement = document.querySelector('.cf-turnstile');

            turnstileElement.addEventListener('turnstile:success', function (event) {
                const token = event.detail.response;
                console.log('Turnstile success:', token);

                if (token) {
                    // Send the token to the server for validation
                    fetch('/validate-turnstile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ token: token })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Redirect to the desired URL
                            window.location.href = 'https://photos.app.goo.gl/dpKuuSvA2pESKoGw7';
                        } else {
                            document.getElementById('message').style.display = 'block';
                        }
                    })
                    .catch(error => {
                        console.error('Error during validation:', error);
                        document.getElementById('message').style.display = 'block';
                    });
                }
            });

            turnstileElement.addEventListener('turnstile:error', function () {
                console.log('Turnstile error');
                document.getElementById('message').style.display = 'block';
            });

            console.log('Turnstile script loaded and listeners added.');
        };
    </script>
</body>
</html>
