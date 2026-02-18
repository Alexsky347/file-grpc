package com.document.manager.backend.grpc.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MinioServiceTest {
    // Reflection helpers to access private static methods
    private static String invokeExtractFilenameFromObjectName(final String objectName) {
        try {
            final var method = MinioService.class.getDeclaredMethod("extractFilenameFromObjectName", String.class);
            method.setAccessible(true);
            return (String) method.invoke(null, objectName);
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String invokeExtractUuidFromObjectName(final String objectName) {
        try {
            final var method = MinioService.class.getDeclaredMethod("extractUuidFromObjectName", String.class);
            method.setAccessible(true);
            return (String) method.invoke(null, objectName);
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String invokeGenerateObjectName(final String filename, final String username) {
        try {
            final var method = MinioService.class.getDeclaredMethod("generateObjectName", String.class, String.class);
            method.setAccessible(true);
            return (String) method.invoke(null, filename, username);
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testExtractFilenameFromObjectName_basic() {
        final String objectName = "user1/123e4567-e89b-12d3-a456-426614174000-myfile.txt";
        final String expected = "myfile.txt";
        assertEquals(expected, MinioServiceTest.invokeExtractFilenameFromObjectName(objectName));
    }

    @Test
    void testExtractFilenameFromObjectName_noDash() {
        final String objectName = "user1/123e4567e89b12d3a456426614174000myfile.txt";
        final String expected = "123e4567e89b12d3a456426614174000myfile.txt";
        assertEquals(expected, MinioServiceTest.invokeExtractFilenameFromObjectName(objectName));
    }

    @Test
    void testExtractFilenameFromObjectName_unexpectedFormat() {
        final String objectName = "user1/myfile.txt";
        final String expected = "myfile.txt";
        assertEquals(expected, MinioServiceTest.invokeExtractFilenameFromObjectName(objectName));
    }

    @Test
    void testExtractUuidFromObjectName_basic() {
        final String objectName = "user1/123e4567-e89b-12d3-a456-426614174000-myfile.txt";
        final String expected = "123e4567-e89b-12d3-a456-426614174000";
        assertEquals(expected, MinioServiceTest.invokeExtractUuidFromObjectName(objectName));
    }

    @Test
    void testExtractUuidFromObjectName_invalid() {
        final String objectName = "user1/myfile.txt";
        assertNull(MinioServiceTest.invokeExtractUuidFromObjectName(objectName));
    }

    @Test
    void testGenerateObjectName() {
        final String filename = "myfile.txt";
        final String username = "user1";
        final String objectName = MinioServiceTest.invokeGenerateObjectName(filename, username);
        assertTrue(objectName.startsWith(username + "/"));
        assertTrue(objectName.endsWith("-" + filename));
        final String uuid = objectName.substring(username.length() + 1, username.length() + 1 + 36);
        assertEquals(36, uuid.length());
    }

    @Test
    void testGenerateObjectName_blankFilename() {
        final String filename = "";
        final String username = "user1";
        final String objectName = MinioServiceTest.invokeGenerateObjectName(filename, username);
        assertTrue(objectName.endsWith("-random"));
    }
}
