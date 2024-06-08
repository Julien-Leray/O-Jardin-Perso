function updateImagePreviewTuto(imageUrl = null) {
    const imagePreview = document.getElementById('imagePreviewTuto');
    if (!imagePreview) {
        console.error('Element with ID "imagePreviewTuto" not found.');
        return;
    }

    if (imageUrl) {
        imagePreview.src = `${apiBaseUrl}${imageUrl}`;
        imagePreview.style.display = 'block';
    } else {
        const fileInput = document.getElementById('tutorialImageUploadDownload');
        if (!fileInput) {
            console.error('Element with ID "tutorialImageUploadDownload" not found.');
            return;
        }

        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    }
}


function updateImagePreviewFruits(imageUrl = null) {
    const imagePreview = document.getElementById('fruit_imagePreview');
    
    if (!imagePreview) {
        console.error('Element with ID "fruit_imagePreview" not found.');
        return;
    }
    
    if (imageUrl) {
        imagePreview.src = `${apiBaseUrl}${imageUrl}`;
        imagePreview.style.display = 'block';
    } else {
        const fileInput = document.getElementById('fruit_imageUploadDownload');
        
        if (!fileInput) {
            console.error('Element with ID "fruit_imageUploadDownload" not found.');
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    }
}

function updateImagePreviewLegumes(imageUrl = null) {
    const imagePreview = document.getElementById('legume_imagePreview');
    if (!imagePreview) {
        console.error('Element with ID "legume_imagePreview" not found.');
        return;
    }

    if (imageUrl) {
        imagePreview.src = `${apiBaseUrl}${imageUrl}`;
        imagePreview.style.display = 'block';
    } else {
        const fileInput = document.getElementById('legume_imageUploadDownload');
        if (!fileInput) {
            console.error('Element with ID "legume_imageUploadDownload" not found.');
            return;
        }

        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
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