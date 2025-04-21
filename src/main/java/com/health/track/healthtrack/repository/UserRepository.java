package com.health.track.healthtrack.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.health.track.healthtrack.model.request.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAll(); // Find all users

    Optional<User> findByUserName(String userName);  // Find a user by their username
}