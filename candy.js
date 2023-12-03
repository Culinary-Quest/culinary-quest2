var foods = ["bread", "ccake", "icecream", "jam", "gummy", "cake", "donut"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var high_score = window.localStorage.getItem('');
var targetScore = 650;

var currTile;
var otherTile;

var boardCreated = false;
var elapsedTime = 0;
var miniTime = 0;

window.onload = function() {
    if ( document.URL.includes("game.html") ) {
        generateBoard();
        if (window.localStorage.getItem('high_score')) {
            high_score = window.localStorage.getItem('high_score');
        }
        console.log(high_score);

        // Update every second
        var timer = setInterval(function(){
            match();
            slideFood();
            generateFood();
            let perm_score = score;
            window.localStorage.setItem('perm_score', perm_score);

            if (perm_score > high_score) {
                let high_score = perm_score;
                window.localStorage.setItem('high_score', high_score);
            }

            // checkGameStatus();
            miniTime += 1;  // Increase mini time by 1/10 second
            elapsedTime = Math.floor(miniTime / 10);

            // Update the content of the running time element
            document.getElementById("time").innerText = "Running Time: " + elapsedTime + " seconds";
            

            // Set a timer for 1 minute
            if (elapsedTime >= 60) {
                clearInterval(timer); // Stop the timer
                if (score < targetScore) {
                    lose();
                } else {
                    win();
                }
            }
        }, 100);
    } else {
        let perm_score = window.localStorage.getItem('perm_score');
        high_score = window.localStorage.getItem('high_score');
        document.getElementById("score").innerText = perm_score;
        document.getElementById("highscore").innerText = high_score;
    }
    
}


function randomFood() {
    return foods[Math.floor(Math.random() * foods.length)]; //0 - 5.99
}

//Creates board for the Game
function generateBoard() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomFood() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a food, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on food, moving mouse to drag the food
            tile.addEventListener("dragenter", dragEnter); //dragging food onto another food
            tile.addEventListener("dragleave", dragLeave); //leave food over another food
            tile.addEventListener("drop", dragDrop); //dropping a food over another food
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap food

            document.getElementById("board").append(tile);
            row.push(tile); //Creates row
        }
        board.push(row);
    }

    console.log(board);
    boardCreated = true;

}


// function startScore() {
//     if (boardCreated == true) {
//         score = 0;
//         high_score = window.localStorage.getItem('high_score');
//         console.log(high_score);
//     }
// }


function dragStart() {
    //this refers to tile that was clicked on for dragging
    if (boardCreated == true) {
        boardCreated = false;
    }
    currTile = this;
}

function dragOver(e) {
    if (boardCreated == true) {
        boardCreated = false;
    }
    e.preventDefault();
}

function dragEnter(e) {
    if (boardCreated == true) {
        boardCreated = false;
    }
    e.preventDefault();
}

function dragLeave() {
    if (boardCreated == true) {
        boardCreated = false;
    }

}

function dragDrop() {
    if (boardCreated == true) {
        boardCreated = false;
    }
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {
    if (boardCreated == true) {
        boardCreated = false;
    }

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

//when there is a match
function match() {
    if (boardCreated == true) {
        score = 0;
    }   
    threeInRow();
    document.getElementById("score").innerText = score;

}

function threeInRow() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

//checks if swap is valid
function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}


function slideFood() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateFood() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomFood() + ".png";
        }
    }
}


function lose() {
    // redirecting to game over HTML page:
    window.location.href = "lose.html";

}

function win() {
    window.location.href = "win.html";
}