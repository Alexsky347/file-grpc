package com.example.driveclone;

import com.example.driveclone.models.ERole;
import com.example.driveclone.models.Role;
import com.example.driveclone.models.User;
import com.example.driveclone.repository.RoleRepository;
import com.example.driveclone.repository.UserRepository;
import com.example.driveclone.utils.storage.service.IFilesStorageService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;
import java.util.Optional;

import static org.mockito.Mockito.when;

@SpringBootTest
class DriveCloneApplicationTests {

    @InjectMocks
    private DriveCloneApplication driveCloneApplication;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private IFilesStorageService storageService;

    @Mock
    private LocalContainerEntityManagerFactoryBean entityManagerFactory;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRunMethod() throws Exception {
        EntityManager mockEntityManager = Mockito.mock(EntityManager.class);
        DataSource mockDataSource = Mockito.mock(DataSource.class);

        when(entityManagerFactory.getObject()).thenReturn((EntityManagerFactory) mockEntityManager);
        when(entityManagerFactory.getDataSource()).thenReturn(mockDataSource);
        
        String username = "testUser";
        String email = "test@example.com";
        String pwd = "testPassword";

        User existingUser = new User(username, email, pwd);
        Role adminRole = new Role();
        adminRole.setName(ERole.ROLE_ADMIN);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(existingUser));
        when(roleRepository.findByName(ERole.ROLE_ADMIN)).thenReturn(Optional.of(adminRole));

        CommandLineRunner commandLineRunner = driveCloneApplication.run(userRepository, roleRepository);
        commandLineRunner.run("test", "args");

        Mockito.verify(userRepository, Mockito.times(0)).save(Mockito.any());
        Mockito.verify(roleRepository, Mockito.times(0)).save(Mockito.any());

    }
}
