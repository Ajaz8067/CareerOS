package com.careeros.service;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public class ResumeService {
    // ==========================================
    // EXTRACT TEXT FROM PDF OR DOCX RESUME
    // ==========================================
    public String extractText(MultipartFile file) {
    StringBuilder text = new StringBuilder();
    if (file == null || file.isEmpty()) {
    System.out.println("Resume file is empty.");
    return "";
    }
    String filename = file.getOriginalFilename();
    if (filename == null) {
    System.out.println("Resume filename is missing.");
    return "";
    }
    filename = filename.toLowerCase(Locale.ROOT);
    try {
    // ======================================
    // READ PDF FILE
    // ======================================
    if (filename.endsWith(".pdf")) {
    System.out.println("Reading PDF resume...");
    try (PDDocument document =
    Loader.loadPDF(file.getBytes())) {
    PDFTextStripper stripper =
    new PDFTextStripper();
    text.append(stripper.getText(document));
    }
    }
    // ======================================
    // READ WORD DOCX FILE
    // ======================================
    else if (filename.endsWith(".docx")) {
    System.out.println("Reading DOCX resume...");
    try (InputStream inputStream =
    file.getInputStream();
    XWPFDocument document =
    new XWPFDocument(inputStream)) {
    for (XWPFParagraph paragraph :
    document.getParagraphs()) {
    text.append(paragraph.getText());
    text.append("\n");
    }
    }
    }
    // ======================================
    // UNSUPPORTED FILE
    // ======================================
    else {
    System.out.println(
    "Unsupported resume format: " + filename
    );
    System.out.println("========== EXTRACTED RESUME TEXT ==========");
    System.out.println(text.toString());
    System.out.println("===========================================");
    return "";
    }
    System.out.println(
    "Resume text extracted successfully. Characters: "
    + text.length()
    );
    System.out.println("========== EXTRACTED RESUME TEXT ==========");
    System.out.println(
    text.length() > 0
    ? "Resume text is present."
    : "WARNING: Extracted resume text is EMPTY."
    );
    System.out.println("===========================================");
    return text.toString();
    } catch (Exception e) {
    System.out.println(
    "Error extracting resume text: " + e.getMessage()
    );
    e.printStackTrace();
    return "";
    }
    }
    // ==========================================
    // ANALYZE RESUME
    // Existing logic preserved
    // ==========================================
    public ResumeAnalysis analyzeResume(String resumeText) {
    List<String> skills = new ArrayList<>();
    String text = resumeText.toLowerCase();
    // ==========================================
    // DETECT SKILLS
    // ==========================================
    if (text.contains("java")) {
    skills.add("Java");
    }
    if (text.contains("javascript")) {
    skills.add("JavaScript");
    }
    if (text.contains("html")) {
    skills.add("HTML");
    }
    if (text.contains("css")) {
    skills.add("CSS");
    }
    if (text.contains("mysql")) {
    skills.add("MySQL");
    }
    if (text.contains("spring boot")) {
    skills.add("Spring Boot");
    }
    if (text.contains("git")) {
    skills.add("Git");
    }
    // ==========================================
    // CALCULATE CAREER SCORE
    // ==========================================
    int score = skills.size() * 10;
    if (score > 100) {
    score = 100;
    }
    // ==========================================
    // IMPROVEMENTS
    // ==========================================
    List<String> improvements = new ArrayList<>();
    if (!text.contains("project")) {
    improvements.add(
    "Add projects to your resume."
    );
    }
    if (!text.contains("experience")) {
    improvements.add(
    "Add your work or internship experience."
    );
    }
    if (!text.contains("education")) {
    improvements.add(
    "Add your education details."
    );
    }
    if (skills.isEmpty()) {
    improvements.add(
    "Add relevant technical skills."
    );
    }
    // ==========================================
    // STRENGTHS
    // ==========================================
    List<String> strengths = new ArrayList<>();
    if (!skills.isEmpty()) {
    strengths.add(
    "Good technical skill coverage."
    );
    }
    if (text.contains("project")) {
    strengths.add(
    "Projects are included in the resume."
    );
    }
    if (text.contains("education")) {
    strengths.add(
    "Education details are included."
    );
    }
    // ==========================================
    // RECOMMENDATIONS
    // ==========================================
    List<String> recommendations = new ArrayList<>();
    if (!text.contains("github")) {
    recommendations.add(
    "Add your GitHub profile."
    );
    }
    if (!text.contains("linkedin")) {
    recommendations.add(
    "Add your LinkedIn profile."
    );
    }
    if (!text.contains("achievement")) {
    recommendations.add(
    "Add measurable achievements."
    );
    }
    // ==========================================
    // RETURN ANALYSIS
    // ==========================================
    return new ResumeAnalysis(
    score,
    skills,
    improvements,
    strengths,
    recommendations
    );
    }
    // ==========================================
    // RESUME ANALYSIS RESULT
    // Existing class preserved
    // ==========================================
    public static class ResumeAnalysis {
    private int score;
    private List<String> skills;
    private List<String> improvements;
    private List<String> strengths;
    private List<String> recommendations;
    // CONSTRUCTOR
    public ResumeAnalysis(
    int score,
    List<String> skills,
    List<String> improvements,
    List<String> strengths,
    List<String> recommendations) {
    this.score = score;
    this.skills = skills;
    this.improvements = improvements;
    this.strengths = strengths;
    this.recommendations = recommendations;
    }
    // GET SCORE
    public int getScore() {
    return score;
    }
    // GET SKILLS
    public List<String> getSkills() {
    return skills;
    }
    // GET IMPROVEMENTS
    public List<String> getImprovements() {
    return improvements;
    }
    // GET STRENGTHS
    public List<String> getStrengths() {
    return strengths;
    }
    // GET RECOMMENDATIONS
    public List<String> getRecommendations() {
    return recommendations;
    }
    }
}
