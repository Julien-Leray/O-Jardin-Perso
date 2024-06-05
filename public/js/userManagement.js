
let currentUserId = null;

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
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('La réponse du réseau n\'était pas correcte');
        }

        const user = await response.json();

        if (user) {
            document.getElementById('userIdCreate').value = user.id;
            document.getElementById('userEmailCreate').value = user.email || '';
            document.getElementById('userFirstnameCreate').value = user.firstname || '';
            document.getElementById('userLastnameCreate').value = user.lastname || '';
            document.getElementById('userAddressCreate').value = user.address || '';
            document.getElementById('userZipCodeCreate').value = user.zip_code || '';
            document.getElementById('userCityCreate').value = user.city || '';
            document.getElementById('userWateringAlertCreate').checked = user.watering_alert || false;
            document.getElementById('userForecastAlertCreate').checked = user.forecast_alert || false;
            document.getElementById('userIsAdminCreate').checked = user.is_admin || false;
            document.getElementById('userCreatedAtCreate').value = formatDate(user.created_at) || '';
            document.getElementById('userUpdatedAtCreate').value = formatDate(user.updated_at) || '';
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur :', error);
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
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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

async function saveNewUser() {
    const email = document.getElementById('userEmailCreate').value;
    const firstname = document.getElementById('userFirstnameCreate').value;
    const lastname = document.getElementById('userLastnameCreate').value;
    const password = document.getElementById('userPasswordCreate').value;
    const address = document.getElementById('userAddressCreate').value;
    const zip_code = document.getElementById('userZipCodeCreate').value;
    const city = document.getElementById('userCityCreate').value;

    // Validation de base
    if (!email || !firstname || !lastname || !password) {
        alert("Email, prénom, nom, et mot de passe sont obligatoires.");
        return;
    }

    const user = {
        email,
        firstname,
        lastname,
        password,
    };

    if (address) user.address = address;
    if (zip_code) user.zip_code = zip_code;
    if (city) user.city = city;
    if (document.getElementById('userWateringAlertCreate').checked !== undefined) user.watering_alert = document.getElementById('userWateringAlertCreate').checked;
    if (document.getElementById('userForecastAlertCreate').checked !== undefined) user.forecast_alert = document.getElementById('userForecastAlertCreate').checked;
    if (document.getElementById('userIsAdminCreate').checked !== undefined) user.is_admin = document.getElementById('userIsAdminCreate').checked;

    // Log the user object to see what is being sent
    console.log('Envoi des données utilisateur :', JSON.stringify(user));

    try {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert("Utilisateur ajouté avec succès");
            hideUserForm();
            fetchUsers();
        } else {
            const errorText = await response.text();
            console.error('Réponse d\'erreur du serveur :', errorText);
            alert("Erreur lors de l'ajout de l'utilisateur : " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    }
}

async function saveEditUser() {
    const userId = document.getElementById('userIdCreate').value;
    const email = document.getElementById('userEmailCreate').value;
    const firstname = document.getElementById('userFirstnameCreate').value;
    const lastname = document.getElementById('userLastnameCreate').value;
    const password = document.getElementById('userPasswordCreate').value;
    const address = document.getElementById('userAddressCreate').value;
    const zip_code = document.getElementById('userZipCodeCreate').value;
    const city = document.getElementById('userCityCreate').value;

    // Validation de base
    if (!email || !firstname || !lastname) {
        alert("Email, prénom, et nom sont obligatoires.");
        return;
    }

    const user = {};
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (password) user.password = password;
    if (address) user.address = address;
    if (zip_code) user.zip_code = zip_code;
    if (city) user.city = city;
    if (document.getElementById('userWateringAlertCreate').checked !== undefined) user.watering_alert = document.getElementById('userWateringAlertCreate').checked;
    if (document.getElementById('userForecastAlertCreate').checked !== undefined) user.forecast_alert = document.getElementById('userForecastAlertCreate').checked;
    if (document.getElementById('userIsAdminCreate').checked !== undefined) user.is_admin = document.getElementById('userIsAdminCreate').checked;

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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

function hideUserForm() {
    document.getElementById('userFormSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'block';
    document.getElementById('saveNewButton').style.display = 'inline-block';
    document.getElementById('saveEditButton').style.display = 'none';
}

function showUserForm() {
    document.getElementById('userFormSection').style.display = 'block';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('saveNewButton').style.display = 'inline-block';
    document.getElementById('saveEditButton').style.display = 'none';

    // Effacer le formulaire
    document.getElementById('userForm').reset();
}

async function fetchUsers() {
    hideAllSections(); // Hide all sections before displaying the user section
    try {
        const response = await fetch('/api/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('La réponse du réseau n\'était pas correcte');
        }

        const users = await response.json();
        const usersTableBody = document.getElementById('usersTableBody');
        usersTableBody.innerHTML = ''; // Effacer le contenu actuel du tableau

        users.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td id="userId-${user.id}">${user.id}</td>
                <td id="userEmail-${user.id}">${user.email}</td>
                <td id="userFirstname-${user.id}">${user.firstname}</td>
                <td id="userLastname-${user.id}">${user.lastname}</td>
                <td id="userCreatedAt-${user.id}">${formatDate(user.created_at)}</td>
                <td id="userIsAdmin-${user.id}">${user.is_admin ? 'Oui' : 'Non'}</td>
                <td id="userActions-${user.id}">
                    <button class="save-button" onclick="editUser(${user.id})">Modifier</button>
                    <button class="delete-button" onclick="confirmDeleteUser(${user.id})">Supprimer</button>
                </td>
            `;

            usersTableBody.appendChild(row);
        });

        document.getElementById('usersSection').style.display = 'block'; // Show the user section after hiding others
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
}

// Récupérer les utilisateurs au chargement de la page
document.addEventListener('DOMContentLoaded', fetchUsers);

function sortTable(columnIndex) {
    const table = document.getElementById('usersTable');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const isAscending = table.getAttribute('data-sort-asc') === 'true';
    
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText.toLowerCase();
        const cellB = rowB.cells[columnIndex].innerText.toLowerCase();

        if (cellA < cellB) return isAscending ? -1 : 1;
        if (cellA > cellB) return isAscending ? 1 : -1;
        return 0;
    });

    rows.forEach(row => tbody.appendChild(row));
    table.setAttribute('data-sort-asc', !isAscending);
}