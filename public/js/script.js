let currentProductId = null;
let selectedCategory = null;

async function fetchProducts(category) {
    selectedCategory = category;
    
    if (!category) {
        return;
    }

    try {
        const response = await fetch(`/api/products?category=${category}`);
        const products = await response.json();

        const productsSelect = document.getElementById('products');
        if (productsSelect) {
            productsSelect.innerHTML = '<option value="">--Sélectionnez un produit--</option>';
            productsSelect.innerHTML += '<option value="new">Ajouter un nouveau produit</option>';

            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                productsSelect.appendChild(option);
            });

            // Afficher la section des produits
            document.getElementById('productsSection').style.display = 'block';
            document.getElementById('productDetails').style.display = 'none';
        }
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
    } else if (productId) {
        document.getElementById('saveButton').onclick = updateProduct;
        document.getElementById('saveButton').textContent = "Enregistrer les Modifications";
        fetchProductDetails(productId);
        document.getElementById('productDetails').style.display = 'block';
    } else {
        document.getElementById('productDetails').style.display = 'none';
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

        if (product) {
            const nameElement = document.getElementById('name');
            if (nameElement) nameElement.value = product.name;
            const latinNameElement = document.getElementById('latin_name');
            if (latinNameElement) latinNameElement.value = product.latin_name;
            const pictureElement = document.getElementById('picture');
            if (pictureElement) pictureElement.value = product.picture;
            updateImagePreview();  // Met à jour l'aperçu de l'image

            setCheckedMonths('plantation_date', product.plantation_date);
            setCheckedMonths('harvest_date', product.harvest_date);

            const soilTypeElement = document.getElementById('soil_type');
            if (soilTypeElement) soilTypeElement.value = product.soil_type;
            const diseasesElement = document.getElementById('diseases');
            if (diseasesElement) diseasesElement.value = product.diseases;
            const wateringFrequencyElement = document.getElementById('watering_frequency');
            if (wateringFrequencyElement) wateringFrequencyElement.value = product.watering_frequency;
            const descriptionElement = document.getElementById('description');
            if (descriptionElement) descriptionElement.value = product.description;
            const sowingTipsElement = document.getElementById('sowing_tips');
            if (sowingTipsElement) sowingTipsElement.value = product.sowing_tips || "";
        }
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
    if (imagePreview) {
        imagePreview.src = imageUrl;
    }
}

async function updateProduct() {
    if (!currentProductId) {
        alert("Aucun produit sélectionné");
        return;
    }

    const updatedProduct = {
        name: document.getElementById('name')?.value || "",
        latin_name: document.getElementById('latin_name')?.value || "",
        picture: document.getElementById('picture')?.value || "",
        plantation_date: `{${getCheckedMonths('plantation_date').join(', ')}}`,
        harvest_date: `{${getCheckedMonths('harvest_date').join(', ')}}`,
        soil_type: document.getElementById('soil_type')?.value || "",
        diseases: document.getElementById('diseases')?.value || "",
        watering_frequency: document.getElementById('watering_frequency')?.value || "",
        description: document.getElementById('description')?.value || "",
        sowing_tips: document.getElementById('sowing_tips')?.value || ""
    };

    console.log("Sending data to server:", updatedProduct);

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
            document.getElementById('productDetails').style.display = 'none';
        } else {
            alert("Erreur lors de la suppression du produit");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
    }
}

function clearProductDetails() {
    const elements = [
        'name', 'latin_name', 'picture', 'soil_type', 
        'diseases', 'watering_frequency', 'description', 'sowing_tips'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
    
    clearCheckedMonths('plantation_date');
    clearCheckedMonths('harvest_date');
    const productsElement = document.getElementById('products');
    if (productsElement) {
        productsElement.value = "";
    }
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.src = "";  // Réinitialiser l'aperçu de l'image
    }
}

function clearCheckedMonths(id) {
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

async function createProduct() {
    if (!selectedCategory) {
        alert("Aucune catégorie sélectionnée");
        return;
    }

    const newProduct = {
        name: document.getElementById('name')?.value || "",
        latin_name: document.getElementById('latin_name')?.value || "",
        picture: document.getElementById('picture')?.value || "",
        plantation_date: `{${getCheckedMonths('plantation_date').join(', ')}}`,
        harvest_date: `{${getCheckedMonths('harvest_date').join(', ')}}`,
        soil_type: document.getElementById('soil_type')?.value || "",
        diseases: document.getElementById('diseases')?.value || "",
        watering_frequency: document.getElementById('watering_frequency')?.value || "",
        description: document.getElementById('description')?.value || "",
        sowing_tips: document.getElementById('sowing_tips')?.value || "",
        category_id: selectedCategory === 'Fruit' ? 1 : 2 // Exemple: Assigner les catégories 1 pour Fruit et 2 pour Légume
    };

    console.log("Sending data to server:", newProduct);

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
            const productsElement = document.getElementById('products');
            if (productsElement) {
                productsElement.value = "";  // Réinitialiser la sélection du produit
            }
            const productDetails = document.getElementById('productDetails');
            if (productDetails) {
                productDetails.style.display = 'none';
            }
            // Refresh product list
            fetchProducts(selectedCategory);
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout du produit: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit :', error);
    }
}
