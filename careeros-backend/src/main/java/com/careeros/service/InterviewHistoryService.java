package com.careeros.service;
import org.springframework.stereotype.Service;
import com.careeros.entity.InterviewHistory;
import com.careeros.repository.InterviewHistoryRepository;
@Service
public class InterviewHistoryService {
    private final InterviewHistoryRepository repository;
    public InterviewHistoryService(
            InterviewHistoryRepository repository) {
        this.repository = repository;
    }
    public InterviewHistory saveInterview(
            Long userId,
            int totalQuestions,
            int totalScore,
            String feedback) {
        InterviewHistory history = new InterviewHistory();
        history.setUserId(userId);
        history.setTotalQuestions(totalQuestions);
        history.setTotalScore(totalScore);
        history.setFeedback(feedback);
        return repository.save(history);
    }
}
