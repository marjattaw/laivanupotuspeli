// Määritetään peliruudukon koko ja laivat
const gridSize = 10;
const gridElement = document.getElementById("grid");
const messageElement = document.getElementById("message");

const ships = [
    { name: "Lentotukialus", size: 5 },
    { name: "Taistelulaiva", size: 4 },
    { name: "Risteilijä", size: 3 },
    { name: "Risteilijä", size: 3 },
    { name: "Hävittäjä", size: 2 },
    { name: "Hävittäjä", size: 2 },
    { name: "Hävittäjä", size: 2 },
    { name: "Sukellusvene", size: 1 },
    { name: "Sukellusvene", size: 1 },
    { name: "Sukellusvene", size: 1 },
    { name: "Sukellusvene", size: 1 }
];

// Laivojen sijainnit
let shipLocations = [];

// Äänitiedostot
const hitSound = new Audio("voices/pommi.mp3");
const missSound = new Audio("voices/huti.mp3");
const loseSound = new Audio("voice/lose.mp3");
const winSound = new Audio("voice/win.mp3");
hitSound.preload = "auto";
missSound.preload = "auto";
loseSound.preload = "auto";
winSound.preload = "auto";

// Funktio pelin uudelleenkäynnistykseen
function restartGame() {
    gridElement.innerHTML = ""; // Tyhjentää ruudukon
    messageElement.textContent = ""; // Tyhjentää viestit
    shipLocations = []; // Nollaa laivojen sijainnit
    createGrid(); // Luo uusi ruudukko
    placeShips(); // Sijoittaa laivat ruudukkoon
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
                placeShip(startRow, startCol, ship.size, direction);
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
function placeShip(row, col, size, direction) {
    for (let i = 0; i < size; i++) {
        const currentRow = direction === "horizontal" ? row : row + i;
        const currentCol = direction === "horizontal" ? col + i : col;
        shipLocations.push({ row: currentRow, col: currentCol });
    }
}

// Funktio käsittelemään ruutujen klikkaukset
function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Tarkistetaan, osuiko klikkaus laivaan
    if (shipLocations.some(loc => loc.row === row && loc.col === col)) {
        cell.classList.add("hit");
        messageElement.textContent = "Osuit laivaan!";
        hitSound.currentTime = 0; // Nollaa äänen aikakohdan, jos ääni soitetaan nopeasti peräkkäin
        hitSound.play(); // Soittaa osumaäänen
    } else {
        cell.classList.add("miss");
        messageElement.textContent = "Ohi meni! Yritä uudelleen.";
        missSound.currentTime = 0;
        missSound.play(); // Soittaa hutiäänen
    }
    cell.removeEventListener("click", handleCellClick);

    // Tarkista, onko peli voitettu
    checkWinCondition();
}


// Funktio tarkistamaan, onko peli voitettu
function checkWinCondition() {
    const hits = document.querySelectorAll(".hit").length;
    const totalShipCells = shipLocations.length;

    if (hits === totalShipCells) {
        messageElement.classList.add("checkWinCondition")
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
    winSound.play(); // soittaa voittoäänen
    
}

// Kutsutaan pelin uudelleenkäynnistys alussa
restartGame();
