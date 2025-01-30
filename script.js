// Load materials and deleted items from local storage
let materials = JSON.parse(localStorage.getItem("materials")) || [];
let recycleBin = JSON.parse(localStorage.getItem("recycleBin")) || [];

const materialsContainer = document.getElementById("materialsContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const recycleBinContainer = document.getElementById("recycleBinContainer");
const recycleBinItems = document.getElementById("recycleBinItems");

const showMaterials = document.getElementById("showMaterials");
const showFavorites = document.getElementById("showFavorites");
const showRecycleBin = document.getElementById("showRecycleBin");
const clearRecycleBin = document.getElementById("clearRecycleBin");

const searchBar = document.getElementById("searchBar");

// Open publish modal
document.getElementById("publishBtn").addEventListener("click", () => {
    document.getElementById("publishModal").style.display = "flex";
});

// Close publish modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("publishModal").style.display = "none";
});

// Submit new post
document.getElementById("submitPost").addEventListener("click", () => {
    const title = document.getElementById("titleInput").value;
    const description = document.getElementById("descriptionInput").value;
    const link = document.getElementById("linkInput").value;
    const grade = document.getElementById("gradeInput").value;
    const semester = document.getElementById("semesterInput").value;
    const subject = document.getElementById("subjectInput").value;
    const school = document.getElementById("schoolInput").value;
    const form = document.getElementsByClassName("modal-content");

    if (title && link) {
        materials.push({ title, description, link, grade, semester, subject, school, isFavorite: false });
        localStorage.setItem("materials", JSON.stringify(materials));
        displayMaterials();
        document.getElementById("publishModal").style.display = "none";
        
    } else {
        alert("Please fill in all fields.");
    }
});

// Display materials
function displayMaterials() {
    materialsContainer.innerHTML = "";
    materials.forEach((mat, index) => {
        const materialDiv = document.createElement("div");
        materialDiv.classList.add("material");
        materialDiv.innerHTML = `
            <h3>${mat.title}</h3>
            <p>${mat.description}</p>
            <p><a href="${mat.link}" target="_blank">Material Link</a></p>
            <p><strong>${mat.grade}</strong> - ${mat.semester} - ${mat.subject} - ${mat.school}</p>
            <span class="favorite" onclick="toggleFavorite(${index})">${mat.isFavorite ? "⭐" : "☆"}</span>
            <button class="deleteBtn" onclick="deleteMaterial(${index})">Delete</button>
        `;
        materialsContainer.appendChild(materialDiv);
    });
}

// Display favorites
function displayFavorites() {
    favoritesContainer.innerHTML = "";
    const favorites = materials.filter(mat => mat.isFavorite);
    favorites.forEach((mat, index) => {
        const favoriteDiv = document.createElement("div");
        favoriteDiv.classList.add("material");
        favoriteDiv.innerHTML = `
            <h3>${mat.title}</h3>
            <p>${mat.description}</p>
            <p><a href="${mat.link}" target="_blank">Material Link</a></p>
            <p><strong>${mat.grade}</strong> - ${mat.semester} - ${mat.subject} - ${mat.school}</p>
            <span class="favorite" onclick="toggleFavorite(${index})">${mat.isFavorite ? "⭐" : "☆"}</span>
            <button class="deleteBtn" onclick="deleteMaterial(${index})">Delete</button>
        `;
        favoritesContainer.appendChild(favoriteDiv);
    });
}

// Toggle favorites
function toggleFavorite(index) {
    materials[index].isFavorite = !materials[index].isFavorite;
    localStorage.setItem("materials", JSON.stringify(materials));
    displayMaterials();
    displayFavorites();
}

// Delete material
function deleteMaterial(index) {
    recycleBin.push(materials[index]);
    materials.splice(index, 1);
    updateStorage();
    displayMaterials();
    displayFavorites();
    displayRecycleBin();
}

// Restore material
function restoreMaterial(index) {
    materials.push(recycleBin[index]);
    recycleBin.splice(index, 1);
    updateStorage();
    displayMaterials();
    displayFavorites();
    displayRecycleBin();
}

// Empty recycle bin
clearRecycleBin.addEventListener("click", () => {
    recycleBin = [];
    updateStorage();
    displayRecycleBin();
});

// Display recycle bin
function displayRecycleBin() {
    recycleBinItems.innerHTML = "";
    recycleBin.forEach((mat, index) => {
        const binDiv = document.createElement("div");
        binDiv.classList.add("recycle-item");
        binDiv.classList.add("recycle-item");
        binDiv.innerHTML = `
            <h3>${mat.title}</h3>
            <p>${mat.description}</p>
            <p><a href="${mat.link}" target="_blank">Material Link</a></p>
            <p><strong>${mat.grade}</strong> - ${mat.semester} - ${mat.subject} - ${mat.school}</p>
            <button class="restoreBtn" onclick="restoreMaterial(${index})">Restore</button>
        `;
        recycleBinItems.appendChild(binDiv);
    });
}

// Update localStorage
function updateStorage() {
    localStorage.setItem("materials", JSON.stringify(materials));
    localStorage.setItem("recycleBin", JSON.stringify(recycleBin));
}

// Search function
searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase();
    document.querySelectorAll(".material").forEach(mat => {
        mat.style.display = mat.innerText.toLowerCase().includes(searchText) ? "block" : "none";
    });
});

// Event Listeners for Views
showMaterials.addEventListener("click", () => {
    materialsContainer.style.display = "block";
    favoritesContainer.style.display = "none";
    recycleBinContainer.style.display = "none";
    displayMaterials();
});

showFavorites.addEventListener("click", () => {
    materialsContainer.style.display = "none";
    favoritesContainer.style.display = "block";
    recycleBinContainer.style.display = "none";
    displayFavorites();
});

showRecycleBin.addEventListener("click", () => {
    materialsContainer.style.display = "none";
    favoritesContainer.style.display = "none";
    recycleBinContainer.style.display = "block";
    displayRecycleBin();
});

// Filter function
function applyFilters() {
    const grade = document.getElementById("gradeFilter").value;
    const semester = document.getElementById("semesterFilter").value;
    const subject = document.getElementById("subjectFilter").value;
    const school = document.getElementById("schoolFilter").value;

    materials.forEach((mat, index) => {
        const materialDiv = materialsContainer.children[index];
        const gradeMatch = grade === "All Grades" || mat.grade === grade;
        const semesterMatch = semester === "All Semesters" || mat.semester === semester;
        const subjectMatch = subject === "All Subjects" || mat.subject === subject;
        const schoolMatch = school === "All Schools" || mat.school === school;

        materialDiv.style.display = gradeMatch && semesterMatch && subjectMatch && schoolMatch ? "block" : "none";
    });
}

document.getElementById("gradeFilter").addEventListener("change", applyFilters);
document.getElementById("semesterFilter").addEventListener("change", applyFilters);
document.getElementById("subjectFilter").addEventListener("change", applyFilters);
document.getElementById("schoolFilter").addEventListener("change", applyFilters);

// Load materials on page load
displayMaterials();
displayRecycleBin();

// Toggle Hamburger Menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});