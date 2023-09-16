package com.example.driveclone.utils.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.Map;

public interface IFilesStorageService {

    public Path getUserDir(String username);
    public void init() throws IOException;
    public Map<String, String> save(MultipartFile file, String username) throws IOException;
    public Resource load(String filename, String username) throws MalformedURLException;
    public Map<String, ?> loadAll(String username, int limit, int offset) throws IOException;
    public void deleteAll();
    public boolean deleteOne(String filename, String username) throws IOException;
    public boolean renameOne(String oldName,String newName, String username) throws IOException;

}