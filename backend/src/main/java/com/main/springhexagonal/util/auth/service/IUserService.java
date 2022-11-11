package com.main.springhexagonal.util.auth.service;

import com.main.springhexagonal.util.auth.model.UserEntity;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.BadJOSEException;

import java.text.ParseException;
import java.util.List;
import java.util.Map;


public interface IUserService {

    UserEntity save(UserEntity user);

    UserEntity editCustomFields(Map<String, ?> customFields, String username);

    UserEntity findByUsername(String username);

    List<UserEntity> findAll();

    Map<String, String> refreshToken(String authorizationHeader, String issuer) throws BadJOSEException, ParseException, JOSEException;

    void deleteUser(UserEntity userEntity);
}
