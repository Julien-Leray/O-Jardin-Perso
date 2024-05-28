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
        console.error('Product ID is missing');
        return;
    }

    currentProductId = productId;
    console.log('Fetching details for product ID:', currentProductId);
    const url = `/api/products/${productId}`;
    console.log('Request URL:', url);

    try {
        const response = await fetch(url);
        const product = await response.json();

        if (product) {
            setElementValue('name', product.name);
            setElementValue('latin_name', product.latin_name);
            setElementValue('productsPicture', product.picture); // Ensure this is set to the correct key
            updateImagePreviewProducts(product.picture);

            setCheckedMonths('plantation_date', product.plantation_date);
            setCheckedMonths('harvest_date', product.harvest_date);

            setElementValue('soil_type', product.soil_type);
            setElementValue('diseases', product.diseases);
            setElementValue('watering_frequency', product.watering_frequency);
            setElementValue('description', product.description);
            setElementValue('sowing_tips', product.sowing_tips || "");

            setElementValue('product_created_at', formatDate(product.created_at), true);
            setElementValue('product_updated_at', product.updated_at ? formatDate(product.updated_at) : '', true);
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
    const months = monthsString.replace(/{|}/g, '').split(',').map(Number);
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

    const formElement = document.getElementById('productForm');
    const formData = new FormData(formElement);
    formData.append('updated_at', new Date().toISOString());

    const fileInput = document.getElementById('imageUploadDownload');
    const file = fileInput.files[0];
    if (file) {
        formData.append('image', file);
    } else {
        console.warn('No file selected for upload.');
    }

    // Debug: Log formData contents
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        const response = await fetch(`/api/products/${currentProductId}`, {
            method: 'PATCH',
            body: formData
        });

        if (response.ok) {
            alert("Produit mis à jour avec succès");
            document.getElementById('product_updated_at').value = new Date().toISOString();
        } else {
            const errorText = await response.text();
            console.error("Erreur lors de la mise à jour du produit: ", errorText);
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
        'name', 'latin_name', 'soil_type', 
        'diseases', 'watering_frequency', 'description', 'sowing_tips', 'productsPicture'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
    
    clearCheckedMonths('plantation_date');
    clearCheckedMonths('harvest_date');
    const products = document.getElementById('products');
    if (products) {
        products.value = "";
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

    const formData = new FormData(document.getElementById('productForm'));
    formData.append('created_at', new Date().toISOString());
    formData.append('updated_at', new Date().toISOString());
    formData.append('category_id', selectedCategory === 'Fruit' ? 1 : 2);

    // Vérifiez que les données sont correctes
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        const response = await fetch(`/api/products`, {
            method: 'POST',
            body: formData
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