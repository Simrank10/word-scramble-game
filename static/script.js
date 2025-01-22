let timer;
let timeLeft = 60;  // 1-minute timer
let score = 0;
let originalWord = '';
let currentDifficulty = null; // Store the selected difficulty

function startGame(difficulty) {
    // Set current difficulty and hide welcome screen
    currentDifficulty = difficulty;
    $('#welcome').hide();
    $('#game').removeClass('hidden');

    // Reset timer
    timeLeft = 60;
    $('#timer').text("Time Left: " + timeLeft);
    startTimer();

    // Send POST request to start a new game with the selected difficulty
    $.post("/start_game", {difficulty: difficulty}, function(response) {
        if(response.scrambled_word) {
            $('#scrambled_word').text("Scrambled Word: " + response.scrambled_word);
            originalWord = response.original_word;
        } else {
            alert("Error: " + response.error);
        }
    }).fail(function(xhr, status, error) {
        console.error("Error: ", error);
        alert("Failed to start game.");
    });
}

function startTimer() {
    const progressBar = $('#progress-bar');
    const interval = setInterval(function() {
        timeLeft--;
        $('#timer').text("Time Left: " + timeLeft);
        const progressWidth = (timeLeft / 60) * 100;
        progressBar.css("width", progressWidth + "%");

        if(timeLeft <= 0) {
            clearInterval(interval);
            alert("Time's up! Game Over!");
            resetGame();
        }
    }, 1000);
}

function checkGuess() {
    let userGuess = $('#guess').val().trim().toLowerCase();

    $.post("/check_guess", {guess: userGuess, original_word: originalWord}, function(response) {
        if(response.result === 'correct') {
            score += response.score;
            alert("Correct! You scored 10 points.");
        } else {
            alert("Incorrect! The correct word was " + response.correct_word);
        }

        $('#score').text("Score: " + score);
        resetGame();
    }).fail(function(xhr, status, error) {
        console.error("Error: ", error);
        alert("Failed to check guess.");
    });
}

function resetGame() {
    $('#guess').val('');
    timeLeft = 60;
    $('#timer').text("Time Left: " + timeLeft);
    startGame(currentDifficulty); // Use the same difficulty for the next round
}