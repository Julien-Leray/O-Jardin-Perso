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

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

function handleProductSelection(category) {
    let productId;
    let detailsId;
    let saveButtonId;
    let fetchDetailsFunction;
    let clearDetailsFunction;
    let createProductFunction;
    let updateProductFunction;

    if (category === 'Fruit') {
        productId = document.getElementById('fruits').value;
        detailsId = 'fruitDetails';
        saveButtonId = 'saveFruitButton';
        fetchDetailsFunction = fetchFruitDetails;
        clearDetailsFunction = clearFruitDetails;
        createProductFunction = createFruit;
        updateProductFunction = updateFruit;
    } else if (category === 'Vegetable') {
        productId = document.getElementById('legumes').value;
        detailsId = 'legumeDetails';
        saveButtonId = 'saveLegumeButton';
        fetchDetailsFunction = fetchLegumeDetails;
        clearDetailsFunction = clearLegumeDetails;
        createProductFunction = createLegume;
        updateProductFunction = updateLegume;
    }

    if (productId === "new") {
        clearDetailsFunction();
        document.getElementById(saveButtonId).onclick = createProductFunction;
        document.getElementById(saveButtonId).textContent = `Ajouter le ${category === 'Fruit' ? 'Fruit' : 'Légume'}`;
        document.getElementById(detailsId).style.display = 'block';
    } else if (productId) {
        document.getElementById(saveButtonId).onclick = updateProductFunction;
        document.getElementById(saveButtonId).textContent = "Enregistrer les Modifications";
        fetchDetailsFunction(productId);
        document.getElementById(detailsId).style.display = 'block';
    } else {
        document.getElementById(detailsId).style.display = 'none';
    }
}

async function fetchProducts(category) {
    selectedCategory = category;

    if (!category) {
        return;
    }

    try {
        const response = await fetch(`/api/products?category=${category}`);
        const products = await response.json();

        let productsSelect;
        let sectionId;

        if (category === 'Fruit') {
            productsSelect = document.getElementById('fruits');
            sectionId = 'fruitsSection';
        } else if (category === 'Vegetable') {
            productsSelect = document.getElementById('legumes');
            sectionId = 'legumesSection';
        }

        productsSelect.innerHTML = `<option value="">--Sélectionnez un ${category === 'Fruit' ? 'fruit' : 'légume'}--</option>`;
        productsSelect.innerHTML += `<option value="new">Ajouter un nouveau ${category === 'Fruit' ? 'fruit' : 'légume'}</option>`;

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            productsSelect.appendChild(option);
        });

        hideAllSections();
        document.getElementById(sectionId).style.display = 'block';
    } catch (error) {
        console.error(`Erreur lors de la récupération des ${category === 'Fruit' ? 'fruits' : 'légumes'} :`, error);
    }
}

function hideAllSections() {
    document.getElementById('tutorialsSection').style.display = 'none';
    document.getElementById('tutorialDetails').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('userFormSection').style.display = 'none';
    document.getElementById('fruitsSection').style.display = 'none';
    document.getElementById('fruitDetails').style.display = 'none';
    document.getElementById('legumesSection').style.display = 'none';
    document.getElementById('legumeDetails').style.display = 'none';
}

const months = [
    { id: 1, name: "Janvier" },
    { id: 2, name: "Février" },
    { id: 3, name: "Mars" },
    { id: 4, name: "Avril" },
    { id: 5, name: "Mai" },
    { id: 6, name: "Juin" },
    { id: 7, name: "Juillet" },
    { id: 8, name: "Août" },
    { id: 9, name: "Septembre" },
    { id: 10, name: "Octobre" },
    { id: 11, name: "Novembre" },
    { id: 12, name: "Décembre" }
];

function generateMonthCheckboxes(containerId, type, category, selectedMonths = []) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous content
    months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${category.toLowerCase()}-${type}-month-${month.id}`;
        checkbox.value = month.id;
        checkbox.dataset.month = month.name;
        checkbox.className = `${category.toLowerCase()}-${type}-month-checkbox`; // Add class for easy selection
        checkbox.setAttribute('onchange', `handleCheckboxChange(this, '${category}')`);

        if (selectedMonths.includes(month.id.toString())) {
            checkbox.checked = true;
        }

        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = month.name;

        monthDiv.appendChild(checkbox);
        monthDiv.appendChild(label);
        container.appendChild(monthDiv);
    });
}

function clearCheckedMonths(category) {
    const plantationCheckboxes = document.querySelectorAll(`.${category.toLowerCase()}-plantation-month-checkbox`);
    const recolteCheckboxes = document.querySelectorAll(`.${category.toLowerCase()}-recolte-month-checkbox`);
    
    plantationCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    recolteCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function setCheckedMonths(months, type, category) {
    const monthArray = months.replace(/[{}]/g, '').split(',').map(item => item.trim());
    monthArray.forEach(month => {
        const checkbox = document.getElementById(`${category.toLowerCase()}-${type}-month-${month}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

