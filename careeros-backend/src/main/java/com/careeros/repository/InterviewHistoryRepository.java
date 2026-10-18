package com.careeros.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.careeros.entity.InterviewHistory;
public interface InterviewHistoryRepository
        extends JpaRepository<InterviewHistory, Long> {
}
