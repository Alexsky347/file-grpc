package com.main.springhexagonal.adaptaters.service;

import com.main.springhexagonal.util.auth.dao.UserRepository;
import com.main.springhexagonal.util.auth.model.UserEntity;
import com.main.springhexagonal.util.auth.service.IUserService;
import com.main.springhexagonal.util.auth.util.JwtUtil;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.BadJOSEException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;


@Service("userService")
public class UserService implements IUserService, UserDetailsService {

    private static final Logger logger =
            LoggerFactory.getLogger(UserService.class);

    private static final String USER_NOT_FOUND_MESSAGE = "User with username %s not found";

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            String message = String.format(USER_NOT_FOUND_MESSAGE, username);
            logger.error(message);
            throw new UsernameNotFoundException(message);
        } else {
            logger.debug("User found in the database: {}", username);
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            return new User(user.getUsername(), user.getPassword(), authorities);
        }
    }

    @Override
    public UserEntity save(UserEntity user) {
        logger.info("Saving user {} to the database", user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }


    @Override
    public UserEntity editCustomFields(Map<String, ?> customFields, String username) {
        UserEntity userEntity = userRepository.findByUsername(username);
        userEntity.setCustomFields(customFields);
        return userEntity;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Override
    public UserEntity findByUsername(String username) {
        logger.info("Retrieving user {}", username);
        return userRepository.findByUsername(username);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Override
    public List<UserEntity> findAll() {
        logger.info("Retrieving all users");
        return userRepository.findAll();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Override
    public Map<String, String> refreshToken(String authorizationHeader, String issuer) throws BadJOSEException,
            ParseException, JOSEException {

        String refreshToken = authorizationHeader.substring("Bearer ".length());
        UsernamePasswordAuthenticationToken authenticationToken = JwtUtil.parseToken(refreshToken);
        String username = authenticationToken.getName();
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_ADMIN");
        String accessToken = JwtUtil.createAccessToken(username, issuer, roles);
        return Map.of("access_token", accessToken, "refresh_token", refreshToken);
    }

}