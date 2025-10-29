package com.drive.backend.grpc.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class MinioServiceTest {

    @Test
    void testExtractFilenameFromObjectName() {
        final String objectName = "user1/12345678-1234-1234-1234-123456789012-testfile.txt";
        final String expected = "testfile.txt";
        assertEquals(expected, MinioService.extractFilenameFromObjectName(objectName));
    }

    @Test
    void testExtractFilenameFromObjectNameNoDash() {
        final String objectName = "user1/12345678123412341234123456789012testfile.txt";
        final String expected = "12345678123412341234123456789012testfile.txt";
        assertEquals(expected, MinioService.extractFilenameFromObjectName(objectName));
    }

    @Test
    void testExtractUuidFromObjectName() {
        final String objectName = "user1/12345678-1234-1234-1234-123456789012-testfile.txt";
        final String expected = "12345678-1234-1234-1234-123456789012";
        assertEquals(expected, MinioService.extractUuidFromObjectName(objectName));
    }

    @Test
    void testExtractUuidFromObjectNameInvalid() {
        final String objectName = "user1/12345678123412341234123456789012testfile.txt";
        assertNull(MinioService.extractUuidFromObjectName(objectName));
    }
}
