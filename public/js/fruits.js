let currentFruitId = null;

async function fetchFruitDetails(fruitId) {
    if (!fruitId) {
        return;
    }

    currentFruitId = fruitId;

    try {
        const response = await fetch(`/api/products/${fruitId}`);
        const fruit = await response.json();

        if (fruit) {
            document.getElementById('fruit_name').value = fruit.name;
            document.getElementById('fruit_latin_name').value = fruit.latin_name;
            updateImagePreviewFruits(fruit.picture);

            const plantationMonths = fruit.plantation_date.replace(/[{}]/g, '').split(',').map(item => item.trim());
            const harvestMonths = fruit.harvest_date.replace(/[{}]/g, '').split(',').map(item => item.trim());
            generateMonthCheckboxes('dates_container_plantation_fruit', 'plantation', 'Fruit', plantationMonths);
            generateMonthCheckboxes('dates_container_recolte_fruit', 'recolte', 'Fruit', harvestMonths);

            document.getElementById('fruit_soil_type').value = fruit.soil_type;
            document.getElementById('fruit_diseases').value = fruit.diseases;
            document.getElementById('fruit_watering_frequency').value = fruit.watering_frequency;
            document.getElementById('fruit_description').value = fruit.description;
            document.getElementById('fruit_sowing_tips').value = fruit.sowing_tips || "";

            document.getElementById('fruit_created_at').value = formatDate(fruit.created_at);
            document.getElementById('fruit_updated_at').value = fruit.updated_at ? formatDate(fruit.updated_at) : '';

            // Ajuster la hauteur des textarea après avoir défini leurs valeurs
            adjustTextareaHeight(document.getElementById('fruit_name'));
            adjustTextareaHeight(document.getElementById('fruit_latin_name'));
            adjustTextareaHeight(document.getElementById('fruit_description'));
            adjustTextareaHeight(document.getElementById('fruit_sowing_tips'));
            adjustTextareaHeight(document.getElementById('fruit_soil_type'));
            adjustTextareaHeight(document.getElementById('fruit_diseases'));
            adjustTextareaHeight(document.getElementById('fruit_watering_frequency'));
            adjustTextareaHeight(document.getElementById('fruit_created_at'));
            adjustTextareaHeight(document.getElementById('fruit_updated_at'));
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du fruit :', error);
    }
}
async function createFruit() {
    const currentDate = new Date();

    const newFruit = {
        name: document.getElementById('fruit_name').value,
        latin_name: document.getElementById('fruit_latin_name').value,
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        plantation_date: getCheckedMonths('Fruit').plantation.join(', '),
        harvest_date: getCheckedMonths('Fruit').recolte.join(', '),
        soil_type: document.getElementById('fruit_soil_type').value,
        diseases: document.getElementById('fruit_diseases').value,
        watering_frequency: document.getElementById('fruit_watering_frequency').value,
        description: document.getElementById('fruit_description').value,
        sowing_tips: document.getElementById('fruit_sowing_tips').value || "",
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString(),
        category_id: 1 // Assurez-vous que cette valeur est correcte pour les fruits
    };

    const fileInput = document.getElementById('fruit_imageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            newFruit.picture = base64String; // Mettre à jour l'image en base64
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        console.warn('No file selected for upload.');
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFruit)
        });

        if (response.ok) {
            alert("Fruit ajouté avec succès");
            clearFruitDetails();
            fetchProducts('Fruit');
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout du fruit: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du fruit :', error);
    }
}

async function updateFruit() {
    if (!currentFruitId) {
        alert("Aucun fruit sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir mettre à jour ce fruit ?");
    if (!confirmation) {
        return;
    }

    const checkedMonths = getCheckedMonths('Fruit');

    const updatedFruit = {
        name: document.getElementById('fruit_name')?.value || "",
        latin_name: document.getElementById('fruit_latin_name')?.value || "",
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        plantation_date: `{${checkedMonths.plantation.join(', ')}}`,
        harvest_date: `{${checkedMonths.recolte.join(', ')}}`,
        soil_type: document.getElementById('fruit_soil_type')?.value || "",
        diseases: document.getElementById('fruit_diseases')?.value || "",
        watering_frequency: document.getElementById('fruit_watering_frequency')?.value || "",
        description: document.getElementById('fruit_description')?.value || "",
        sowing_tips: document.getElementById('fruit_sowing_tips')?.value || "",
        category_id: 1, // Assurez-vous que cette valeur est correcte pour les fruits
    };

    const fileInput = document.getElementById('fruit_imageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            updatedFruit.picture = base64String; // Mettre à jour l'image en base64
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        // Si aucune nouvelle image n'est téléchargée, utilisez l'URL existante
        updatedFruit.picture = document.getElementById('fruit_picture').value;
    }

    console.log("Envoi des données au serveur :", updatedFruit);

    try {
        const response = await fetch(`/api/products/${currentFruitId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFruit)
        });

        if (response.ok) {
            alert("Fruit mis à jour avec succès");
            fetchProducts('Fruit');
        } else {
            const errorText = await response.text();
            alert("Erreur lors de la mise à jour du fruit: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du fruit :', error);
    }
}

async function deleteFruit() {
    if (!currentFruitId) {
        alert("Aucun fruit sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce fruit ?");
    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${currentFruitId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert("Fruit supprimé avec succès");
            clearFruitDetails();
            fetchProducts('Fruit');
        } else {
            alert("Erreur lors de la suppression du fruit");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du fruit :', error);
    }
}

function clearFruitDetails() {
    const elements = [
        'fruit_name', 'fruit_latin_name', 'fruit_picture', 'fruit_soil_type', 
        'fruit_diseases', 'fruit_watering_frequency', 'fruit_description', 'fruit_sowing_tips',
        'fruit_imageUploadDownload'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
    
    clearCheckedMonths('Fruit');
}