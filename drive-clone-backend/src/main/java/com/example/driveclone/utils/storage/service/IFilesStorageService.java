package com.example.driveclone.utils.storage.service;

import com.example.driveclone.models.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.Map;

public interface IFilesStorageService {

    Path getUserDir(String username);

    void init() throws IOException;

    Map<String, String> save(MultipartFile file, User user) throws IOException;

    Resource load(String filename, User user) throws MalformedURLException;

    Map<String, Object> loadAll(User user, int limit, int offset, String search, String sortMode, String sortBy) throws IOException;

    void deleteAll();

    boolean deleteOne(Long id, User user) throws IOException;

    boolean renameOne(String oldName, String newName, User user) throws IOException;

}