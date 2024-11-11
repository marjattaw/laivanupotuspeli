// Määritetään peliruudukon koko ja laivat
const gridSize = 10;
const gridElement = document.getElementById("grid");
const messageElement = document.getElementById("message");
const shipStatusElement = document.getElementById("shipStatus");

const ships = [
    { name: "Lentotukialus", size: 5, hits: 0 },
    { name: "Taistelulaiva", size: 4, hits: 0 },
    { name: "Risteilijä", size: 3, hits: 0 },
    { name: "Risteilijä", size: 3, hits: 0 },
    { name: "Hävittäjä", size: 2, hits: 0 },
    { name: "Hävittäjä", size: 2, hits: 0 },
    { name: "Hävittäjä", size: 2, hits: 0 },
    { name: "Sukellusvene", size: 1, hits: 0 },
    { name: "Sukellusvene", size: 1, hits: 0 },
    { name: "Sukellusvene", size: 1, hits: 0 },
    { name: "Sukellusvene", size: 1, hits: 0 }
];

// Laivojen sijainnit
let shipLocations = [];

// Funktio pelin uudelleenkäynnistykseen
function restartGame() {
    gridElement.innerHTML = ""; // Tyhjentää ruudukon
    messageElement.textContent = ""; // Tyhjentää viestit
    shipLocations = []; // Nollaa laivojen sijainnit
    ships.forEach(ship => ship.hits = 0); // Nollaa osumat laivoille
    createGrid(); // Luo uusi ruudukko
    placeShips(); // Sijoittaa laivat ruudukkoon
    updateShipStatus(); // Päivittää laivalistan
    console.log("Peli aloitettu uudelleen");
}

// Luo peliruudukko
function createGrid() {
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
    console.log("Ruudukko luotu");
}

// Sijoitetaan laivat satunnaisesti ruudukkoon
function placeShips() {
    ships.forEach(ship => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * gridSize);

            if (canPlaceShip(startRow, startCol, ship.size, direction)) {
                placeShip(startRow, startCol, ship.size, direction, ship);
                placed = true;
            }
        }
    });
    console.log("Laivat sijoitettu:", shipLocations);
}

// Tarkistaa, että laiva voidaan sijoittaa tiettyyn paikkaan
function canPlaceShip(row, col, size, direction) {
    for (let i = 0; i < size; i++) {
        const currentRow = direction === "horizontal" ? row : row + i;
        const currentCol = direction === "horizontal" ? col + i : col;

        if (
            currentRow >= gridSize ||
            currentCol >= gridSize ||
            shipLocations.some(loc => loc.row === currentRow && loc.col === currentCol)
        ) {
            return false;
        }
    }
    return true;
}

// Sijoittaa laivan ruudukkoon
function placeShip(row, col, size, direction, ship) {
    for (let i = 0; i < size; i++) {
        const currentRow = direction === "horizontal" ? row : row + i;
        const currentCol = direction === "horizontal" ? col + i;
        shipLocations.push({ row: currentRow, col: currentCol, ship });
    }
}

// Funktio käsittelemään ruutujen klikkaukset
function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const hitLocation = shipLocations.find(loc => loc.row === row && loc.col === col);
    if (hitLocation) {
        cell.classList.add("hit");
        hitLocation.ship.hits++;
        messageElement.textContent = "Osuit laivaan!";
        updateShipStatus();
    } else {
        cell.classList.add("miss");
        messageElement.textContent = "Ohi meni! Yritä uudelleen.";
    }
    cell.removeEventListener("click", handleCellClick);

    checkWinCondition();
}

// Päivittää laivojen tilalistan
function updateShipStatus() {
    shipStatusElement.innerHTML = '';
    ships.forEach(ship => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ship.name} - ${ship.hits >= ship.size ? 'Upotettu' : 'Jäljellä'}`;
        shipStatusElement.appendChild(listItem);
    });
}

// Funktio tarkistamaan, onko peli voitettu
function checkWinCondition() {
    const hits = document.querySelectorAll(".hit").length;
    const totalShipCells = shipLocations.length;

    if (hits === totalShipCells) {
        messageElement.textContent = "Kaikki laivat upotettu! Voitit pelin!";
        endGame();
    }
}

// Funktio lopettamaan peli onnistuneen osuman jälkeen
function endGame() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.removeEventListener("click", handleCellClick);
    });
    console.log("Peli päättynyt");
}

// Kutsutaan pelin uudelleenkäynnistys alussa
restartGame();
