package com.example.driveclone.utils.storage.service;

import com.example.driveclone.models.FileInfo;
import com.example.driveclone.models.User;
import com.example.driveclone.repository.FileRepository;
import com.example.driveclone.utils.exception.CustomError;
import com.example.driveclone.utils.exception.CustomRuntimeException;
import com.example.driveclone.utils.factory.FileInformationFactory;
import com.example.driveclone.utils.storage.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    FileRepository fileRepository;

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
    public Map<String, String> save(MultipartFile file, User user) throws IOException {
        String username = user.getUsername();
        Path userDir = this.getUserDir(username);
        if (!Files.exists(userDir)) {
            Files.createDirectory(userDir);
        }
        Path filePath = userDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        FileInfo fileInfo = new FileInfo(filePath.getFileName().toString(), FileUtil.getFileSize(new File(filePath.toString())), user, new Date(), null);
        fileRepository.save(fileInfo);
        Map<String, String> mp = new HashMap<>();
        mp.put("file uploaded", filePath.getFileName().toString());
        return mp;
    }

    @Override
    public Resource load(String filename, User user) throws MalformedURLException {
        String username = user.getUsername();
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
    public Map<String, Object> loadAll(final User user, final int limit, final int offset, final String search, final String sortMode, final String sortBy) throws IOException {
        String sortByValue = sortBy != null ? sortBy : "filename";
        String sortModeValue = sortMode != null ? sortMode : "asc";
        String username = user.getUsername();
        int depth = 1;
        Path userDir = getUserDir(username);
        List<Map<String, Object>> fileList = new ArrayList<>();
        File directory = new File(userDir.toUri());
        Map<String, Object> data = new HashMap<>();
        int fileCount = Objects.requireNonNull(directory.list()).length;
        data.put("total", fileCount);

        try (Stream<Path> stream = Files.walk(userDir, depth)) {
            fileList = stream
                    .filter((file) -> {
                        if (search.trim().isEmpty()) {
                            return !Files.isDirectory(file);
                        }
                        return !Files.isDirectory(file) && file.getFileName().toString().toLowerCase().contains(search.toLowerCase());
                    })
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
                        try {
                            return FileInformationFactory.createFileInformation(username, path);
                        } catch (IOException e) {
                            throw new CustomRuntimeException(e);
                        }
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
    public boolean deleteOne(String filename, User user) throws IOException {
        String username = user.getUsername();
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
    public boolean renameOne(String oldName, String newName, User user) throws IOException {
        String username = user.getUsername();
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