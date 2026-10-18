package com.careeros.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "interview_history")
public class InterviewHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "total_questions", nullable = false)
    private int totalQuestions;
    @Column(name = "total_score", nullable = false)
    private int totalScore;
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    @Column(name = "interview_date",
            insertable = false, updatable = false)
    private LocalDateTime interviewDate;
    public InterviewHistory() {
    }
    public Long getId() {
        return id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public int getTotalQuestions() {
        return totalQuestions;
    }
    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    public int getTotalScore() {
        return totalScore;
    }
    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }
    public String getFeedback() {
        return feedback;
    }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    public LocalDateTime getInterviewDate() {
        return interviewDate;
    }
}
