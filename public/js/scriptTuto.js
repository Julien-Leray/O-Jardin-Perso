let currentTutorialId = null;

function hideAllSections() {
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('productDetails').style.display = 'none';
    document.getElementById('tutorialsSection').style.display = 'none';
    document.getElementById('tutorialDetails').style.display = 'none';
}

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

async function fetchTutorials() {
    try {
        const response = await fetch('/api/tutorials');
        const tutorials = await response.json();

        const tutorialsSelect = document.getElementById('tutorials');
        tutorialsSelect.innerHTML = '<option value="">--Sélectionnez un tutoriel--</option>';
        tutorialsSelect.innerHTML += '<option value="new">Ajouter un nouveau tutoriel</option>';

        tutorials.forEach(tutorial => {
            const option = document.createElement('option');
            option.value = tutorial.id;
            option.textContent = tutorial.title;
            tutorialsSelect.appendChild(option);
        });

        hideAllSections();
        document.getElementById('tutorialsSection').style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de la récupération des tutoriels :', error);
    }
}

function handleTutorialSelection() {
    const tutorialId = document.getElementById('tutorials').value;
    if (tutorialId === "new") {
        clearTutorialDetails();
        currentTutorialId = null;
        document.getElementById('saveButton').onclick = createTutorial;
        document.getElementById('saveButton').textContent = "Ajouter le Tutoriel";
        document.getElementById('tutorialDetails').style.display = 'block';
    } else if (tutorialId) {
        document.getElementById('saveButton').onclick = updateTutorial;
        document.getElementById('saveButton').textContent = "Enregistrer les Modifications";
        fetchTutorialDetails(tutorialId);
        document.getElementById('tutorialDetails').style.display = 'block';
    } else {
        document.getElementById('tutorialDetails').style.display = 'none';
    }
}

async function fetchTutorialDetails(tutorialId) {
    if (!tutorialId) {
        return;
    }

    currentTutorialId = tutorialId;

    try {
        const response = await fetch(`/api/tutorials/${tutorialId}`);
        const tutorial = await response.json();

        if (tutorial) {
            document.getElementById('title').value = tutorial.title;
            document.getElementById('article').value = tutorial.article;
            document.getElementById('picture').value = tutorial.picture;
            document.getElementById('theme').value = tutorial.theme;
            updateImagePreview();  // Met à jour l'aperçu de l'image
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du tutoriel :', error);
    }
}

function updateImagePreview() {
    const imageUrl = document.getElementById('picture').value;
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.src = imageUrl;
    }
}

async function saveTutorial() {
    if (!currentTutorialId) {
        createTutorial();
    } else {
        updateTutorial();
    }
}

async function createTutorial() {
    const newTutorial = {
        title: document.getElementById('title').value,
        article: document.getElementById('article').value,
        picture: document.getElementById('picture').value,
        theme: document.getElementById('theme').value
    };

    try {
        const response = await fetch(`/api/tutorials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTutorial)
        });

        if (response.ok) {
            alert("Tutoriel ajouté avec succès");
            clearTutorialDetails();
            fetchTutorials();
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout du tutoriel: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du tutoriel :', error);
    }
}

async function updateTutorial() {
    if (!currentTutorialId) {
        alert("Aucun tutoriel sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir mettre à jour ce tutoriel ?");
    if (!confirmation) {
        return;
    }

    const updatedTutorial = {
        title: document.getElementById('title').value,
        article: document.getElementById('article').value,
        picture: document.getElementById('picture').value,
        theme: document.getElementById('theme').value
    };

    try {
        const response = await fetch(`/api/tutorials/${currentTutorialId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTutorial)
        });

        if (response.ok) {
            alert("Tutoriel mis à jour avec succès");
            fetchTutorials();
        } else {
            const errorData = await response.json();
            alert("Erreur lors de la mise à jour du tutoriel: " + errorData.message);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du tutoriel :', error);
        alert("Une erreur inattendue s'est produite");
    }
}

async function deleteTutorial() {
    if (!currentTutorialId) {
        alert("Aucun tutoriel sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce tutoriel ?");
    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`/api/tutorials/${currentTutorialId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Tutoriel supprimé avec succès");
            clearTutorialDetails();
            fetchTutorials();
        } else {
            const errorData = await response.json();
            alert("Erreur lors de la suppression du tutoriel: " + errorData.message);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du tutoriel :', error);
        alert("Une erreur inattendue s'est produite");
    }
}

function clearTutorialDetails() {
    document.getElementById('title').value = "";
    document.getElementById('article').value = "";
    document.getElementById('picture').value = "";
    document.getElementById('theme').value = "";
    document.getElementById('imagePreview').src = "";
}
