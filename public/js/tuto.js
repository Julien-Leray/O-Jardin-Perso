let currentTutorialId = null;

async function fetchTutorials() {
    try {
        const response = await fetch('/api/api/tutorials');
        const tutorials = await response.json();

        const tutorialsSelect = document.getElementById('tutorialsSelect');
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
    const tutorialId = document.getElementById('tutorialsSelect').value;
    if (tutorialId === "new") {
        clearTutorialDetails();
        document.getElementById('saveTutorialButton').onclick = createTutorial;
        document.getElementById('saveTutorialButton').textContent = "Ajouter le Tutoriel";
        document.getElementById('tutorialDetails').style.display = 'block';
    } else if (tutorialId) {
        document.getElementById('saveTutorialButton').onclick = updateTutorial;
        document.getElementById('saveTutorialButton').textContent = "Enregistrer les Modifications";
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
        const response = await fetch(`/api/api/tutorials/${tutorialId}`);
        const tutorial = await response.json();

        if (tutorial) {
            document.getElementById('tutorialTitle').value = tutorial.title;
            document.getElementById('tutorialArticle').value = tutorial.article;
            document.getElementById('tutorialPicture').value = tutorial.picture;
            document.getElementById('tutorialTheme').value = tutorial.theme;
            updateImagePreviewTuto(tutorial.picture); 

            document.getElementById('tutorialCreatedAt').value = formatDate(tutorial.created_at);
            document.getElementById('tutorialUpdatedAt').value = tutorial.updated_at ? formatDate(tutorial.updated_at) : '';

            adjustTextareaHeight(document.getElementById('tutorialTitle'));
            adjustTextareaHeight(document.getElementById('tutorialArticle'));
            adjustTextareaHeight(document.getElementById('tutorialPicture'));
            adjustTextareaHeight(document.getElementById('tutorialTheme'));
            adjustTextareaHeight(document.getElementById('tutorialCreatedAt'));
            adjustTextareaHeight(document.getElementById('tutorialUpdatedAt'));
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du tutoriel :', error);
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
    const currentDate = new Date();

    const newTutorial = {
        title: document.getElementById('tutorialTitle').value,
        article: document.getElementById('tutorialArticle').value,
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        theme: document.getElementById('tutorialTheme').value,
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString()
    };

    const fileInput = document.getElementById('tutorialImageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            newTutorial.picture = base64String; // Mettre à jour l'image en base64
            updateImagePreviewTuto(base64String); // Mettre à jour l'aperçu de l'image
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        console.warn('No file selected for upload.');
    }

    try {
        const response = await fetch(`/api/api/tutorials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    const currentDate = new Date();

    const updatedTutorial = {
        title: document.getElementById('tutorialTitle').value,
        article: document.getElementById('tutorialArticle').value,
        picture: "", // Initialement vide, sera mis à jour si un fichier est sélectionné
        theme: document.getElementById('tutorialTheme').value,
        updated_at: currentDate.toISOString()
    };

    const fileInput = document.getElementById('tutorialImageUploadDownload');
    const file = fileInput?.files[0];

    if (file) {
        try {
            const base64String = await convertFileToBase64(file);
            updatedTutorial.picture = base64String; // Mettre à jour l'image en base64
            updateImagePreviewTuto(base64String); // Mettre à jour l'aperçu de l'image
        } catch (error) {
            console.error('Erreur lors de la conversion du fichier en base64 :', error);
            alert('Erreur lors de la conversion du fichier en base64');
            return;
        }
    } else {
        // Si aucune nouvelle image n'est téléchargée, utilisez l'URL existante
        updatedTutorial.picture = document.getElementById('tutorialPicture').value;
    }

    try {
        const response = await fetch(`/api/api/tutorials/${currentTutorialId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedTutorial)
        });

        if (response.ok) {
            alert("Tutoriel mis à jour avec succès");
            document.getElementById('tutorialUpdatedAt').value = formatDate(currentDate.toISOString());
            fetchTutorials();
        } else {
            const errorText = await response.text();
            alert("Erreur lors de la mise à jour du tutoriel: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du tutoriel :', error);
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
        const response = await fetch(`/api/api/tutorials/${currentTutorialId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json' // Ajout du Content-Type
            }
        });

        if (response.ok) {
            alert("Tutoriel supprimé avec succès");
            clearTutorialDetails();
            fetchTutorials();
        } else {
            const errorText = await response.text();
            alert("Erreur lors de la suppression du tutoriel: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du tutoriel :', error);
    }
}

function clearTutorialDetails() {
    const tutorialTitle = document.getElementById('tutorialTitle');
    const tutorialArticle = document.getElementById('tutorialArticle');
    const tutorialPicture = document.getElementById('tutorialPicture');
    const tutorialTheme = document.getElementById('tutorialTheme');
    const imagePreviewTuto = document.getElementById('imagePreviewTuto');

    if (tutorialTitle) tutorialTitle.value = '';
    if (tutorialArticle) tutorialArticle.value = '';
    if (tutorialPicture) tutorialPicture.value = '';
    if (tutorialTheme) tutorialTheme.value = '';
    if (imagePreviewTuto) {
        imagePreviewTuto.src = '';
        imagePreviewTuto.style.display = 'none';
    }
}