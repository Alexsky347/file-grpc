package com.example.driveclone.utils.storage.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.io.IOException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

import javax.print.attribute.standard.DateTimeAtCreation;

import java.io.File;

public class FileUtil {
    private static final Logger logger =
            LoggerFactory.getLogger(FileUtil.class);

    private FileUtil() {
    }

    public static byte[] compressImage(byte[] data) {

        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];
        while (!deflater.finished()) {
            int size = deflater.deflate(tmp);
            outputStream.write(tmp, 0, size);
        }
        try {
            outputStream.close();
        } catch (Exception e) {
            logger.error(String.valueOf(e));
        }
        return outputStream.toByteArray();
    }

    public static byte[] decompressImage(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            outputStream.close();
        } catch (Exception exception) {
            logger.error(String.valueOf(exception));
        }
        return outputStream.toByteArray();
    }

    public static String generateFileUrl(String username, String filename) {
        return String.format("/static/%s/%s", username, filename);
    }

    public static double getFileSize(File file) {
        double fileSizeInGB = 0;
        
        // Get the file size in bytes
        long fileSize = file.length();
            
        // Convert bytes to kilobytes, megabytes, etc. if needed
        double fileSizeInKB = fileSize / 1024.0;
        double fileSizeInMB = fileSizeInKB / 1024.0;
        fileSizeInGB = fileSizeInMB / 1024.0;

        return fileSizeInGB;
    }

    public static String getFileCreationTime(Path path) throws java.io.IOException  {
        BasicFileAttributeView view = Files.getFileAttributeView(path, BasicFileAttributeView.class);
        BasicFileAttributes attributes = view.readAttributes();
        return attributes.creationTime().toString();
    }

    public static String getFileLastModifiedTime(Path path) throws java.io.IOException {
        BasicFileAttributeView view = Files.getFileAttributeView(path, BasicFileAttributeView.class);
        BasicFileAttributes attributes = view.readAttributes();
        return attributes.lastModifiedTime().toString();
    }
}
