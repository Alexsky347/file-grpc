package com.drive.backend;

import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AppLifecycle {
    // This class can be used to manage application lifecycle events
    // such as startup, shutdown, etc. Currently, it is empty and can be extended as needed.

    // Example methods could include:
    // - onStart()
    // - onStop()
    // - onRestart()

    // For now, it serves as a placeholder for future lifecycle management logic.
    public void onStart() {
        // Logic to execute when the application starts
    }
    public void onStop() {
        // Logic to execute when the application stops
    }
    public void onRestart() {
        // Logic to execute when the application restarts
    }
    public void onInit() {
        // Logic to execute during initialization
    }
    public void onDestroy() {
        // Logic to execute during application destruction
        Log.info("Application has been destroyed");
    }
}
