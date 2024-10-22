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