function getCheckedMonths(category) {
    const checkedMonths = {
        plantation: [],
        recolte: []
    };

    const plantationCheckboxes = document.querySelectorAll(`.${category.toLowerCase()}-plantation-month-checkbox:checked`);
    const recolteCheckboxes = document.querySelectorAll(`.${category.toLowerCase()}-recolte-month-checkbox:checked`);

    plantationCheckboxes.forEach(checkbox => {
        checkedMonths.plantation.push(checkbox.value);
    });

    recolteCheckboxes.forEach(checkbox => {
        checkedMonths.recolte.push(checkbox.value);
    });

    return checkedMonths;
}

function handleCheckboxChange(checkbox, category) {
    // Vous pouvez ajouter ici toute logique supplémentaire que vous souhaitez pour gérer les changements de case à cocher.
    console.log(`Checkbox for ${category} changed:`, checkbox);
    updateCheckboxStyles(checkbox);
}

function updateCheckboxStyles(checkbox) {
    if (checkbox.checked) {
        checkbox.nextElementSibling.style.backgroundColor = 'green'; // Vous pouvez ajuster la couleur selon vos besoins.
        checkbox.nextElementSibling.style.color = 'white';
    } else {
        checkbox.nextElementSibling.style.backgroundColor = ''; // Réinitialiser la couleur de fond.
        checkbox.nextElementSibling.style.color = ''; // Réinitialiser la couleur du texte.
    }
}

// Appelez cette fonction après la génération des cases à cocher pour appliquer les styles initiaux.
function applyInitialCheckboxStyles(category) {
    const plantationCheckboxes = document.querySelectorAll(`.${category.toLowerCase()}-plantation-month-checkbox`);
    const recolteCheckboxes = document.querySelectorAll(`.${category.toLowerCase()}-recolte-month-checkbox`);

    plantationCheckboxes.forEach(checkbox => {
        updateCheckboxStyles(checkbox);
    });

    recolteCheckboxes.forEach(checkbox => {
        updateCheckboxStyles(checkbox);
    });
}

// Appelez applyInitialCheckboxStyles après avoir généré les cases à cocher pour appliquer les styles initiaux.
generateMonthCheckboxes('dates_container_plantation_legume', 'plantation', 'Legume', []);
generateMonthCheckboxes('dates_container_recolte_legume', 'recolte', 'Legume', []);
generateMonthCheckboxes('dates_container_plantation_fruit', 'plantation', 'Fruit', []);
generateMonthCheckboxes('dates_container_recolte_fruit', 'recolte', 'Fruit', []);

applyInitialCheckboxStyles('Legume');
applyInitialCheckboxStyles('Fruit');

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto'; // Réinitialiser la hauteur pour obtenir le défilement correct
    textarea.style.height = (textarea.scrollHeight) + 'px'; // Ajuster la hauteur en fonction du scrollHeight
}

// Ajuster la hauteur des `textarea` au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            adjustTextareaHeight(textarea);
        });
        adjustTextareaHeight(textarea); // Ajuster la hauteur initiale
    });
});

function adjustSelectWidth(selectElement) {
    const tempSelect = document.createElement('select');
    const tempOption = document.createElement('option');
    
    tempOption.textContent = selectElement.options[selectElement.selectedIndex].text;
    tempSelect.style.visibility = 'hidden';
    tempSelect.style.position = 'fixed';
    tempSelect.appendChild(tempOption);
    document.body.appendChild(tempSelect);
    
    const tempSelectWidth = tempSelect.clientWidth;
    document.body.removeChild(tempSelect);
    
    selectElement.style.width = tempSelectWidth + 'px';
}

function toggleSection(sectionId, button) {
    const section = document.getElementById(sectionId);
    const allSections = document.querySelectorAll('#menuHeader > section');
    const allButtons = document.querySelectorAll('#menuHeader > button');

    allSections.forEach(sec => {
        if (sec !== section) {
            sec.classList.remove('active');
            sec.style.display = 'none';
        }
    });

    allButtons.forEach(btn => {
        if (btn !== button) {
            btn.style.flex = '0 1 60px';
        } else {
            btn.style.flex = '0 1 120px';
        }
    });

    if (section.classList.contains('active')) {
        section.classList.remove('active');
        section.style.display = 'none';
    } else {
        section.classList.add('active');
        section.style.display = 'flex';
        
        const selectElement = section.querySelector('select');
        if (selectElement) {
            adjustSelectWidth(selectElement);
        }
    }
}

document.querySelector('button[onclick="fetchProducts(\'Vegetable\')"]').addEventListener('click', function() {
    toggleSection('legumesSection', this);
    fetchProducts('Vegetable');
});

document.querySelector('button[onclick="fetchProducts(\'Fruit\')"]').addEventListener('click', function() {
    toggleSection('fruitsSection', this);
    fetchProducts('Fruit');
});

document.querySelector('button[onclick="fetchTutorials()"]').addEventListener('click', function() {
    toggleSection('tutorialsSection', this);
    fetchTutorials();
});

document.querySelector('button[onclick="fetchUsers()"]').addEventListener('click', function() {
    toggleSection('usersSection', this);
    fetchUsers();
});

// Adjust select width on content change
document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', function() {
        adjustSelectWidth(this);
    });
});