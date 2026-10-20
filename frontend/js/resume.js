console.log("resume.js loaded");


// =========================================
// GET HTML ELEMENTS
// =========================================

const resumeInput =
    document.getElementById("resumeInput");

const uploadBtn =
    document.getElementById("uploadBtn");

const uploadMessage =
    document.getElementById("uploadMessage");

const analysisResult =
    document.getElementById("analysisResult");

const careerScore =
    document.getElementById("careerScore");

const skillsContainer =
    document.getElementById("skillsResult");

const strengthsContainer =
    document.getElementById("strengthsResult");

const recommendationsContainer =
    document.getElementById("recommendationsResult");

const improvementsContainer =
    document.getElementById("improvementResult");


// =========================================
// UPLOAD BUTTON
// =========================================

uploadBtn.addEventListener(
    "click",
    analyzeResume
);


// =========================================
// ANALYZE RESUME
// =========================================

async function analyzeResume() {

    // Check file
    if (!resumeInput.files ||
        resumeInput.files.length === 0) {

        uploadMessage.textContent =
            "Please select a resume first.";

        return;
    }


    const file =
        resumeInput.files[0];


    console.log(
        "Selected file:",
        file.name
    );


    // =========================================
    // CHECK FILE TYPE
    // =========================================

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];


    const fileName =
        file.name.toLowerCase();


    const isValid =
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".doc") ||
        fileName.endsWith(".docx");


    if (!isValid) {

        uploadMessage.textContent =
            "Please upload a PDF, DOC, or DOCX file.";

        return;
    }


    // =========================================
    // SHOW LOADING MESSAGE
    // =========================================

    uploadMessage.textContent =
        "Analyzing your resume...";


    uploadBtn.disabled = true;


    // =========================================
    // CREATE FORM DATA
    // =========================================

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    try {

        // =========================================
        // SEND REQUEST TO SPRING BOOT
        // =========================================

        const response =
            await fetch(

                "https://careeros-backend-4si3.onrender.com/api/resume/analyze",

                {
                    method: "POST",
                    body: formData
                }
            );


        console.log(
            "Response status:",
            response.status
        );


        // =========================================
        // GET RESPONSE AS TEXT
        // =========================================
        const text = await response.text();

        console.log("Backend response:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {

            console.error("Invalid JSON from backend:", text);

            uploadMessage.textContent =
                "Backend returned an invalid response.";

            return;
        }

        console.log("Parsed backend response:", data);


        // =========================================
        // CHECK QUOTA ERROR
        // =========================================

        if (response.status === 429) {

            uploadMessage.textContent =
                data.message ||
                "AI service quota has been reached. Please try again later.";

            return;
        }


        // =========================================
        // CHECK OTHER HTTP ERRORS
        // =========================================

        if (!response.ok) {

            uploadMessage.textContent =
                data.message ||
                "Resume analysis failed. Please try again.";

            return;
        }


        // =========================================
        // PARSE JSON
        // =========================================



        console.log(
            "Parsed response:",
            data
        );


        // =========================================
        // CHECK SUCCESS
        // =========================================

        if (!data.success) {

            uploadMessage.textContent =
                data.message ||
                "Resume analysis failed.";

            return;
        }


        // =========================================
        // SAVE RESUME TEXT
        // =========================================

        if (data.resumeText) {

            localStorage.setItem(
                "resumeText",
                data.resumeText
            );

            console.log(
                "Resume text saved to localStorage."
            );

        }


        // =========================================
        // GET AI ANALYSIS
        // =========================================

        let analysis =
            data.analysis;


        // Sometimes backend may return
        // analysis as a JSON string

        if (typeof analysis === "string") {

            analysis =
                JSON.parse(analysis);

        }


        console.log(
            "AI Analysis:",
            analysis
        );


        // =========================================
        // SHOW ANALYSIS SECTION
        // =========================================

        analysisResult.style.display =
            "block";


        // =========================================
        // CAREER SCORE
        // =========================================

        careerScore.textContent =
            analysis.score + "/100";


        // =========================================
        // SKILLS
        // =========================================

        skillsContainer.innerHTML = "";


        if (
            analysis.skills &&
            analysis.skills.length > 0
        ) {

            analysis.skills.forEach(
                function (skill) {

                    const badge =
                        document.createElement("span");

                    badge.className =
                        "skill-badge";

                    badge.textContent =
                        skill;

                    skillsContainer.appendChild(
                        badge
                    );
                }
            );

        }

        else {

            skillsContainer.textContent =
                "No technical skills detected.";

        }


        // =========================================
        // STRENGTHS
        // =========================================

        strengthsContainer.innerHTML = "";


        if (
            analysis.strengths &&
            analysis.strengths.length > 0
        ) {

            analysis.strengths.forEach(
                function (strength) {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        strength;

                    strengthsContainer.appendChild(
                        li
                    );

                }
            );

        }

        else {

            const li =
                document.createElement("li");

            li.textContent =
                "No strengths detected.";

            strengthsContainer.appendChild(
                li
            );

        }


        // =========================================
        // RECOMMENDATIONS
        // =========================================

        recommendationsContainer.innerHTML =
            "";


        if (
            analysis.recommendations &&
            analysis.recommendations.length > 0
        ) {

            analysis.recommendations.forEach(
                function (recommendation) {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        recommendation;

                    recommendationsContainer.appendChild(
                        li
                    );

                }
            );

        }

        else {

            const li =
                document.createElement("li");

            li.textContent =
                "No recommendations available.";

            recommendationsContainer.appendChild(
                li
            );

        }


        // =========================================
        // IMPROVEMENTS
        // =========================================

        improvementsContainer.innerHTML =
            "";


        if (
            analysis.improvements &&
            analysis.improvements.length > 0
        ) {

            analysis.improvements.forEach(
                function (improvement) {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        improvement;

                    improvementsContainer.appendChild(
                        li
                    );

                }
            );

        }

        else {

            const li =
                document.createElement("li");

            li.textContent =
                "No major improvements detected.";

            improvementsContainer.appendChild(
                li
            );

        }


        // =========================================
        // SUCCESS MESSAGE
        // =========================================

        uploadMessage.textContent =
            "Resume analyzed successfully!";


        console.log(
            "Resume analysis completed successfully."
        );

    }


    catch (error) {

        console.error(
            "Resume analysis error:",
            error
        );


        uploadMessage.textContent =
            "Something went wrong while analyzing the resume.";

    }


    finally {

        uploadBtn.disabled =
            false;

    }

}

