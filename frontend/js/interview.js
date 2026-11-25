
console.log("interview.js loaded");

// =====================================
// Interview Variables
// =====================================

let currentQuestion = 1;
const totalQuestions = 10;
let score = 0;
let currentQuestionText = "";

// Store questions generated in the background
const questionCache = new Map();
const questionRequests = new Map();

// =====================================
// Backend URLs
// =====================================


const QUESTION_API =
    "https://careeros-backend-4si3.onrender.com/api/interview/question";

const EVALUATE_API =
    "https://careeros-backend-4si3.onrender.com/api/interview/evaluate";

const HISTORY_API =
    "https://careeros-backend-4si3.onrender.com/api/interview/history";

// =====================================
// Get HTML Elements
// =====================================

const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const resultScreen = document.getElementById("resultScreen");

const startInterviewBtn =
    document.getElementById("startInterviewBtn");

const submitAnswerBtn =
    document.getElementById("submitAnswerBtn");

const restartInterviewBtn =
    document.getElementById("restartInterviewBtn");

const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const answerInput = document.getElementById("answerInput");

const interviewScore = document.getElementById("interviewScore");
const interviewFeedback =
    document.getElementById("interviewFeedback");

const evaluationBox = document.getElementById("evaluationBox");
const answerScore = document.getElementById("answerScore");
const answerFeedback = document.getElementById("answerFeedback");
const answerSuggestion = document.getElementById("answerSuggestion");

const nextQuestionBtn = document.getElementById("nextQuestionBtn");

// =====================================
// Read Resume From Local Storage
// =====================================

function getResumeText() {
    const resumeText = localStorage.getItem("resumeText");

    if (!resumeText) {
        alert("Please analyze your resume first.");
        window.location.href = "resume.html";
        return null;
    }

    return resumeText;
}

// =====================================
// Helper: Extract Data From Response
// =====================================

function parseResponse(responseText) {
    try {
        return JSON.parse(responseText);
    } catch (error) {
        // Backend may return plain text instead of JSON.
        return responseText;
    }
}

// =====================================
// Helper: Extract Question Text
// =====================================

function extractQuestion(data) {
    if (typeof data === "string") {
        return data.trim();
    }

    if (data && typeof data === "object") {
        const possibleFields = [
            "question",
            "generatedQuestion",
            "questionText",
            "content",
            "message",
            "result"
        ];

        for (const field of possibleFields) {
            if (typeof data[field] === "string" &&
                data[field].trim() !== "") {
                return data[field].trim();
            }
        }
    }

    return "";
}



async function fetchQuestionFromBackend(questionNo) {

    const resumeText = getResumeText();

    if (!resumeText) {
        throw new Error("Resume text is missing.");
    }

    const response = await fetch(QUESTION_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
            "resumeText=" + encodeURIComponent(resumeText) +
            "&questionNumber=" + questionNo
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            "Question API failed: HTTP " + response.status
        );
    }

    const question = extractQuestion(parseResponse(responseText));

    if (!question) {
        throw new Error("No question received from Gemini.");
    }

    return question;
}

function getQuestionPromise(questionNo) {

    if (!questionRequests.has(questionNo)) {

        const request = fetchQuestionFromBackend(questionNo)
            .then(question => {
                questionCache.set(questionNo, question);
                return question;
            })
            .catch(error => {
                questionRequests.delete(questionNo);
                throw error;
            });

        questionRequests.set(questionNo, request);
    }

    return questionRequests.get(questionNo);
}

function prefetchNextQuestion() {

    const nextNumber = currentQuestion + 1;

    if (nextNumber > totalQuestions) {
        return;
    }

    if (questionCache.has(nextNumber) ||
        questionRequests.has(nextNumber)) {
        return;
    }

    console.log("Prefetching question:", nextNumber);

    getQuestionPromise(nextNumber)
        .then(() => {
            console.log("Next question ready:", nextNumber);
        })
        .catch(error => {
            console.warn(
                "Background question generation failed:",
                error.message
            );
        });
}

