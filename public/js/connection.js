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
                window.location.href = '/gestion'; // Redirige vers la page gestion
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

function getToken() {
    return localStorage.getItem('token');
}

async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token) {
        console.error('No token found');
        throw new Error('No token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        alert('Unauthorized, please log in again.');
        window.location.href = '/';
    }

    return response;
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetchWithAuth('/gestion');
        if (response.ok) {
            console.log('Accès autorisé à la page admin');
        } else {
            console.error('Accès refusé à la page admin');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});
