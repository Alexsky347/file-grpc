package com.example.driveclone.utils.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.Map;

public interface IFilesStorageService {

    Path getUserDir(String username);

    void init() throws IOException;

    Map<String, String> save(MultipartFile file, String username) throws IOException;

    Resource load(String filename, String username) throws MalformedURLException;

    Map<String, Object> loadAll(String username, int limit, int offset) throws IOException;

    void deleteAll();

    boolean deleteOne(String filename, String username) throws IOException;

    boolean renameOne(String oldName, String newName, String username) throws IOException;

}