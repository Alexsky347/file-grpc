package com.example.driveclone.repository;


import com.example.driveclone.models.FileInfo;
import com.example.driveclone.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileInfo, Long> {
    Optional<FileInfo> findByName(String name);

    Optional<FileInfo> findByNameContains(String name);

    Optional<FileInfo> findByNameAndUser(String name, User user);

    void deleteAllByUser(User user);

    @Query(countQuery = "SELECT COUNT(f) FROM FileInfo f WHERE f.user = :user",
            value = "SELECT f FROM FileInfo f WHERE f.user = :user AND f.name ILIKE %:search%")
    Page<FileInfo> filterAll(User user,
                             String search,
                             Pageable pageable);

    Boolean existsByName(String username);

    void deleteByName(String name);

}