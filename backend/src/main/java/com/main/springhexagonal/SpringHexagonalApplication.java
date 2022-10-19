package com.main.springhexagonal;

import com.main.springhexagonal.adaptaters.service.UserService;
import com.main.springhexagonal.config.EnvService;
import com.main.springhexagonal.util.auth.model.RoleEnum;
import com.main.springhexagonal.util.auth.model.UserEntity;
import com.main.springhexagonal.util.auth.util.JwtUtil;
import com.main.springhexagonal.util.fileStorage.service.IFilesStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;


@SpringBootApplication
public class SpringHexagonalApplication {

    private static final Logger logger =
            LoggerFactory.getLogger(SpringHexagonalApplication.class);
    @Resource
    IFilesStorageService storageService;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    public static void main(String[] args) {
        logger.info("running app");
        SpringApplication.run(SpringHexagonalApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserService userService) {
        return args -> {

            String username = EnvService.getProp("user.username");
            if (userService.findByUsername(username) == null) {
                userService.save(new UserEntity(username, EnvService.getProp("user.pwd"), new HashMap<>()));
            }
            // storageService.deleteAll();
            // storageService.init();
            // generate RSA keys
            JwtUtil.generateRSAKeys();
        };
    }


}
