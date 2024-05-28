function updateImagePreviewTuto() {
    const imageUrl = document.getElementById('tutorialPicture').value;
    const imagePreviewTuto = document.getElementById('imagePreviewTuto');
    if (imagePreviewTuto) {
        imagePreviewTuto.src = imageUrl;
    }
}

let currentImageUrl = '';

function updateImagePreview() {
    const pictureUrl = document.getElementById('picture').value;
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = pictureUrl;
    imagePreview.style.display = 'block';
    document.getElementById('downloadButton').style.display = 'block';
    currentImageUrl = pictureUrl;
}

function updateImagePreviewDownload() {
    const file = document.getElementById('imageUploadDownload').files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = reader.result;
        imagePreview.style.display = 'block';
        document.getElementById('downloadButton').style.display = 'block';
        currentImageUrl = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    }
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function uploadImage() {
    const imageUpload = document.getElementById('imageUploadDownload').files[0];
    if (!imageUpload) {
        alert('Veuillez sélectionner une image à télécharger.');
        return;
    }

    const formData = new FormData();
    formData.append('picture', imageUpload);

    try {
        const response = await fetch(`/api/upload`, { // Assurez-vous d'utiliser le bon endpoint
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('picture').value = data.filePath; // Mettre à jour l'URL de l'image
            updateImagePreview(); // Mettre à jour l'aperçu de l'image
            alert("Image téléchargée avec succès");
        } else {
            const errorText = await response.text();
            alert("Erreur lors du téléchargement de l'image: " + errorText);
        }
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
    }
}