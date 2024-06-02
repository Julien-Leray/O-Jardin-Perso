document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        try {
            console.log('Tentative de connexion avec:', { email, password });
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
                console.log('Token stocké:', data.token);
                window.location.href = '/gestion'; // Redirige vers la page admin
            } else {
                const errorData = await response.json();
                console.log('Erreur de connexion:', errorData);
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

// Fonction pour obtenir le jeton depuis localStorage
function getToken() {
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token);
    return token;
}

// Fonction pour faire une requête avec le jeton JWT
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token) {
        console.error('Pas de jeton trouvé');
        throw new Error('No token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    console.log('En-têtes envoyés:', headers); // Log des en-têtes

    const response = await fetch(url, {
        ...options,
        headers
    });

    console.log('Réponse de la requête avec jeton:', response);

    if (response.status === 401) {
        alert('Non autorisé, veuillez vous connecter.');
        window.location.href = '/';
    }

    return response;
}

// Exemple d'utilisation pour accéder à une route protégée
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = getToken();
        if (token) {
            console.log('Token trouvé:', token);
            const response = await fetchWithAuth('/gestion');
            if (response.ok) {
                console.log('Accès autorisé à la page admin');
            } else {
                console.error('Accès refusé à la page admin', response);
            }
        } else {
            console.log('Pas de jeton trouvé, redirection vers la page de connexion');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});