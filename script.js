// =========================================================================
// ======================= আপনার পরিবর্তনের জায়গা ==========================
// =========================================================================

// ১. আপনার Apps Script URL টি এখানে পেস্ট করুন
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf_BVbC2bf47vd9Mizs39MFFUM5KcqfRKbakbf-lrZIfu39tp9pHURm95QUDJYlBCZ/exec'; // <-- এই '' এর ভেতরে আপনার নতুন URL টি দিন

// ২. আপনার নতুন প্রশ্নগুলো এখানে যোগ করুন
const allQuestions = [
    {
        question: "নিচের কোনটি ইনপুট ডিভাইস?",
        options: ["মনিটর", "প্রিন্টার", "কী-বোর্ড", "স্পীকার"],
        answer: "কী-বোর্ড",
        explanation: "ইনপুট ডিভাইস দিয়ে কম্পিউটারে তথ্য প্রবেশ করানো হয়। কী-বোর্ড একটি প্রধান ইনপুট ডিভাইস, যা দিয়ে লেখা ও নির্দেশ দেওয়া যায়।"
    },
    {
        question: "কম্পিউটারের কোন অংশটি প্রসেসিং করে?",
        options: ["কন্ট্রোল ইউনিট", "মেমোরি", "মাউস", "প্রসেসর"],
        answer: "প্রসেসর",
        explanation: "প্রসেসর বা সিপিইউ (CPU) হলো কম্পিউটারের মস্তিষ্ক। এটি সকল প্রকার ডেটা প্রক্রিয়াকরণ বা প্রসেসিং এর কাজ করে থাকে।"
    },
    {
        question: "সফটওয়্যার কী?",
        options: ["কাগজের যন্ত্র", "দৃশ্যমান যন্ত্রাংশ", "কাজের নির্দেশনা/প্রোগ্রাম", "বিদ্যুৎ উৎপাদক"],
        answer: "কাজের নির্দেশনা/প্রোগ্রাম",
        explanation: "সফটওয়্যার হলো অনেকগুলো প্রোগ্রামের সমষ্টি যা কম্পিউটারকে কোনো নির্দিষ্ট কাজ করার জন্য নির্দেশনা দেয়। এটিকে স্পর্শ করা যায় না।"
    },
    {
        question: "নিচের কোনটি হার্ডওয়্যার নয়?",
        options: ["মনিটর", "কীবোর্ড", "প্রিন্টার", "অঙ্কন সফটওয়্যার"],
        answer: "অঙ্কন সফটওয়্যার",
        explanation: "হার্ডওয়্যার হলো কম্পিউটারের সেইসব অংশ যা স্পর্শ করা যায়, যেমন মনিটর, কীবোর্ড। কিন্তু অঙ্কন সফটওয়্যার একটি প্রোগ্রাম, তাই এটি সফটওয়্যার।"
    },
    {
        question: "কম্পিউটার দিয়ে গান শুনতে হলে কী প্রয়োজন?",
        options: ["কীবোর্ড", "স্পিকার ও অডিও সফটওয়্যার", "ক্যামেরা", "ক্যালকুলেটর"],
        answer: "স্পিকার ও অডিও সফটওয়্যার",
        explanation: "গান শোনার জন্য শব্দ আউটপুট দেওয়ার যন্ত্র (স্পিকার) এবং গানটি চালানোর জন্য প্রয়োজনীয় প্রোগ্রাম (অডিও সফটওয়্যার) দুটোই প্রয়োজন।"
    }
];

// --- ক্লাস টেস্টের অন্যান্য সেটিংস ---
const QUESTIONS_PER_QUIZ = 5;
const TIME_PER_QUESTION = 50; // সেকেন্ড
const FEEDBACK_DELAY_MS = 1500;

// =========================================================================
// ================== নিচের কোডে পরিবর্তনের প্রয়োজন নেই =====================
// =========================================================================

