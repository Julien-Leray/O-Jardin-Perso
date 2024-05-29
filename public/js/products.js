let currentProductId = null;

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
            hideAllSections();
            document.getElementById('productsSection').style.display = 'block';
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
            document.getElementById('name').value = product.name;
            document.getElementById('latin_name').value = product.latin_name;
            setElementValue('productsPicture', product.picture);
            updateImagePreviewProducts(product.picture);

            setCheckedMonths('plantation_date', product.plantation_date);
            setCheckedMonths('harvest_date', product.harvest_date);

            document.getElementById('soil_type').value = product.soil_type;
            document.getElementById('diseases').value = product.diseases;
            document.getElementById('watering_frequency').value = product.watering_frequency;
            document.getElementById('description').value = product.description;
            document.getElementById('sowing_tips').value = product.sowing_tips || "";

            document.getElementById('product_created_at').value = formatDate(product.created_at);
            document.getElementById('product_updated_at').value = product.updated_at ? formatDate(product.updated_at) : '';
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du produit :', error);
    }
}

function setElementValue(id, value, isDisabled = false) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
        if (isDisabled) {
            element.disabled = true;
        }
    }
}

function setCheckedMonths(id, monthsString) {
    const months = monthsString.replace(/{|}/g, '').split(', ').map(Number);
    const checkboxes = document.querySelectorAll(`#${id} input[type=checkbox]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = months.includes(parseInt(checkbox.value));
    });
}

async function updateProduct() {
    if (!currentProductId) {
        alert("Aucun produit sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir mettre à jour ce produit ?");
    if (!confirmation) {
        return;
    }


    const updatedProduct = {
        name: document.getElementById('name')?.value || "",
        latin_name: document.getElementById('latin_name')?.value || "",
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        plantation_date: `{${getCheckedMonths('plantation_date').join(', ')}}`,
        harvest_date: `{${getCheckedMonths('harvest_date').join(', ')}}`,
        soil_type: document.getElementById('soil_type')?.value || "",
        diseases: document.getElementById('diseases')?.value || "",
        watering_frequency: document.getElementById('watering_frequency')?.value || "",
        description: document.getElementById('description')?.value || "",
        sowing_tips: document.getElementById('sowing_tips')?.value || "",
        category_id: selectedCategory === 'Fruit' ? 1 : 2, // Assurez-vous que cette valeur est correcte
        
    };

    const fileInput = document.getElementById('imageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            updatedProduct.picture = base64String; // Mettre à jour l'image en base64
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        console.warn('No file selected for upload.');
    }

    console.log("Envoi des données au serveur :", updatedProduct);

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

async function deleteProduct() {
    if (!currentProductId) {
        alert("Aucun produit sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${currentProductId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Produit supprimé avec succès");
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
        'diseases', 'watering_frequency', 'description', 'sowing_tips',
        'productsPicture' // Ajout de productsPicture
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

    const imagePreviewElement = document.getElementById('imagePreview');
    if (imagePreviewElement) {
        imagePreviewElement.src = "";
    }

    const imagePreviewProductsElement = document.getElementById('imagePreviewProducts');
    if (imagePreviewProductsElement) {
        imagePreviewProductsElement.src = "";
        imagePreviewProductsElement.style.display = 'none';
    }

    const createdAtElement = document.getElementById('product_created_at');
    if (createdAtElement) {
        createdAtElement.value = "";
    }

    const updatedAtElement = document.getElementById('product_updated_at');
    if (updatedAtElement) {
        updatedAtElement.value = "";
    }
}


async function createProduct() {
    if (!selectedCategory) {
        alert("Aucune catégorie sélectionnée");
        return;
    }

    const currentDate = new Date();

    const newProduct = {
        name: document.getElementById('name')?.value || "",
        latin_name: document.getElementById('latin_name')?.value || "",
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        plantation_date: `{${getCheckedMonths('plantation_date').join(', ')}}`,
        harvest_date: `{${getCheckedMonths('harvest_date').join(', ')}}`,
        soil_type: document.getElementById('soil_type')?.value || "",
        diseases: document.getElementById('diseases')?.value || "",
        watering_frequency: document.getElementById('watering_frequency')?.value || "",
        description: document.getElementById('description')?.value || "",
        sowing_tips: document.getElementById('sowing_tips')?.value || "",
        category_id: selectedCategory === 'Fruit' ? 1 : 2, 
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString()
    };

    const fileInput = document.getElementById('imageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            newProduct.picture = base64String; // Mettre à jour l'image en base64
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        console.warn('No file selected for upload.');
    }

    console.log("Envoi des données au serveur :", newProduct);

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
            clearProductDetails();
            fetchProducts(selectedCategory);
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout du produit: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit :', error);
    }
}