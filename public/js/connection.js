document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        try {
            console.log(`Tentative de connexion avec : email: '${email}', password: '${password}'`);

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Réponse de la connexion:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Données reçues:', data);
                localStorage.setItem('token', data.token);
                console.log('Token stocké:', data.token);  // Stocke le jeton dans localStorage

                // Récupérer les informations de l'utilisateur
                const userResponse = await fetch('/api/me/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    document.getElementById('username').textContent = userData.firstname;
                    document.getElementById('loginForm').style.display = 'none';

                    // Affiche le contenu authentifié
                    document.getElementById('authenticatedContent').style.display = 'block';
                    document.getElementById('authenticatedContentGestion').style.display = 'block';
                    
                } else {
                    alert('Erreur lors de la récupération des informations utilisateur.');
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Une erreur est survenue lors de la connexion.');
        }
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token'); // Supprime le jeton du localStorage
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authenticatedContent').style.display = 'none';
    document.getElementById('authenticatedContentGestion').style.display = 'none';
    alert('Vous avez été déconnecté.');
});
