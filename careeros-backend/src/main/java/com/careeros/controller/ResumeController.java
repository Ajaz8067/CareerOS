package com.careeros.controller;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.careeros.service.GeminiQuotaException;
import com.careeros.service.GeminiService;
import com.careeros.service.ResumeService;
@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {
    private final ResumeService resumeService;
    private final GeminiService geminiService;
    public ResumeController(
            ResumeService resumeService,
            GeminiService geminiService) {
        this.resumeService = resumeService;
        this.geminiService = geminiService;
    }
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeResume(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            // ===============================
            // Check file
            // ===============================
            if (file.isEmpty()) {
                response.put("success", false);
                response.put(
                        "message",
                        "Please upload a resume."
                );

                return ResponseEntity
                        .badRequest()
                        .body(response);
            }
            // ===============================
            // Extract resume text
            // ===============================
            String resumeText =
                    resumeService.extractText(file);
         //updated code
System.out.println("Resume filename: " + file.getOriginalFilename());
System.out.println("Resume file size: " + file.getSize());
System.out.println("Extracted text length: " + resumeText.length());
if (resumeText.trim().isEmpty()) {
    response.put("success", false);
    response.put(
        "message",
        "No readable text was found in this resume. Please upload a text-based PDF or DOCX file."
    );
    return ResponseEntity
            .badRequest()
            .body(response);
}
            System.out.println(
                    "========== RESUME TEXT =========="
            );
            System.out.println(resumeText);
            System.out.println("=================================");
            // ===============================
            // Send resume text to Gemini
            // ===============================
            String aiAnalysis =geminiService.analyzeResume(resumeText);
            // ===============================
            // Send successful response
            // ===============================
            response.put("success", true);
            response.put("resumeText", resumeText);
            response.put("analysis", aiAnalysis);
            return ResponseEntity
                    .ok(response);
        } catch (Exception e) {
            System.out.println(
                    "========== RESUME ANALYSIS ERROR =========="
            );
            System.out.println(e.getMessage());
            // ===============================
            // Gemini 429 Quota Error
            // ===============================
            String errorMessage = e.getMessage();
            if (errorMessage != null &&
                    (errorMessage.contains("429")
                    || errorMessage.contains("RESOURCE_EXHAUSTED")
                    || errorMessage.contains("quota"))) {
                response.put(
                        "success",
                        false
                );
                response.put(
                        "error",
                        "QUOTA_EXCEEDED"
                );
                response.put(
                        "message",
                        "AI service quota has been reached. Please try again later."
                );
                return ResponseEntity
                        .status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(response);
            }
            // ===============================
            // Other Errors
            // ===============================

            response.put(
                    "success",
                    false
            );
            response.put(
                    "error",
                    "RESUME_ANALYSIS_ERROR"
            );
            response.put(
                    "message",
                    "Unable to analyze the resume right now. Please try again later."
            );
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
@PostMapping("/match-job")
public ResponseEntity<Map<String, Object>> matchJob(
        @RequestParam("resumeText") String resumeText,
        @RequestParam("jobDescription") String jobDescription) {
    Map<String, Object> response = new HashMap<>();
    try {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Please analyze your resume first.");
            return ResponseEntity.badRequest().body(response);
        }
        if (jobDescription == null || jobDescription.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Please enter a job description.");
            return ResponseEntity.badRequest().body(response);
        }
        System.out.println("========== JOB MATCH ENDPOINT CALLED ==========");
        String analysis = geminiService.matchResumeWithJob(
                resumeText,
                jobDescription
        );
        response.put("success", true);
        response.put("analysis", analysis);
        return ResponseEntity.ok(response);
    } catch (GeminiQuotaException e) {
        response.put("success", false);
        response.put("message",
                "Gemini API quota reached. Please try again later.");
        return ResponseEntity.status(429).body(response);
    } catch (Exception e) {
        e.printStackTrace();
        response.put("success", false);
        response.put("message", "Unable to match your resume right now.");
        return ResponseEntity.internalServerError().body(response);
    }
}
}
