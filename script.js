const board = document.getElementById("sudoku-board");
const solveButton = document.getElementById("solve-button");
const clearButton = document.getElementById("clear-button");
const message = document.getElementById("message");


// Tworzenie planszy 9 × 9
for (let row = 0; row < 9; row++) {

    for (let col = 0; col < 9; col++) {

        const input = document.createElement("input");

        input.type = "text";
        input.maxLength = 1;

        input.classList.add("cell");

        input.dataset.row = row;
        input.dataset.col = col;

        // Pozwalamy wpisywać tylko cyfry 1–9
        input.addEventListener("input", function () {

            if (!/^[1-9]$/.test(this.value)) {
                this.value = "";
            }

        });

        board.appendChild(input);
    }
}


// Pobieranie Sudoku z planszy
function getBoard() {

    const inputs = document.querySelectorAll(".cell");

    const sudoku = [];

    for (let row = 0; row < 9; row++) {

        sudoku[row] = [];

        for (let col = 0; col < 9; col++) {

            const index = row * 9 + col;

            const value = inputs[index].value;

            sudoku[row][col] = value === "" ? 0 : Number(value);
        }
    }

    return sudoku;
}


// Sprawdzanie, czy można wstawić daną cyfrę
function isValid(board, row, col, number) {

    // Sprawdzanie wiersza
    for (let c = 0; c < 9; c++) {

        if (board[row][c] === number) {
            return false;
        }
    }


    // Sprawdzanie kolumny
    for (let r = 0; r < 9; r++) {

        if (board[r][col] === number) {
            return false;
        }
    }


    // Sprawdzanie kwadratu 3 × 3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {

        for (let c = startCol; c < startCol + 3; c++) {

            if (board[r][c] === number) {
                return false;
            }
        }
    }

    return true;
}


// Właściwy algorytm rozwiązywania Sudoku
function solveSudoku(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            // Szukamy pustego pola
            if (board[row][col] === 0) {

                // Próbujemy cyfry od 1 do 9
                for (let number = 1; number <= 9; number++) {

                    if (isValid(board, row, col, number)) {

                        board[row][col] = number;

                        // Rekurencyjnie próbujemy rozwiązać resztę
                        if (solveSudoku(board)) {
                            return true;
                        }

                        // Jeżeli się nie udało,
                        // cofamy zmianę
                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    // Nie ma już pustych pól
    return true;
}


// Wpisywanie rozwiązania do planszy
function displayBoard(board) {

    const inputs = document.querySelectorAll(".cell");

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const index = row * 9 + col;

            inputs[index].value =
                board[row][col] === 0
                ? ""
                : board[row][col];
        }
    }
}


// Przycisk „Rozwiąż”
solveButton.addEventListener("click", function () {

    message.textContent = "";

    const sudoku = getBoard();

    // Kopia planszy
    const originalBoard = sudoku.map(row => [...row]);

    if (solveSudoku(sudoku)) {

        displayBoard(sudoku);

        message.textContent = "Sudoku zostało rozwiązane.";

    } else {

        message.textContent =
            "Tego Sudoku nie da się rozwiązać.";
    }
});


// Przycisk „Wyczyść”
clearButton.addEventListener("click", function () {

    const inputs = document.querySelectorAll(".cell");

    inputs.forEach(input => {
        input.value = "";
    });

    message.textContent = "";
});
