
let selectedCategory = null;

function formatDate(isoString) {
    if (!isoString) return ''; // Retourner une chaîne vide si isoString est null ou undefined
    const date = new Date(isoString);
    const options = {
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return date.toLocaleString('fr-FR', options);
}



function clearCheckedMonths(id) {
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function getCheckedMonths(id) {
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]:checked`);
    return Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
}

function hideAllSections() {
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('productDetails').style.display = 'none';
    document.getElementById('tutorialsSection').style.display = 'none';
    document.getElementById('tutorialDetails').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('userFormSection').style.display = 'none';
}