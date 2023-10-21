package com.example.driveclone.utils.storage.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


public class FileUtil {
    private static final Logger logger =
            LoggerFactory.getLogger(FileUtil.class);

    private FileUtil() {
    }

    public static long getFileSize(File file) {
        return file.length();
    }

    public static String getFileCreationTime(Path path) throws java.io.IOException {
        BasicFileAttributeView view = Files.getFileAttributeView(path, BasicFileAttributeView.class);
        BasicFileAttributes attributes = view.readAttributes();
        return attributes.creationTime().toString();
    }

    public static String getFileLastModifiedTime(Path path) throws java.io.IOException {
        BasicFileAttributeView view = Files.getFileAttributeView(path, BasicFileAttributeView.class);
        BasicFileAttributes attributes = view.readAttributes();
        return attributes.lastModifiedTime().toString();
    }

    public static String getContentType(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.probeContentType(path);
        } catch (IOException e) {
            logger.error(String.valueOf(e));
            return null;
        }
    }

    public static boolean isImage(String contentType) {
        Set<String> imageMimeTypes = new HashSet<>();
        imageMimeTypes.add("image/jpeg");
        imageMimeTypes.add("image/png");
        imageMimeTypes.add("image/gif");
        imageMimeTypes.add("image/bmp");

        return imageMimeTypes.contains(contentType);
    }

    public static void zipFile(String sourceFilePath, String destinationFilePath) throws IOException {
        FileOutputStream fos = new FileOutputStream(destinationFilePath);
        ZipOutputStream zipOut = new ZipOutputStream(fos);

        FileInputStream fis = new FileInputStream(sourceFilePath);
        ZipEntry zipEntry = new ZipEntry("your_zipped_file_name.zip");
        zipOut.putNextEntry(zipEntry);

        byte[] bytes = new byte[1024];
        int length;

        while ((length = fis.read(bytes)) >= 0) {
            zipOut.write(bytes, 0, length);
        }

        fis.close();
        zipOut.close();
        fos.close();
    }
}
