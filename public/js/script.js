

let currentProductId = null;

async function fetchProducts() {
    const category = document.getElementById('category').value;
    if (!category) {
        return;
    }

    try {
        const response = await fetch(`/api/products?category=${category}`);
        const products = await response.json();

        const productsSelect = document.getElementById('products');
        productsSelect.innerHTML = '<option value="">--Sélectionnez un produit--</option>';
        productsSelect.innerHTML += '<option value="new">Ajouter un nouveau produit</option>';

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            productsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
    }
}

function handleProductSelection() {
    const productId = document.getElementById('products').value;
    if (productId === "new") {
        clearProductDetails();
        document.getElementById('saveButton').onclick = createProduct;
        document.getElementById('saveButton').textContent = "Ajouter le Produit";
        document.getElementById('productDetails').style.display = 'block';
    } else {
        document.getElementById('saveButton').onclick = updateProduct;
        document.getElementById('saveButton').textContent = "Enregistrer les Modifications";
        fetchProductDetails(productId);
    }
}

async function fetchProductDetails(productId) {
    if (!productId) {
        return;
    }

    currentProductId = productId;

    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        document.getElementById('name').value = product.name;
        document.getElementById('latin_name').value = product.latin_name;
        document.getElementById('picture').value = product.picture;
        updateImagePreview();  // Met à jour l'aperçu de l'image

        setCheckedMonths('plantation_date', product.plantation_date);
        setCheckedMonths('harvest_date', product.harvest_date);
        
        document.getElementById('soil_type').value = product.soil_type;
        document.getElementById('diseases').value = product.diseases;
        document.getElementById('watering_frequency').value = product.watering_frequency;
        document.getElementById('description').value = product.description;
        document.getElementById('sowing_tips').value = product.sowing_tips || "";
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du produit :', error);
    }
}

function setCheckedMonths(id, monthsString) {
    const months = monthsString.replace(/{|}/g, '').split(', ').map(Number);
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = months.includes(parseInt(checkbox.value));
    });
}

function updateImagePreview() {
    const imageUrl = document.getElementById('picture').value;
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = imageUrl;
}


async function updateProduct() {
    if (!currentProductId) {
        alert("Aucun produit sélectionné");
        return;
    }

    const updatedProduct = {
        name: document.getElementById('name').value,
        latin_name: document.getElementById('latin_name').value,
        picture: document.getElementById('picture').value,
        plantation_date: `{${getCheckedMonths('plantation_date').join(', ')}}`,
        harvest_date: `{${getCheckedMonths('harvest_date').join(', ')}}`,
        soil_type: document.getElementById('soil_type').value,
        diseases: document.getElementById('diseases').value,
        watering_frequency: document.getElementById('watering_frequency').value,
        description: document.getElementById('description').value,
        sowing_tips: document.getElementById('sowing_tips').value
    };

    console.log("Sending data to server:", updatedProduct);  // Ajoutez ceci pour journaliser les données

    try {
        const response = await fetch(`/api/products/${currentProductId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            alert("Produit mis à jour avec succès");
        } else {
            const errorText = await response.text();
            alert("Erreur lors de la mise à jour du produit: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error);
    }
}

function getCheckedMonths(id) {
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]:checked`);
    return Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
}

async function deleteProduct() {
    if (!currentProductId) {
        alert("Aucun produit sélectionné");
        return;
    }

    try {
        const response = await fetch(`/api/products/${currentProductId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Produit supprimé avec succès");
            // Clear the form and reset the product selection
            clearProductDetails();
            currentProductId = null;
        } else {
            alert("Erreur lors de la suppression du produit");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
    }
}

function clearProductDetails() {
    document.getElementById('name').value = "";
    document.getElementById('latin_name').value = "";
    document.getElementById('picture').value = "";
    clearCheckedMonths('plantation_date');
    clearCheckedMonths('harvest_date');
    document.getElementById('soil_type').value = "";
    document.getElementById('diseases').value = "";
    document.getElementById('watering_frequency').value = "";
    document.getElementById('description').value = "";
    document.getElementById('sowing_tips').value = "";
    document.getElementById('products').value = "";
    document.getElementById('imagePreview').src = "";  // Réinitialiser l'aperçu de l'image
}

function clearCheckedMonths(id) {
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

async function createProduct() {
    const newProduct = {
        name: document.getElementById('name').value,
        latin_name: document.getElementById('latin_name').value,
        picture: document.getElementById('picture').value,
        plantation_date: `{${getCheckedMonths('plantation_date').join(', ')}}`,
        harvest_date: `{${getCheckedMonths('harvest_date').join(', ')}}`,
        soil_type: document.getElementById('soil_type').value,
        diseases: document.getElementById('diseases').value,
        watering_frequency: document.getElementById('watering_frequency').value,
        description: document.getElementById('description').value,
        sowing_tips: document.getElementById('sowing_tips').value,
        category_id: document.getElementById('category').value === 'Fruit' ? 1 : 2 // Exemple: Assigner les catégories 1 pour Fruit et 2 pour Légume
    };

    console.log("Sending data to server:", newProduct);  // Ajoutez ceci pour journaliser les données

    try {
        const response = await fetch(`/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            alert("Produit ajouté avec succès");
            // Clear the form and hide it
            clearProductDetails();
            document.getElementById('products').value = "";  // Réinitialiser la sélection du produit
            document.getElementById('productDetails').style.display = 'none';
            // Refresh product list
            fetchProducts();
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout du produit: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit :', error);
    }
}