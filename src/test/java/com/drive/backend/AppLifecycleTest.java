package com.drive.backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class AppLifecycleTest {

    @Test
    void testOnStart() {
        AppLifecycle lifecycle = new AppLifecycle();
        assertDoesNotThrow(lifecycle::onStart);
    }

    @Test
    void testOnStop() {
        AppLifecycle lifecycle = new AppLifecycle();
        assertDoesNotThrow(lifecycle::onStop);
    }

    @Test
    void testOnRestart() {
        AppLifecycle lifecycle = new AppLifecycle();
        assertDoesNotThrow(lifecycle::onRestart);
    }

    @Test
    void testOnInit() {
        AppLifecycle lifecycle = new AppLifecycle();
        assertDoesNotThrow(lifecycle::onInit);
    }

    @Test
    void testOnDestroy() {
        AppLifecycle lifecycle = new AppLifecycle();
        assertDoesNotThrow(lifecycle::onDestroy);
    }
}
