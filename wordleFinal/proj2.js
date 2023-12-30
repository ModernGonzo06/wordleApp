function wordleGame(attempt) { // main object that populates a word and the tools used when checking an input
    //against the targetWord. 
    //this.targetWordArray= ['apple', 'table', 'chair', 'spoon', 'bread', 'knife'],
    this.guesses = [],
    this.timesPlayed = attempt,
    //this.targetWord = this.targetWordArray[attempt%6]
    fetch("https://random-word-api.herokuapp.com/word?length=5") // retrieves a word from an API. 
        .then(response => response.json())
        .then(data => {
            this.targetWord = data[0].toLowerCase();
            this.SetupMap()
            console.log("The target word is " + this.targetWord + ".")
        })
    this.currentAttempt = 0,
    this.isGameWon = false,
    this.isGameOver = false,
    idsArray = [
        "r1c1", "r1c2", "r1c3", "r1c4", "r1c5",
        "r2c1", "r2c2", "r2c3", "r2c4", "r2c5",
        "r3c1", "r3c2", "r3c3", "r3c4", "r3c5",
        "r4c1", "r4c2", "r4c3", "r4c4", "r4c5",
        "r5c1", "r5c2", "r5c3", "r5c4", "r5c5",
        "r6c1", "r6c2", "r6c3", "r6c4", "r6c5"
    ],
    letterIdsArray = [
        "letterq", "letterw", "lettere", "letterr", "lettert", "lettery", "letteru", "letteri", "lettero", "letterp",
        "lettera", "letters", "letterd", "letterf", "letterg", "letterh", "letterj", "letterk", "letterl",
        "letterz", "letterx", "letterc", "letterv", "letterb", "lettern", "letterm"
    ];


    this.getIDS = () => {
        return idsArray;
    }
    this.getLetters = () => {
        return letterIdsArray
    }
    this.SetupMap = function () { // sets up in object mapping of letters to numbers. 
        for (let i = 0; i < 5; i++) { // resets map
            let char = this.targetWord[i]
            this[char] = 0;
        }
        for (let i = 0; i < 5; i++) { // does the mapping of letters to numbers

            let char = this.targetWord[i]
            if (this[char]) {
                this[char] += 1;
            }
            else {
                this[char] = 1;
            }
        }
    }
    this.getTimesPlayed = () => {
        return this.timesPlayed;
    }
    this.getTargetWord = () => {
        return this.targetWord;
    }
    this.getCurrentAttempt = () => {
        return this.currentAttempt;
    }
    this.gameIsWon = function () {
        this.isGameWon = true;
    }
    this.addAttempt = function () {
        this.currentAttempt += 1
    }
    this.gameIsOver = function () {
        this.isGameOver = true;
    }



};
Game = new wordleGame(0); // starts game
toggleButtons(Game)// toggles check Word or restart button appearance 
$("#checkWord").on('click', () => {

    var inputWord = $("#inputBox").val().toLowerCase();
    if (inputWord.length == 5) {
        if (inputWord == Game.getTargetWord()) { // if word is inputed, will toggle all boxes green in used letter 
            // board and main game board filling in the letters. 
            for (let i = 0; i < 5; i++) {
                currentBox = document.getElementById('r' + (Game.getCurrentAttempt() + 1) + 'c' + (i + 1))
                //row = Game.getCurrentAttempt() + 1
                //column = i + 1
                currentBox.innerText = inputWord[i];
                currentBox.style.backgroundColor = 'rgb(19, 245, 147)';
                currentLetter = document.getElementById("letter" + inputWord[i])
                currentLetter.style.backgroundColor = "rgb(19, 245, 147)"
            }
            Game.gameIsWon();
            toggleButtons(Game);
            alert("Congratulations! You guessed the word: " + Game.getTargetWord() + ". Click reset to play again!")
        }
        else {
            for (let i = 0; i < 5; i++) {
                currentBox = document.getElementById('r' + (Game.getCurrentAttempt() + 1) + 'c' + (i + 1))
                //row = Game.getCurrentAttempt() + 1
                //column = i + 1
                //console.log('r'+row + 'c' + column)
                currentBox.innerText = inputWord[i];
                currentLetter = document.getElementById("letter" + inputWord[i])
                if (inputWord[i] == Game.getTargetWord()[i]) { // if letter in right spot, marks in box and in keyboard
                    currentBox.style.backgroundColor = 'rgb(19, 245, 147)'
                    Game[inputWord[i]] -= 1
                    //console.log(inputWord[i] + ":" + Game[inputWord[i]])
                    currentLetter.style.backgroundColor = "rgb(19, 245, 147)"
                }
                else if (!Game.getTargetWord().includes(inputWord[i])) { // if letter not in word, marks as red. 
                    currentBox.style.backgroundColor = "red"
                    currentLetter.style.backgroundColor = "red"
                }

            }
            for (let i = 0; i < 5; i++) { // second loop to mark yellow letters
                currentBox = document.getElementById('r' + (Game.getCurrentAttempt() + 1) + 'c' + (i + 1))
                //row = Game.getCurrentAttempt() + 1
                //column = i + 1
                currentLetter = document.getElementById("letter" + inputWord[i])
                if (Game.getTargetWord().includes(inputWord[i]) && Game[inputWord[i]] > 0 
                && currentBox.style.backgroundColor != "rgb(19, 245, 147)") { // checks to see if letter is already marked green
                    currentBox.style.backgroundColor = "yellow"
                    Game[inputWord[i]] -= 1
                    if (currentLetter.style.backgroundColor != "rgb(19, 245, 147)") {
                        currentLetter.style.backgroundColor = "yellow"
                    }
                }
            }
            Game.SetupMap()
            Game.guesses.push(inputWord)
            Game.addAttempt();
            if (Game.getCurrentAttempt() == 6) { // after 6 attempts restart
                alert("Sorry, you ran out of tries. The correct word was " + Game.getTargetWord() + '.')
                Game.gameIsOver()
                toggleButtons(Game)
            }
        }
    }
    else {
        alert("Please provide a 5 letter word!")
    }
    document.getElementById('inputBox').value = "";
});

$('#restart').on('click', () => { // restarts game
    Game = new wordleGame(Game.timesPlayed + 1)
    Game.getIDS().forEach(element => {
        document.getElementById(element).innerText = "";
        document.getElementById(element).style.backgroundColor = 'rgb(240, 244, 245)'
    });
    Game.getLetters().forEach(element => {
        document.getElementById(element).style.backgroundColor = 'rgb(240, 244, 245)'
    })
    toggleButtons(Game);
    document.getElementById('inputBox').value = "";
});

function toggleButtons(Game) { // toggles restart and check buttons
    const resetButton = document.getElementById("restart");
    const checkButton = document.getElementById('checkWord')
    if (Game.isGameWon || Game.isGameOver) {
        resetButton.style.display = "block";
        checkButton.style.display = 'none'
    }
    else {
        resetButton.style.display = "none"
        checkButton.style.display = "block";
    }
}

document.querySelectorAll(".usedLetterBox").forEach(box => { // makes each letter in used letter board clickable for input.
    box.addEventListener("click", () => {
        const letter = box.innerText;
        const inputBox = document.getElementById("inputBox");
        inputBox.value += letter;
    });
});