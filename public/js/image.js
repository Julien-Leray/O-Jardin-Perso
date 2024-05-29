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
}


function updateImagePreviewProducts(imageUrl = null) {
    if (!imageUrl) {
        imageUrl = document.getElementById('productsPicture').value;
    }
    const imagePreviewProducts = document.getElementById('imagePreviewProducts');
    imagePreviewProducts.src = imageUrl;
    imagePreviewProducts.style.display = imageUrl ? 'block' : 'none';
}

function updateImagePreviewDownload() {
    const fileInput = document.getElementById('imageUploadDownload');
    const imagePreviewProducts = document.getElementById('imagePreviewProducts');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreviewProducts.src = e.target.result; // Update the products preview with the uploaded image
            imagePreviewProducts.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}