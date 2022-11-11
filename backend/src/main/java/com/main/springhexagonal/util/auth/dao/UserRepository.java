package com.main.springhexagonal.util.auth.dao;

import com.main.springhexagonal.util.auth.model.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<UserEntity, String> {
    @Query("{username:'?0'}")
    UserEntity findByUsername(String username);

    @Query("{customFields.email:'?0'}")
    UserEntity findByEmail(String email);
    void delete(UserEntity user);
}
