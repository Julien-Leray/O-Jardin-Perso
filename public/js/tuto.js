
let currentTutorialId = null;

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
            updateImagePreview();

            document.getElementById('tutorial_created_at').value = formatDate(tutorial.created_at);
            document.getElementById('tutorial_updated_at').value = tutorial.updated_at ? formatDate(tutorial.updated_at) : '';
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
        title: document.getElementById('title').value,
        article: document.getElementById('article').value,
        picture: document.getElementById('picture').value,
        theme: document.getElementById('theme').value,
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString()
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

    const currentDate = new Date();

    const updatedTutorial = {
        title: document.getElementById('title').value,
        article: document.getElementById('article').value,
        picture: document.getElementById('picture').value,
        theme: document.getElementById('theme').value,
        updated_at: currentDate.toISOString()
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
            document.getElementById('tutorial_updated_at').value = formatDate(currentDate.toISOString());
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
        const response = await fetch(`/api/tutorials/${currentTutorialId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Tutoriel supprimé avec succès");
            clearTutorialDetails();
            fetchTutorials();
        } else {
            alert("Erreur lors de la suppression du tutoriel");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du tutoriel :', error);
    }
}

function clearTutorialDetails() {
    document.getElementById('title').value = "";
    document.getElementById('article').value = "";
    document.getElementById('picture').value = "";
    document.getElementById('theme').value = "";
    document.getElementById('imagePreview').src = "";
    document.getElementById('tutorial_created_at').value = "";
    document.getElementById('tutorial_updated_at').value = "";
}