let selectedCategory = null;

function formatDate(isoString) {
    if (!isoString) return ''; // Retourner une chaîne vide si isoString est null ou undefined
    const date = new Date(isoString);
    const options = {
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return date.toLocaleString('fr-FR', options);
}



function hideAllSections() {
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('productDetails').style.display = 'none';
    document.getElementById('tutorialsSection').style.display = 'none';
    document.getElementById('tutorialDetails').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('userFormSection').style.display = 'none';
}



function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

