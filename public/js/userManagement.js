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
            throw new Error('Network response was not ok');
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
    const watering_alert = document.getElementById('userWateringAlertCreate').checked;
    const forecast_alert = document.getElementById('userForecastAlertCreate').checked;
    const is_admin = document.getElementById('userIsAdminCreate').checked;

    // Basic validation
    if (!email || !firstname || !lastname || !password) {
        alert("Email, firstname, lastname, and password are required.");
        return;
    }

    const user = {
        email,
        firstname,
        lastname,
        password,
        address,
        zip_code,
        city,
        watering_alert,
        forecast_alert,
        is_admin
    };

    // Log the user object to see what is being sent
    console.log('Sending user data:', JSON.stringify(user));

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
            console.error('Error response from server:', errorText);
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
    const watering_alert = document.getElementById('userWateringAlertCreate').checked;
    const forecast_alert = document.getElementById('userForecastAlertCreate').checked;
    const is_admin = document.getElementById('userIsAdminCreate').checked;

    // Basic validation
    if (!email || !firstname || !lastname) {
        alert("Email, firstname, and lastname are required.");
        return;
    }

    const user = {
        firstname,
        lastname,
        password,
        address,
        zip_code,
        city,
        watering_alert,
        forecast_alert,
        is_admin
    };

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

    // Clear the form
    document.getElementById('userForm').reset();
}

async function fetchUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const users = await response.json();
        const usersTableBody = document.getElementById('usersTableBody');
        usersTableBody.innerHTML = ''; // Clear current table body

        users.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="confirmDeleteUser(${user.id})">Delete</button>
                </td>
            `;

            usersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
}

// Fetch users on page load
document.addEventListener('DOMContentLoaded', fetchUsers);