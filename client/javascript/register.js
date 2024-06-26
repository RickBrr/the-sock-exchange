document.getElementById('registerButton').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    console.log('Name: ' + name);
    console.log('Email address: ' + email);

    fetch("https://ecs.the-sock-exchange.com/api/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'name': name, "email": email}),
    })
    .then(response => response.json())
    .then(data => console.log('POST:', data))
    .catch((error) => console.error('Error:', error));

});