// --- DOM ELEMENTS ---
const loginSection = document.getElementById('login-section');
const studentRollInput = document.getElementById('student-roll');
const pinInput = document.getElementById('pin-input');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');
const quizSection = document.getElementById('quiz-section');
const questionNumberSpan = document.getElementById('question-number');
const totalQuestionsSpan = document.getElementById('total-questions');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentScoreSpan = document.getElementById('current-score');
const feedbackElement = document.getElementById('feedback');
const resultSection = document.getElementById('result-section');
const participantNameSpan = document.getElementById('participant-name');
const participantRollSpan = document.getElementById('participant-roll');
const finalScoreSpan = document.getElementById('final-score');
const finalTotalSpan = document.getElementById('final-total');
const resultMessageElement = document.getElementById('result-message');
const submissionStatus = document.getElementById('submission-status');
const toggleReviewButton = document.getElementById('toggle-review-button');
const answerReviewSection = document.getElementById('answer-review-section');
const tabSwitchModal = document.getElementById('tab-switch-modal');
const timerSpan = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

// --- STATE VARIABLES ---
let studentInfo = {};
let quizStarted = false;
let timerInterval;
let submittedAnswers = [];
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// --- FUNCTIONS ---
function handleLogin() {
    const roll = studentRollInput.value.trim();
    const pin = pinInput.value.trim();

    if (!roll || !pin) {
        showError("রোল এবং পিন নম্বর দিন।");
        return;
    }
    
    loginButton.disabled = true;
    loginButton.textContent = "যাচাই করা হচ্ছে...";
    errorMessage.classList.add('hidden');
    
    const formData = new FormData();
    formData.append('action', 'verifyPin');
    formData.append('roll', roll);
    formData.append('pin', pin);

    fetch(SCRIPT_URL, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                studentInfo = { name: data.name, roll: roll };
                startQuiz();
            } else {
                showError(data.message || "অজানা ত্রুটি।");
                loginButton.disabled = false;
                loginButton.textContent = "প্রবেশ করো";
            }
        })
        .catch(err => {
            showError("সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।");
            loginButton.disabled = false;
            loginButton.textContent = "প্রবেশ করো";
        });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function startQuiz() {
    loginSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    answerReviewSection.classList.add('hidden');
    quizStarted = true;

    currentQuizQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, QUESTIONS_PER_QUIZ);
    totalQuestionsSpan.textContent = currentQuizQuestions.length;
    currentQuestionIndex = 0;
    score = 0;
    submittedAnswers = [];
    currentScoreSpan.textContent = score;
    
    loadQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = TIME_PER_QUESTION;
    timerSpan.textContent = timeLeft;
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = '#00d2ff';

    timerInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        const percentage = (timeLeft / TIME_PER_QUESTION) * 100;
        progressBar.style.width = `${percentage}%`;

        if (percentage < 50) progressBar.style.backgroundColor = '#f59e0b';
        if (percentage < 25) progressBar.style.backgroundColor = '#ef4444';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswer(null, "No Answer (Time Out)", currentQuizQuestions[currentQuestionIndex].answer, currentQuizQuestions[currentQuestionIndex].explanation);
        }
    }, 1000);
}

function loadQuestion() {
    if (currentQuestionIndex >= currentQuizQuestions.length) {
        showResult();
        return;
    }

    const questionData = currentQuizQuestions[currentQuestionIndex];
    questionNumberSpan.textContent = currentQuestionIndex + 1;
    questionTextElement.textContent = questionData.question;
    optionsContainer.innerHTML = '';
    feedbackElement.classList.add('hidden');

    const shuffledOptions = [...questionData.options].sort(() => 0.5 - Math.random());

    shuffledOptions.forEach(optionText => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = optionText;
        button.addEventListener('click', () => handleAnswer(button, optionText, questionData.answer, questionData.explanation));
        optionsContainer.appendChild(button);
    });
    startTimer();
}

