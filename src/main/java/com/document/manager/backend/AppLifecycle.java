package com.document.manager.backend;

import jakarta.enterprise.context.ApplicationScoped;
import lombok.extern.slf4j.Slf4j;

/**
 * AppLifecycle is a class that can be used to manage application lifecycle events such as startup and shutdown.
 * It is annotated with @ApplicationScoped to ensure it is a singleton within the application context.
 * The @Slf4j annotation provides a logger for logging lifecycle events.
 */
@Slf4j
@ApplicationScoped
public class AppLifecycle {
    // This class can be used to manage application lifecycle events
    // such as startup, shutdown, etc. Currently, it is empty and can be extended as needed.
    private AppLifecycle() {
        // Private constructor to prevent instantiation
    }

    // Example methods could include:
    // - onStart()
    // - onStop()
    // - onRestart()
}
