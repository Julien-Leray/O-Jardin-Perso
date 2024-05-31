function updateImagePreviewTuto(imageUrl = null) {
    if (!imageUrl) {
        imageUrl = document.getElementById('tutorialPicture').value;
    }
    const imagePreviewTuto = document.getElementById('imagePreviewTuto');
    imagePreviewTuto.src = imageUrl;
    imagePreviewTuto.style.display = imageUrl ? 'block' : 'none';
}

function updateImagePreviewDownloadTuto() {
    const fileInput = document.getElementById('tutorialImageUploadDownload');
    const imagePreviewTuto = document.getElementById('imagePreviewTuto');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreviewTuto.src = e.target.result; // Update the tutorial preview with the uploaded image
            imagePreviewTuto.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}function updateImagePreviewFruits(imageUrl = null) {
    const imagePreview = document.getElementById('fruit_imagePreview');
    if (imageUrl) {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
    } else {
        const fileInput = document.getElementById('fruit_imageUploadDownload');
        const file = fileInput?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }
}

function updateImagePreviewLegumes(imageUrl = null) {
    const imagePreview = document.getElementById('legume_imagePreview');
    if (imageUrl) {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
    } else {
        const fileInput = document.getElementById('legume_imageUploadDownload');
        const file = fileInput?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }
}

function updateImagePreviewDownload() {
    const fileInputFruits = document.getElementById('fruit_imageUploadDownload');
    const fileInputLegumes = document.getElementById('legume_imageUploadDownload');
    const imagePreviewFruits = document.getElementById('fruit_imagePreview');
    const imagePreviewLegumes = document.getElementById('legume_imagePreview');

    const fileFruits = fileInputFruits?.files[0];
    const fileLegumes = fileInputLegumes?.files[0];

    if (selectedCategory === 'Fruit' && fileFruits) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreviewFruits.src = e.target.result;
            imagePreviewFruits.style.display = 'block';
        }
        reader.readAsDataURL(fileFruits);
    } else if (selectedCategory === 'Vegetable' && fileLegumes) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreviewLegumes.src = e.target.result;
            imagePreviewLegumes.style.display = 'block';
        }
        reader.readAsDataURL(fileLegumes);
    }
}