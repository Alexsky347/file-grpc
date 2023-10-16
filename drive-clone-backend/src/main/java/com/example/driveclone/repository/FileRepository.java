package com.example.driveclone.repository;


import com.example.driveclone.models.FileInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileInfo, Long> {
    Optional<FileInfo> findByName(String name);

    Optional<FileInfo> findByNameContains(String name);

    Optional<FileInfo> findByUrl(String url);

    Boolean existsByName(String username);

    void deleteByName(String name);

    void updateById(Long id, FileInfo entity);

    void create(FileInfo entity);
}