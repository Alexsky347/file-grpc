package com.example.driveclone.utils.storage.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

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
}
