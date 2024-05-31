let currentLegumeId = null;

async function fetchLegumeDetails(legumeId) {
    if (!legumeId) {
        return;
    }

    currentLegumeId = legumeId;

    try {
        const response = await fetch(`/api/products/${legumeId}`);
        const legume = await response.json();

        if (legume) {
            document.getElementById('legume_name').value = legume.name;
            document.getElementById('legume_latin_name').value = legume.latin_name;
            updateImagePreviewLegumes(legume.picture);

            const plantationMonths = legume.plantation_date.replace(/[{}]/g, '').split(',').map(item => item.trim());
            const harvestMonths = legume.harvest_date.replace(/[{}]/g, '').split(',').map(item => item.trim());
            generateMonthCheckboxes('dates_container_plantation_legume', 'plantation', 'Legume', plantationMonths);
            generateMonthCheckboxes('dates_container_recolte_legume', 'recolte', 'Legume', harvestMonths);

            document.getElementById('legume_soil_type').value = legume.soil_type;
            document.getElementById('legume_diseases').value = legume.diseases;
            document.getElementById('legume_watering_frequency').value = legume.watering_frequency;
            document.getElementById('legume_description').value = legume.description;
            document.getElementById('legume_sowing_tips').value = legume.sowing_tips || "";

            document.getElementById('legume_created_at').value = formatDate(legume.created_at);
            document.getElementById('legume_updated_at').value = legume.updated_at ? formatDate(legume.updated_at) : '';
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du légume :', error);
    }
}

async function createLegume() {
    const currentDate = new Date();

    const newLegume = {
        name: document.getElementById('legume_name').value,
        latin_name: document.getElementById('legume_latin_name').value,
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        plantation_date: getCheckedMonths('Legume').plantation.join(', '),
        harvest_date: getCheckedMonths('Legume').recolte.join(', '),
        soil_type: document.getElementById('legume_soil_type').value,
        diseases: document.getElementById('legume_diseases').value,
        watering_frequency: document.getElementById('legume_watering_frequency').value,
        description: document.getElementById('legume_description').value,
        sowing_tips: document.getElementById('legume_sowing_tips').value || "",
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString()
    };

    const fileInput = document.getElementById('legume_imageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            newLegume.picture = base64String; // Mettre à jour l'image en base64
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
            body: JSON.stringify(newLegume)
        });

        if (response.ok) {
            alert("Légume ajouté avec succès");
            clearLegumeDetails();
            fetchProducts('Vegetable');
        } else {
            const errorText = await response.text();
            alert("Erreur lors de l'ajout du légume: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du légume :', error);
    }
}
async function updateLegume() {
    if (!currentLegumeId) {
        alert("Aucun légume sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir mettre à jour ce légume ?");
    if (!confirmation) {
        return;
    }

    const checkedMonths = getCheckedMonths('Legume');

    const updatedLegume = {
        name: document.getElementById('legume_name')?.value || "",
        latin_name: document.getElementById('legume_latin_name')?.value || "",
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        plantation_date: `{${checkedMonths.plantation.join(', ')}}`,
        harvest_date: `{${checkedMonths.recolte.join(', ')}}`,
        soil_type: document.getElementById('legume_soil_type')?.value || "",
        diseases: document.getElementById('legume_diseases')?.value || "",
        watering_frequency: document.getElementById('legume_watering_frequency')?.value || "",
        description: document.getElementById('legume_description')?.value || "",
        sowing_tips: document.getElementById('legume_sowing_tips')?.value || "",
        category_id: 2, // Assurez-vous que cette valeur est correcte pour les légumes
    };

    const fileInput = document.getElementById('legume_imageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            updatedLegume.picture = base64String; // Mettre à jour l'image en base64
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        // Si aucune nouvelle image n'est téléchargée, utilisez l'URL existante
        updatedLegume.picture = document.getElementById('legume_picture').value;
    }

    console.log("Envoi des données au serveur :", updatedLegume);

    try {
        const response = await fetch(`/api/products/${currentLegumeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedLegume)
        });

        if (response.ok) {
            alert("Légume mis à jour avec succès");
        } else {
            const errorText = await response.text();
            alert("Erreur lors de la mise à jour du légume: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du légume :', error);
    }
}

async function deleteLegume() {
    if (!currentLegumeId) {
        alert("Aucun légume sélectionné");
        return;
    }

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce légume ?");
    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${currentLegumeId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Légume supprimé avec succès");
            clearLegumeDetails();
            fetchProducts('Vegetable');
        } else {
            alert("Erreur lors de la suppression du légume");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du légume :', error);
    }
}

function clearLegumeDetails() {
    const elements = [
        'legume_name', 'legume_latin_name', 'legume_picture', 'legume_soil_type', 
        'legume_diseases', 'legume_watering_frequency', 'legume_description', 'legume_sowing_tips',
        'legume_imageUploadDownload'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
    
    clearCheckedMonths('Legume');
}
