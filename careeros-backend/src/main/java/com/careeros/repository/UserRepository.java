package com.careeros.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.careeros.entity.User;
public interface UserRepository extends JpaRepository<User, Long> {
User findByEmail(String email);
}
