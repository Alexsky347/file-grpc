package com.main.springhexagonal.util.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FilesStorageService implements IFilesStorageService {
    public static final Path root = Paths.get("uploads");


    @Override
    public void init() throws IOException {
        if(!Files.exists(root)) {
            Files.createDirectory(root);
        }
    }

    @Override
    public Resource save(MultipartFile file, String username) throws IOException {
        Path userDir = Paths.get(root + "/" + username);
        if(!Files.exists(userDir)){
            Files.createDirectory(userDir);
        }
        Path filePath = userDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return this.load(file.getOriginalFilename(), userDir);
    }

    @Override
    public Resource load(String filename, Path filePath) throws MalformedURLException {
        Path file = filePath.resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new Error("Could not load the file!");
        }
    }

    @Override
    public Set<String> loadAll(String username) throws IOException {
        int depth = 1;
        Path userDir = Paths.get(root + "/" + username);
        try (Stream<Path> stream = Files.walk(userDir, depth)) {
            return stream
                    .filter(file -> !Files.isDirectory(file))
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .collect(Collectors.toSet());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public boolean deleteOne(String filename, Path filePath) throws IOException {
        Path file = filePath.resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return FileSystemUtils.deleteRecursively(file);
        } else {
            throw new Error("Could not delete the file!");
        }
    }


}