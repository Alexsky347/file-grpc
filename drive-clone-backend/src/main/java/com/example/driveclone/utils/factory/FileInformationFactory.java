package com.example.driveclone.utils.factory;

import java.util.HashMap;
import java.util.Map;

import com.example.driveclone.utils.storage.util.FileUtil;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

public class FileInformationFactory {
    public static Map<String, Object> createFileInformation(String username, Path path) throws IOException {
        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("filename", path.getFileName().toString());
        fileInfo.put("url", FileUtil.generateFileUrl(username, path.getFileName().toString()));
        
        File file = new File(path.toString());
        if (file.exists()) {
            fileInfo.put("size", FileUtil.getFileSize(file));
            fileInfo.put("createdDate", FileUtil.getFileCreationTime(path));
            fileInfo.put("lastModifiedDate", FileUtil.getFileLastModifiedTime(path));
        }
        
        return fileInfo;
    }
}
