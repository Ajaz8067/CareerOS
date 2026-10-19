package com.careeros.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.careeros.service.InterviewHistoryService;
import com.careeros.entity.InterviewHistory;
import com.careeros.service.GeminiService;
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {
	private final GeminiService geminiService;
	private final InterviewHistoryService interviewHistoryService;
	public InterviewController(
	        GeminiService geminiService,
	        InterviewHistoryService interviewHistoryService) {
	    this.geminiService = geminiService;
	    this.interviewHistoryService = interviewHistoryService;
	}
    // =========================================
    // GENERATE INTERVIEW QUESTION
    // =========================================
    @PostMapping("/question")
    public String generateQuestion(
            @RequestParam("resumeText") String resumeText,
            @RequestParam("questionNumber") int questionNumber) {
        System.out.println(
                "========== INTERVIEW CONTROLLER CALLED =========="
        );
        System.out.println(
                "Question Number: " + questionNumber
        );
        String question =
                geminiService.generateInterviewQuestion(
                        resumeText,
                        questionNumber
                );
        return question;
    }
    // =========================================
    // EVALUATE INTERVIEW ANSWER
    // =========================================
    @PostMapping("/evaluate")
    public String evaluateAnswer(
            @RequestParam("question") String question,
            @RequestParam("answer") String answer) {
        System.out.println(
                "========== ANSWER EVALUATION CONTROLLER CALLED =========="
        );
        System.out.println(
                "Question: " + question
        );
        System.out.println(
                "Answer: " + answer
        );
        String evaluation =
                geminiService.evaluateInterviewAnswer(
                        question,
                        answer
                );
        return evaluation;
    }
@PostMapping("/history")
public String saveInterviewHistory(
        @RequestParam(value = "userId", required = false)
        Long userId,
        @RequestParam("totalQuestions")
        int totalQuestions,
        @RequestParam("totalScore")
        int totalScore,
        @RequestParam("feedback")
        String feedback) {
    InterviewHistory saved =interviewHistoryService.saveInterview(
                    userId,
                    totalQuestions,
                    totalScore,
                    feedback
            );
    return "Interview history saved successfully. ID: "
            + saved.getId();
}
}
