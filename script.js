let Questions = [];
const ques = document.getElementById("ques");

async function fetchQuestions() {
    try {
        ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
        
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error('Unable to fetch data');
        }
        const data = await response.json();
        Questions = data.results;

        if (Questions.length === 0) {
            throw new Error('No questions found');
        }

        loadQues(); 
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
    }
}

fetchQuestions();

let currQuestion = 0;
let score = 0;

function loadQues() {
    if (Questions.length === 0) return;

    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;

    currentQuestion = currentQuestion
        .replace(/&quot;/g, '\"')
        .replace(/&#039;/g, "'");

    ques.innerText = currentQuestion;
    opt.innerHTML = ""; 

    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

    options.forEach((optText) => {
        let cleanText = optText
            .replace(/&quot;/g, '\"')
            .replace(/&#039;/g, "'");

        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = optText;  
        choiceLabel.textContent = cleanText;

        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

function loadScore() {
    const totalScore = document.getElementById("score");

    if (Questions.length === 0) {
        totalScore.innerHTML = "<h5 style='color: red'>Unable to fetch data, please try again!</h5>";
        return;
    }

    totalScore.innerHTML = `<h3>You scored ${score} out of ${Questions.length}</h3><h3>All Answers</h3>`;
    
    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. Correct Answer: ${el.correct_answer}</p>`;
    });
}

function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("ques").remove();
        document.getElementById("btn").remove();
        loadScore();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    
    if (selectedAns && selectedAns.value === Questions[currQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}
