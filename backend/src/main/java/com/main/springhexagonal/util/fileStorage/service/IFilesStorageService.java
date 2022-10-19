package com.main.springhexagonal.util.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface IFilesStorageService {
    public void init() throws IOException;

    public Resource save(MultipartFile file, String username) throws IOException;

    public Resource load(String filename, Path filePath) throws MalformedURLException;

    public void deleteAll();

    public Stream<Path> loadAll() throws IOException;
}