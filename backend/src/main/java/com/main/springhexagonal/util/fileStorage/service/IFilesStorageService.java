package com.main.springhexagonal.util.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.Path;
import java.util.Set;

public interface IFilesStorageService {
    public void init() throws IOException;

    public Resource save(MultipartFile file, String username) throws IOException;

    public Resource load(String filename, Path filePath) throws MalformedURLException;
    public Set<String> loadAll(String username) throws IOException;

    public void deleteAll();

    public boolean deleteOne(String filename, Path filePath) throws IOException;

}