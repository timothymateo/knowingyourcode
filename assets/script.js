//***************************begin variables section*************************//
// time and score
let timeEl = document.querySelector("p.time");
let secondsLeft = 120;
let scoreEl = document.querySelector("#score");

//****different levels of page****//
// introduction level
let introEl = document.querySelector("#intro");
//question level - intro will disappear
let questionsEl = document.querySelector("#questions");
//question displayed level
let questionEl = document.querySelector("#question");
//question count
let questionCount = 0;
//yes or no div
let yesnoEl = document.querySelector("#yesno");
//final level
let finalEl = document.querySelector("#final");
//user initial level
let initialsInput = document.querySelector("#initials");
// highscores level
let highscoresEl = document.querySelector("#highscores");
//high score list level
let scoreListEl = document.querySelector("#score-list");
//array to store high scores from current run times and local storage
let scoreList = [];

//****buttons on page*****//
// start quiz here button | begins quiz
let startBtn = document.querySelector("#start");
// answer button class
let ansBtn = document.querySelectorAll("button.ansBtn")
// first possible answer in list | button
let ans1Btn = document.querySelector("#answr1");
// second possible answer in list | button
let ans2Btn = document.querySelector("#answr2");
// third possible answer in list | button
let ans3Btn = document.querySelector("#answr3");
// fourth possible answer in list | button
let ans4Btn = document.querySelector("#answr4");
// submit button add initial to score list
let submitScrBtn = document.querySelector("#submit-score");
// Go back to beginning of quiz | button
let goBackBtn = document.querySelector("#goback");
// Clear high scores | button
let clearScrBtn = document.querySelector("#clearScores");
// View high scores [upper left] | button
let viewScrBtn = document.querySelector("#view-scores");

// Object for question, answer, true/false
let questions = [ // array of objects
    {
        // question 0
        question: "JavaScript is a ____-side programming language.",
        answers: ["1. client", "2. server", "3. both", "4. none"],
        correctAnswer: "2"
    },
    {
        // question 1
        question: "The condition in an if / else statement is enclosed within ____.",
        answers: ["1. quotes", "2. curly brackets", "3. parentheses", "4. square brackets"],
        correctAnswer: "1"
    },
    {
        // question 2
        question: "Which JavaScript label catches all the values, except for the ones specified?",
        answers: ["1. catch", "2. label", "3. try", "4. default"],
        correctAnswer: "3"
    },
    {
        // question 3
        question: "String values must be enclosed within ____ when being assigned to variables.",
        answers: ["1. commmas", "2. curly brackets", "3. quotes", "4. parentheses"],
        correctAnswer: "2"
    },
    {
        // question 4
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: ["1. Javascript", "2. terminal/bash", "3. for loops", "4. console.log"],
        correctAnswer: "3"
    }
];
//*******************************end variables section********************************//

//******************************begin functions section******************************//

// timer for quiz and points keeping
function setTime() {
    let timerInterval = setInterval(function () {
        secondsLeft--;
        timeEl.textContent = `Time:${secondsLeft}s`;

        if (secondsLeft === 0 || questionCount === questions.length) {
            clearInterval(timerInterval);
            questionsEl.style.display = "none";
            finalEl.style.display = "block";
            scoreEl.textContent = secondsLeft;
        }
    }, 1000);
}

// start quiz with timer, set up questions, and remove start level
function startQuiz() {
    introEl.style.display = "none";
    questionsEl.style.display = "block";
    questionCount = 0;

    setTime();
    setQuestion(questionCount);
}

// function to set question; takes in a count and displays the next question/answers
function setQuestion(id) {
    if (id < questions.length) {
        questionEl.textContent = questions[id].question;
        ans1Btn.textContent = questions[id].answers[0];
        ans2Btn.textContent = questions[id].answers[1];
        ans3Btn.textContent = questions[id].answers[2];
        ans4Btn.textContent = questions[id].answers[3];
    }
}

// function to check answer and then move to next question
function checkAnswer(event) {
    event.preventDefault();

// show section for yesno and append message
    yesnoEl.style.display = "block";
    let p = document.createElement("p");
    yesnoEl.appendChild(p);

// time out after 1 second
    setTimeout(function () {
        p.style.display = 'none';
    }, 1000);

// answer checker
    if (questions[questionCount].correctAnswer === event.target.value) {
        p.textContent = "You got it!";
    } else if (questions[questionCount].correctAnswer !== event.target.value) {
        secondsLeft = secondsLeft - 10;
        p.textContent = "Sorry, try again!";
    }

// increment so the questions index is increased
    if (questionCount < questions.length) {
        questionCount++;
    }
// call setQuestion to bring in next question when any ansBtn is clicked
    setQuestion(questionCount);
}

function addScore(event) {
    event.preventDefault();

    finalEl.style.display = "none";
    highscoresEl.style.display = "block";

    let init = initialsInput.value.toUpperCase();
    scoreList.push({ initials: init, score: secondsLeft });

// sort scores
    scoreList = scoreList.sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        } else {
          return -1;
        }
      });
   
    scoreListEl.innerHTML="";
    for (let i = 0; i < scoreList.length; i++) {
        let li = document.createElement("li");
        li.textContent = `${scoreList[i].initials}: ${scoreList[i].score}`;
        scoreListEl.append(li);
    }

// Add to local storage
    storeScores();
    displayScores();
}

function storeScores() {
    localStorage.setItem("scoreList", JSON.stringify(scoreList));
}

function displayScores() {
// Get stored scores from localStorage
// Parsing the JSON string to an object
    let storedScoreList = JSON.parse(localStorage.getItem("scoreList"));

// If scores were retrieved from localStorage, update the scorelist array to it
    if (storedScoreList !== null) {
        scoreList = storedScoreList;
    }
}

// clear scores
function clearScores() {
    localStorage.clear();
    scoreListEl.innerHTML="";
}

// EventListeners
// Start timer and display first question when click start quiz
startBtn.addEventListener("click", startQuiz);

// Check answers loop
ansBtn.forEach(item => {
    item.addEventListener('click', checkAnswer);
});

// Add score
submitScrBtn.addEventListener("click", addScore);

// Go Back Button
goBackBtn.addEventListener("click", function () {
    highscoresEl.style.display = "none";
    introEl.style.display = "block";
    secondsLeft = 120;
    timeEl.textContent = `Time:${secondsLeft}s`;
});

// Clear the scores [EventTarget.addEventListener()]
clearScrBtn.addEventListener("click", clearScores);

// View/Hide High Scores Button
viewScrBtn.addEventListener("click", function () {
    if (highscoresEl.style.display === "none") {
        highscoresEl.style.display = "block";
    } else if (highscoresEl.style.display === "block") {
        highscoresEl.style.display = "none";
    } else {
        return alert("No high scores to show yet! Let's play!");
    }
});