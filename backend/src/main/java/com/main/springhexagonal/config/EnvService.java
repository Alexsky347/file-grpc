package com.main.springhexagonal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.yaml.snakeyaml.error.MissingEnvironmentVariableException;

@Configuration
public class EnvService {
    private static Environment env;

    public EnvService(Environment env) {
        EnvService.env = env;
    }

    public static String getProp(String property) throws MissingEnvironmentVariableException {
        return env.getProperty(property);
    }
}