function handleAnswer(button, selectedOptionText, correctOptionText, explanation) {
    clearInterval(timerInterval);
    const allOptionButtons = optionsContainer.querySelectorAll('.option-button');
    allOptionButtons.forEach(btn => btn.classList.add('disabled'));

    submittedAnswers.push({
        question: currentQuizQuestions[currentQuestionIndex].question,
        userAnswer: selectedOptionText,
        correctAnswer: correctOptionText,
        explanation: explanation
    });

    if (selectedOptionText === correctOptionText) {
        score++;
        currentScoreSpan.textContent = score;
        if(button) button.classList.add('correct');
        feedbackElement.textContent = "সঠিক উত্তর!";
        feedbackElement.style.color = '#10B981';
    } else {
        if(button) button.classList.add('incorrect');
        feedbackElement.textContent = `ভুল। সঠিক উত্তর: ${correctOptionText}`;
        feedbackElement.style.color = '#EF4444';
    }
    feedbackElement.classList.remove('hidden');

    allOptionButtons.forEach(btn => {
        if (btn.textContent === correctOptionText) {
            btn.classList.add('correct');
        }
    });

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, FEEDBACK_DELAY_MS);
}

function showResult() {
    quizStarted = false;
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    participantNameSpan.textContent = studentInfo.name;
    participantRollSpan.textContent = studentInfo.roll;

    finalScoreSpan.textContent = score;
    finalTotalSpan.textContent = currentQuizQuestions.length;

    if (score === currentQuizQuestions.length) {
        resultMessageElement.textContent = "অসাধারণ! তুমি সব প্রশ্নের সঠিক উত্তর দিয়েছো!";
    } else if (score >= currentQuizQuestions.length / 2) {
        resultMessageElement.textContent = "খুব ভালো করেছো!";
    } else {
        resultMessageElement.textContent = "আরও অনুশীলন প্রয়োজন।";
    }
    
    displayAnswerReview();
    sendDataToGoogleSheet();
}

function displayAnswerReview() {
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = ''; 
    submittedAnswers.forEach((result, index) => {
        const isCorrect = result.userAnswer === result.correctAnswer;
        const reviewBlock = document.createElement('div');
        reviewBlock.className = 'card mb-4 p-4 border-l-4 ' + (isCorrect ? 'border-green-500' : 'border-red-500');
        reviewBlock.innerHTML = `
            <p class="font-bold text-lg">${index + 1}. ${result.question}</p>
            <p class="mt-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}">
                <strong>তোমার উত্তর:</strong> ${result.userAnswer} ${isCorrect ? '✔' : '❌'}
            </p>
            ${!isCorrect ? `<p class="mt-1 text-green-600"><strong>সঠিক উত্তর:</strong> ${result.correctAnswer}</p>` : ''}
            <p class="mt-2 text-gray-300">
                <strong>ব্যাখ্যা:</strong> ${result.explanation}
            </p>
        `;
        reviewContainer.appendChild(reviewBlock);
    });
}

function sendDataToGoogleSheet() {
    if (!SCRIPT_URL) {
        submissionStatus.textContent = 'ত্রুটি: গুগল শিট URL সেট করা হয়নি।';
        submissionStatus.style.color = 'red';
        return;
    }
    submissionStatus.textContent = 'ফলাফল জমা দেওয়া হচ্ছে...';
    submissionStatus.style.color = 'orange';
    const formData = new FormData();
    formData.append('action', 'submitResult');
    formData.append('studentName', studentInfo.name);
    formData.append('studentRoll', studentInfo.roll);
    formData.append('totalScore', `${score} / ${currentQuizQuestions.length}`);
    formData.append('quizResultsJSON', JSON.stringify(submittedAnswers));
    fetch(SCRIPT_URL, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                submissionStatus.textContent = 'তোমার ফলাফল সফলভাবে জমা হয়েছে।';
                submissionStatus.style.color = '#10B981';
            } else { throw new Error(data.error); }
        })
        .catch(error => {
            submissionStatus.textContent = 'দুঃখিত, ফলাফল জমা দেওয়া যায়নি।';
            submissionStatus.style.color = '#EF4444';
        });
}

function showTabSwitchWarning() {
    if(quizStarted) {
        quizStarted = false;
        clearInterval(timerInterval);
        quizSection.classList.add('hidden');
        tabSwitchModal.classList.remove('hidden');
    }
}

// --- EVENT LISTENERS ---
loginButton.addEventListener('click', handleLogin);
toggleReviewButton.addEventListener('click', () => {
    answerReviewSection.classList.toggle('hidden');
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        showTabSwitchWarning();
    }
});
