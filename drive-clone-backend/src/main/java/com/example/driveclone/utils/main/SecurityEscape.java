package com.example.driveclone.utils.main;

public class SecurityEscape {
    private SecurityEscape() {
    }

    public static String cleanIt(String arg0) {
        return arg0.replaceAll("[^a-zA-Z0-9]", "");
    }
}