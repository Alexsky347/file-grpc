package com.example.driveclone;

import com.example.driveclone.config.EnvService;
import com.example.driveclone.models.ERole;
import com.example.driveclone.models.Role;
import com.example.driveclone.models.User;
import com.example.driveclone.repository.RoleRepository;
import com.example.driveclone.repository.UserRepository;
import com.example.driveclone.utils.main.KeysPairUtils;
import com.example.driveclone.utils.storage.service.IFilesStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

@SpringBootApplication
public class DriveCloneApplication {

    private static final Logger logger =
            LoggerFactory.getLogger(DriveCloneApplication.class);


    private final IFilesStorageService storageService;
    private final PasswordEncoder encoder;

    DriveCloneApplication(IFilesStorageService storageService, PasswordEncoder encoder) {
        this.storageService = storageService;
        this.encoder = encoder;
    }

    public static void main(String[] args) {
        logger.info("running app");

        SpringApplication.run(DriveCloneApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {

            String username = EnvService.getProp("user.username");
            String email = EnvService.getProp("user.email");
            String pwd = EnvService.getProp("user.pwd");

            logger.debug("USERNAME {0} .", username);
            Optional<User> user = userRepository.findByUsername(username);

//            user.ifPresent(userRepository::delete);
            if (user.isEmpty()) {
                // roles
                Arrays.stream(ERole.values()).forEach(
                        role -> {
                            if (roleRepository.findByName(role).isEmpty()) {
                                Role newRole = new Role();
                                newRole.setName(role);
                                roleRepository.save(newRole);
                            }
                        }
                );
                // user
                User mainUser = new User(username, email, encoder.encode(pwd));
                java.util.Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(adminRole);
                mainUser.setRoles(roles);
                userRepository.save(mainUser);
            }

            //init storage
            storageService.init();

            // generate RSA keys
            KeysPairUtils.generateRSAKeys();
        };
    }

}
