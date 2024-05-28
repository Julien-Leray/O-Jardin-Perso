let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    function showUserForm() {
        fetchUsers();
    }
});

async function fetchUsers() {
    try {
        const response = await fetch('users');
        const users = await response.json();

        if (!Array.isArray(users)) {
            throw new Error('La réponse n\'est pas un tableau.');
        }

        const usersTableBody = document.querySelector('#usersTable tbody');
        usersTableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>
                    <button onclick="editUser(${user.id})">Modifier</button>
                    <button onclick="confirmDeleteUser(${user.id})">Supprimer</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        hideAllSections();
        document.getElementById('usersSection').style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
}

function showUserForm() {
    currentUserId = null;
    clearUserDetails();
    document.getElementById('userFormSection').style.display = 'block';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('saveNewButton').style.display = 'inline-block';
    document.getElementById('saveEditButton').style.display = 'none';
}

function hideUserForm() {
    document.getElementById('userFormSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'block';
}

async function editUser(userId) {
    currentUserId = userId;
    await fetchUserDetails(userId);
    document.getElementById('userFormSection').style.display = 'block';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('saveNewButton').style.display = 'none';
    document.getElementById('saveEditButton').style.display = 'inline-block';
}

async function fetchUserDetails(userId) {
    try {
        const response = await fetch(`users/${userId}`);
        const user = await response.json();

        if (user) {
            currentUserId = user.id;
            document.getElementById('userId').value = user.id;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userFirstname').value = user.firstname;
            document.getElementById('userLastname').value = user.lastname;
            document.getElementById('userAddress').value = user.address;
            document.getElementById('userZipCode').value = user.zip_code;
            document.getElementById('userCity').value = user.city;
            document.getElementById('userWateringAlert').checked = user.watering_alert;
            document.getElementById('userForecastAlert').checked = user.forecast_alert;
            document.getElementById('userCreatedAt').value = formatDate(user.created_at);
            document.getElementById('userUpdatedAt').value = formatDate(user.updated_at);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur :', error);
    }
}

async function saveNewUser() {
    const email = document.getElementById('userEmail').value;
    const firstname = document.getElementById('userFirstname').value;
    const lastname = document.getElementById('userLastname').value;
    const password = document.getElementById('userPassword').value;
    const address = document.getElementById('userAddress').value;
    const zip_code = document.getElementById('userZipCode').value;
    const city = document.getElementById('userCity').value;
    const watering_alert = document.getElementById('userWateringAlert').checked;
    const forecast_alert = document.getElementById('userForecastAlert').checked;

    const user = {
        email,
        firstname,
        lastname,
        password,
        address,
        zip_code,
        city,
        watering_alert,
        forecast_alert
    };

    try {
        const response = await fetch('users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert("Utilisateur ajouté avec succès");
            hideUserForm();
            fetchUsers();
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout de l'utilisateur : " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    }
}

async function saveEditUser() {
    const userId = document.getElementById('userId').value;
    const email = document.getElementById('userEmail').value;
    const firstname = document.getElementById('userFirstname').value;
    const lastname = document.getElementById('userLastname').value;
    const password = document.getElementById('userPassword').value;
    const address = document.getElementById('userAddress').value;
    const zip_code = document.getElementById('userZipCode').value;
    const city = document.getElementById('userCity').value;
    const watering_alert = document.getElementById('userWateringAlert').checked;
    const forecast_alert = document.getElementById('userForecastAlert').checked;

    const user = {
        firstname,
        lastname,
        password,
        address,
        zip_code,
        city,
        watering_alert,
        forecast_alert
    };

    try {
        const response = await fetch(`users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert("Utilisateur mis à jour avec succès");
            hideUserForm();
            fetchUsers();
        } else {
            const errorText = await response.text();
            alert("Erreur lors de la mise à jour de l'utilisateur : " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    }
}

async function confirmDeleteUser(userId) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmation) {
        deleteUser(userId);
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Utilisateur supprimé avec succès");
            fetchUsers();
        } else {
            alert("Erreur lors de la suppression de l'utilisateur");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    }
}

function clearUserDetails() {
    document.getElementById('userId').value = "";
    document.getElementById('userEmail').value = "";
    document.getElementById('userFirstname').value = "";
    document.getElementById('userLastname').value = "";
    document.getElementById('userPassword').value = "";
    document.getElementById('userAddress').value = "";
    document.getElementById('userZipCode').value = "";
    document.getElementById('userCity').value = "";
    document.getElementById('userWateringAlert').checked = false;
    document.getElementById('userForecastAlert').checked = false;
    document.getElementById('userCreatedAt').value = "";
    document.getElementById('userUpdatedAt').value = "";
}