// =====================================
// Start Interview
// =====================================

if (startInterviewBtn) {
    startInterviewBtn.addEventListener("click", function () {
        console.log("========== START INTERVIEW CLICKED ==========");

        const resumeText = getResumeText();

        if (!resumeText) {
            console.error("Resume text is missing.");
            return;
        }

        currentQuestion = 1;
        score = 0;
        currentQuestionText = "";

        startScreen.style.display = "none";
        questionScreen.style.display = "block";
        resultScreen.style.display = "none";

        loadQuestion();
    });
}

// =====================================
// Generate Interview Question
// =====================================

async function loadQuestion() {
    console.log("========== INTERVIEW QUESTION REQUEST ==========");
    console.log("Question Number:", currentQuestion);

    const resumeText = getResumeText();

    if (!resumeText) {
        return;
    }

    questionNumber.textContent =
        currentQuestion + " / " + totalQuestions;

    questionText.textContent = "Generating question...";

    answerInput.value = "";
    answerInput.disabled = true;

    evaluationBox.style.display = "none";
    submitAnswerBtn.style.display = "block";
    submitAnswerBtn.disabled = true;
    submitAnswerBtn.textContent = "Loading Question...";

    if (nextQuestionBtn) {
        nextQuestionBtn.style.display = "none";
    }

    
try {

    const requestedQuestion = currentQuestion;

    console.log(
        "Loading question:",
        requestedQuestion
    );

    const question = await getQuestionPromise(
        requestedQuestion
    );

    // Prevent an old request from updating the screen.
    if (currentQuestion !== requestedQuestion) {
        return;
    }

    currentQuestionText = question;
    questionText.textContent = question;

    answerInput.disabled = false;
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.textContent = "Submit Answer";

    console.log("Question displayed:", question);

    // Generate the next question in the background.
    prefetchNextQuestion();

} catch (error) {

    console.error("Question generation error:", error);

    questionText.textContent =
        "Unable to generate question. Please try again.";

    submitAnswerBtn.disabled = true;
    submitAnswerBtn.textContent = "Question Failed";

    answerInput.disabled = true;
}


        // Read the response body only once.
    




// =====================================
// Submit Answer For Evaluation
// =====================================

if (submitAnswerBtn) {
    submitAnswerBtn.addEventListener("click", evaluateAnswer);
}

async function evaluateAnswer() {
    console.log("========== ANSWER EVALUATION STARTED ==========");

    const answer = answerInput.value.trim();
    const question = currentQuestionText;

    if (!question) {
        alert("Please generate an interview question first.");
        return;
    }

    if (!answer) {
        alert("Please enter your answer first.");
        answerInput.focus();
        return;
    }

    submitAnswerBtn.disabled = true;
    submitAnswerBtn.textContent = "Evaluating Answer...";
    answerInput.disabled = true;

    try {
        console.log("Sending answer to Gemini...");
        console.log("Evaluation URL:", EVALUATE_API);
        console.log("Question:", question);
        console.log("Answer length:", answer.length);

        const response = await fetch(EVALUATE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "question=" + encodeURIComponent(question) +
                "&answer=" + encodeURIComponent(answer)
        });

        console.log("Evaluation HTTP status:", response.status);
        console.log("Evaluation response OK:", response.ok);

        // Read the response body only once.
        const evaluationText = await response.text();

        console.log("Gemini Evaluation:", evaluationText);

        if (!response.ok) {
            throw new Error(
                "Evaluation API failed. HTTP " +
                response.status +
                ". Response: " +
                evaluationText
            );
        }

        const evaluation = parseResponse(evaluationText);

        console.log("Parsed evaluation:", evaluation);

        let answerMarks = null;
        let feedback = "";
        let suggestion = "";

        if (evaluation && typeof evaluation === "object") {
            const rawScore =
                evaluation.score ??
                evaluation.marks ??
                evaluation.rating;

            if (rawScore !== undefined && rawScore !== null) {
                const numericScore = Number.parseFloat(rawScore);

                if (Number.isFinite(numericScore)) {
                    answerMarks = Math.max(
                        0,
                        Math.min(3, numericScore)
                    );
                }
            }

            feedback =
                evaluation.feedback ??
                evaluation.explanation ??
                evaluation.comments ??
                "";

            suggestion =
                evaluation.suggestion ??
                evaluation.improvement ??
                evaluation.recommendation ??
                "";
        } else if (typeof evaluation === "string") {
            feedback = evaluation;
        }

        // Display evaluation results.
        evaluationBox.style.display = "block";

        answerScore.textContent =
            answerMarks !== null
                ? answerMarks + " / 3"
                : "See feedback";

        answerFeedback.textContent =
            feedback || "Evaluation received. Check the console for details.";

        answerSuggestion.textContent =
            suggestion || "Keep practising and make your answer more specific.";

        // Add marks only when the backend returns a numeric score.
        if (answerMarks !== null) {
            score += answerMarks;
        }

        console.log("Current total score:", score, "/ 30");

        submitAnswerBtn.style.display = "none";

        if (nextQuestionBtn) {
            nextQuestionBtn.style.display = "block";
            nextQuestionBtn.disabled = false;
        }

        console.log("========== ANSWER EVALUATION COMPLETED ==========");

    } catch (error) {
        console.error("========== ANSWER EVALUATION ERROR ==========");
        console.error("Error details:", error);
        console.error("Error message:", error.message);

        evaluationBox.style.display = "block";
        answerFeedback.textContent =
            "Unable to evaluate your answer. Check the browser console.";

        answerScore.textContent = "--";
        answerSuggestion.textContent =
            "Please try submitting your answer again.";

        answerInput.disabled = false;
        submitAnswerBtn.disabled = false;
        submitAnswerBtn.textContent = "Retry Evaluation";
    }
}

