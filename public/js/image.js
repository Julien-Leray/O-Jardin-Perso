


function updateImagePreviewTuto() {
    const imageUrl = document.getElementById('tutorialPicture').value;
    const imagePreviewTuto = document.getElementById('imagePreviewTuto');
    if (imagePreviewTuto) {
        imagePreviewTuto.src = imageUrl;
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