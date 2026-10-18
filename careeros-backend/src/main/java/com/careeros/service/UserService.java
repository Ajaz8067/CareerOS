package com.careeros.service;
import org.springframework.stereotype.Service;
import com.careeros.entity.User;
import com.careeros.repository.UserRepository;
@Service
public class UserService {
private final UserRepository userRepository;
public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
}
// ================= REGISTER =================
public User registerUser(User user) {
    return userRepository.save(user);
}
// ================= LOGIN =================
public User loginUser(String email, String password) {
    User user = userRepository.findByEmail(email);
    if (user == null) {
        throw new RuntimeException("Email not registered.");
    }
    if (!user.getPassword().equals(password)) {
        throw new RuntimeException("Incorrect password.");
    }
    return user;
}
}