/* =========================================
   JOB DESCRIPTION MATCHING
========================================= */

const matchJobBtn = document.getElementById("matchJobBtn");
const jobDescriptionInput = document.getElementById("jobDescription");
const jobMatchMessage = document.getElementById("jobMatchMessage");
const jobMatchResults = document.getElementById("jobMatchResults");
const jobMatchScore = document.getElementById("jobMatchScore");

const matchingSkillsResult =
    document.getElementById("matchingSkillsResult");

const missingSkillsResult =
    document.getElementById("missingSkillsResult");

const jobSuggestionsResult =
    document.getElementById("jobSuggestionsResult");


if (matchJobBtn) {
    matchJobBtn.addEventListener("click", matchResumeToJob);
}


async function matchResumeToJob() {

    const resumeText = localStorage.getItem("resumeText");
    const description = jobDescriptionInput.value.trim();

    // Check whether the resume was analyzed first
    if (!resumeText) {
        jobMatchMessage.textContent =
            "Please analyze your resume first.";
        return;
    }

    // Check whether the job description was entered
    if (!description) {
        jobMatchMessage.textContent =
            "Please paste a job description first.";
        return;
    }

    matchJobBtn.disabled = true;
    jobMatchResults.style.display = "none";

    jobMatchMessage.textContent =
        "Comparing your resume with the job description...";

    const formData = new FormData();
    formData.append("resumeText", resumeText);
    formData.append("jobDescription", description);

    try {

        const response = await fetch(
            "http://localhost:8080/api/resume/match-job",
            {
                method: "POST",
                body: formData
            }
        );

        const responseText = await response.text();

        let data;

        try {
            data = JSON.parse(responseText);
        } catch (error) {
            throw new Error("The server returned an invalid response.");
        }

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to match your resume."
            );
        }

        // The backend returns analysis as a JSON string
        let analysis = data.analysis;

        if (typeof analysis === "string") {
            analysis = JSON.parse(analysis);
        }

        // Display the match score
        jobMatchScore.textContent =
            analysis.matchScore + "%";

        // Helper function to display list items safely
        function displayList(element, items, emptyMessage) {

            element.replaceChildren();

            if (!Array.isArray(items) || items.length === 0) {
                const li = document.createElement("li");
                li.textContent = emptyMessage;
                element.appendChild(li);
                return;
            }

            items.forEach(function (item) {
                const li = document.createElement("li");
                li.textContent = item;
                element.appendChild(li);
            });
        }

        displayList(
            matchingSkillsResult,
            analysis.matchingSkills,
            "No matching skills identified."
        );

        displayList(
            missingSkillsResult,
            analysis.missingSkills,
            "No missing skills identified."
        );

        displayList(
            jobSuggestionsResult,
            analysis.suggestions,
            "No additional suggestions."
        );

        jobMatchResults.style.display = "block";

        jobMatchMessage.textContent =
            "Job description matching completed successfully!";

    } catch (error) {

        console.error("Job matching error:", error);

        jobMatchMessage.textContent =
            error.message ||
            "Unable to match your resume. Please try again.";

    } finally {

        matchJobBtn.disabled = false;
    }
}
