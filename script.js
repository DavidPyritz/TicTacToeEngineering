let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle'; // Initialisierung des aktuellen Spielers

function init() {
    fields = [null, null, null, null, null, null, null, null, null]; // Zurücksetzen der Felder
    currentPlayer = 'circle'; // Zurücksetzen des aktuellen Spielers
    clearWinningLine(); // Entfernen der Gewinnlinie, falls vorhanden
    render(); // Spielfeld erneut rendern
}

function render() {
    const contentDiv = document.getElementById('content');
    let tableHTML = '<table class="game-board">';

    for (let row = 0; row < 3; row++) {
        tableHTML += '<tr>';
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            const fieldValue = fields[index];
            let symbol = '';

            if (fieldValue === 'circle') {
                symbol = generateAnimatedCircleSVG();
            } else if (fieldValue === 'cross') {
                symbol = generateAnimatedXSVG();
            }

            tableHTML += `<td id="cell-${index}" onclick="handleClick(${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';
    contentDiv.innerHTML = tableHTML;
}

function handleClick(index) {
    if (fields[index] !== null) {
        return; // falls das Feld bereits belegt ist, nichts tun
    }

    // Setze den aktuellen Spieler (circle oder cross) in das Feld
    fields[index] = currentPlayer;

    // Füge das Symbol direkt in das angeklickte <td>-Element ein
    const cell = document.getElementById(`cell-${index}`);
    if (currentPlayer === 'circle') {
        cell.innerHTML = generateAnimatedCircleSVG();
    } else {
        cell.innerHTML = generateAnimatedXSVG();
    }

    // Entferne das onclick-Attribut, um weitere Klicks auf dieses <td> zu verhindern
    cell.onclick = null;

    // Überprüfe, ob das Spiel gewonnen wurde
    const winner = checkWin();
    if (winner) {
        drawWinningLine(winner);
        // Deaktiviere alle weiteren Klicks nach dem Sieg
        for (let i = 0; i < 9; i++) {
            document.getElementById(`cell-${i}`).onclick = null;
        }
        return;
    }

    // Wechsel den Spieler
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
}

function checkWin() {
    // Gewinnkombinationen im Tic-Tac-Toe
    const winningCombinations = [
        [0, 1, 2], // obere Reihe
        [3, 4, 5], // mittlere Reihe
        [6, 7, 8], // untere Reihe
        [0, 3, 6], // linke Spalte
        [1, 4, 7], // mittlere Spalte
        [2, 5, 8], // rechte Spalte
        [0, 4, 8], // Diagonale von links oben nach rechts unten
        [2, 4, 6]  // Diagonale von rechts oben nach links unten
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination; // Rückgabe der siegreichen Kombination
        }
    }
    return null; // Kein Sieger
}

function drawWinningLine(winningCombination) {
    const lineColor = '#FFFFFF';
    const cellPositions = winningCombination.map(index => {
        return document.getElementById(`cell-${index}`).getBoundingClientRect();
    });

    const startX = (cellPositions[0].left + cellPositions[0].right) / 2;
    const startY = (cellPositions[0].top + cellPositions[0].bottom) / 2;
    const endX = (cellPositions[2].left + cellPositions[2].right) / 2;
    const endY = (cellPositions[2].top + cellPositions[2].bottom) / 2;

    const svgLine = `
    <svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">
        <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="${lineColor}" stroke-width="4" />
    </svg>
    `;

    document.body.insertAdjacentHTML('beforeend', svgLine);
}

function clearWinningLine() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => svg.remove());
}

function generateAnimatedCircleSVG() {
    const svg = `
    <svg width="60" height="60" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <!-- Hintergrundkreis -->
        <circle cx="35" cy="35" r="30" stroke="#3498db" stroke-width="5" fill="none" />
        
        <!-- Animierter Kreis -->
        <circle cx="35" cy="35" r="30" stroke="#3498db" stroke-width="5" fill="none"
                stroke-dasharray="188.4" stroke-dashoffset="188.4">
            <animate attributeName="stroke-dashoffset" from="188.4" to="0" dur="225ms" fill="freeze" />
        </circle>
    </svg>
    `;
    return svg;
}

function generateAnimatedXSVG() {
    const svg = `
    <svg width="60" height="60" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <!-- Hintergrundkreuz -->
        <line x1="15" y1="15" x2="55" y2="55" stroke="#4CAF50" stroke-width="5" fill="none" />
        <line x1="55" y1="15" x2="15" y2="55" stroke="#4CAF50" stroke-width="5" fill="none" />

        <!-- Animiertes Kreuz -->
        <line x1="15" y1="15" x2="55" y2="55" stroke="#4CAF50" stroke-width="5" fill="none"
              stroke-dasharray="56.57" stroke-dashoffset="56.57">
            <animate attributeName="stroke-dashoffset" from="56.57" to="0" dur="225ms" fill="freeze" />
        </line>
        <line x1="55" y1="15" x2="15" y2="55" stroke="#4CAF50" stroke-width="5" fill="none"
              stroke-dasharray="56.57" stroke-dashoffset="56.57">
            <animate attributeName="stroke-dashoffset" from="56.57" to="0" dur="225ms" fill="freeze" />
        </line>
    </svg>
    `;
    return svg;
}

// Initialisiere das Spiel
init();