package com.example.driveclone.utils.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FilesStorageService implements IFilesStorageService {
    public final Path root = Paths.get("uploads");

    @Override
    public Path getUserDir(String username){
        return Paths.get(root + "/" + username);
    }


    @Override
    public void init() throws IOException {
        if(!Files.exists(root)) {
            Files.createDirectory(root);
        }
    }

    @Override
    public Map<String, String> save(MultipartFile file, String username) throws IOException {
        Path userDir = this.getUserDir(username);
        if(!Files.exists(userDir)){
            Files.createDirectory(userDir);
        }
        Path filePath = userDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        Map<String, String> mp = new HashMap<>();
        mp.put("file uploaded", filePath.getFileName().toString());
        return mp;
    }

    @Override
    public Resource load(String filename, String username) throws MalformedURLException {
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new Error("Could not load the file!");
        }
    }

    @Override
    public Map<String, ?> loadAll(String username, int limit, int offset) throws IOException {
        int depth = 1;
        Path userDir = this.getUserDir(username);
        Map<String, Set<?>> data = new HashMap<>();
        File directory = new File(userDir.toUri());
        int fileCount= Objects.requireNonNull(directory.list()).length;
        data.put("total", Collections.singleton(fileCount));
        Set<String> files;
        try (Stream<Path> stream = Files.walk(userDir, depth)) {
            files = stream
                    .filter(file -> !Files.isDirectory(file))
                    .skip(offset)
                    .limit(limit)
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .collect(Collectors.toSet());
        }
        data.put("data", files);
        return data;
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public boolean deleteOne(String filename, String username) throws IOException {
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return FileSystemUtils.deleteRecursively(file);
        } else {
            throw new Error("Could not delete the file!");
        }
    }

    @Override
    public boolean renameOne(String oldName,String newName, String username) throws IOException {
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + oldName);
        Resource resource = new UrlResource(userDir.toUri());
        if (resource.exists() || resource.isReadable()) {
            return Files.move(file, file.resolveSibling(newName)).isAbsolute();
        } else {
            throw new Error("Could not rename the file!");
        }
    }


}