// Määritetään peliruudukon koko
const gridSize = 5;
const gridElement = document.getElementById("grid");
const messageElement = document.getElementById("message");

// Asetetaan laivan sijainti satunnaisesti
const shipRow = Math.floor(Math.random() * gridSize);
const shipCol = Math.floor(Math.random() * gridSize);

// Luodaan peli-ruudukko
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener("click", handleCellClick);
        gridElement.appendChild(cell);
    }
}

// Funktio käsittelemään ruutujen klikkaukset
function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (row === shipRow && col === shipCol) {
        cell.classList.add("hit");
        messageElement.textContent = "Osuit laivaan! Voitit pelin!";
        endGame();
    } else {
        cell.classList.add("miss");
        cell.removeEventListener("click", handleCellClick);
        messageElement.textContent = "Ohi meni! Yritä uudelleen.";
    }
}

// Funktio lopettamaan peli onnistuneen osuman jälkeen
function endGame() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.removeEventListener("click", handleCellClick);
    });
}