// =====================================
// Next Question
// =====================================

if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener("click", function () {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            loadQuestion();
        } else {
            showInterviewResult();
        }
    });
}

// =====================================
// Display Final Result
// =====================================


async function showInterviewResult() {
    console.log("========== INTERVIEW COMPLETED ==========");
    console.log("Final score:", score, "/ 30");

    questionScreen.style.display = "none";
    startScreen.style.display = "none";
    resultScreen.style.display = "block";

    interviewScore.textContent = score + " / 30";

    let finalFeedback = "";

    if (score >= 24) {
        finalFeedback =
            "Excellent performance! Keep practising to maintain your skills.";
    } else if (score >= 15) {
        finalFeedback =
            "Good effort! Practise more technical questions to improve.";
    } else {
        finalFeedback =
            "Keep learning and practising. Review the feedback and try again.";
    }

    interviewFeedback.textContent = finalFeedback;

    // Save the completed interview in MySQL.
    try {
        const response = await fetch(HISTORY_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "userId=" + encodeURIComponent(localStorage.getItem("userId")) +
                "&totalQuestions=" + totalQuestions +
                "&totalScore=" + score +
                "&feedback=" + encodeURIComponent(finalFeedback)
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(
                "HTTP " + response.status + ": " + responseText
            );
        }

        console.log("Interview history saved:", responseText);

    } catch (error) {
        console.error("Unable to save interview history:", error);
    }
}

// =====================================
// Restart Interview
// =====================================

if (restartInterviewBtn) {
    restartInterviewBtn.addEventListener("click", function () {
        currentQuestion = 1;
        score = 0;
        currentQuestionText = "";

        // Clear previously generated questions
        questionCache.clear();
        questionRequests.clear();

        startScreen.style.display = "block";
        questionScreen.style.display = "none";
        resultScreen.style.display = "none";

        evaluationBox.style.display = "none";

        answerInput.value = "";
        answerInput.disabled = false;

        submitAnswerBtn.style.display = "block";
        submitAnswerBtn.disabled = false;
        submitAnswerBtn.textContent = "Submit Answer";

        if (nextQuestionBtn) {
            nextQuestionBtn.style.display = "none";
        }

        console.log("Interview restarted.");
    });
}
}