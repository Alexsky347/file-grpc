package com.example.driveclone.utils.storage.service;

import com.example.driveclone.utils.exception.CustomError;
import com.example.driveclone.utils.storage.util.FileUtil;
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
    public final Path root = Paths.get("static");

    @Override
    public Path getUserDir(String username) {
        return Paths.get(root + "/" + username);
    }


    @Override
    public void init() throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectory(root);
        }
    }

    @Override
    public Map<String, String> save(MultipartFile file, String username) throws IOException {
        Path userDir = this.getUserDir(username);
        if (!Files.exists(userDir)) {
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
            throw new CustomError("Could not load the file!");
        }
    }


    @Override
    public Map<String, Object> loadAll(final String username, final int limit, final int offset, final String sortBy, final String sortMode, final String search) throws IOException {
        String sortByValue = sortBy != null ? sortBy : "filename";
        String sortModeValue = sortMode != null ? sortMode : "asc";
        int depth = 1;
        Path userDir = getUserDir(username);
        List<Map<String, Object>> fileList = new ArrayList<>();
        File directory = new File(userDir.toUri());
        Map<String, Object> data = new HashMap<>();
        int fileCount = Objects.requireNonNull(directory.list()).length;
        data.put("total", fileCount);
        try (Stream<Path> stream = Files.walk(userDir, depth)) {
            fileList = stream
                    .filter(file -> !Files.isDirectory(file))
                    .sorted(Comparator.comparing(path -> {
                        if (sortModeValue.equals("desc")) {
                            return path.getFileName().toString().compareTo(sortByValue);
                        } else {
                            return sortByValue.compareTo(path.getFileName().toString());
                        }
                    }))
                    .skip(offset)
                    .limit(limit)
                    .map(path -> {
                        Map<String, Object> fileInfo = new HashMap<>();
                        fileInfo.put("filename", path.getFileName().toString());
                        fileInfo.put("url", FileUtil.generateFileUrl(username, path.getFileName().toString()));
                        return fileInfo;
                    })
                    .collect(Collectors.toCollection(ArrayList::new));
        }
        data.put("files", fileList);
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
            throw new CustomError("Could not delete the file!");
        }
    }

    @Override
    public boolean renameOne(String oldName, String newName, String username) throws IOException {
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + oldName);
        Resource resource = new UrlResource(userDir.toUri());
        if (resource.exists() || resource.isReadable()) {
            return Files.move(file, file.resolveSibling(newName)).isAbsolute();
        } else {
            throw new CustomError("Could not rename the file!");
        }
    }


}