package com.main.springhexagonal.util.auth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Document("users")
public class UserEntity{

    public UserEntity() {
    }

    public UserEntity(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public UserEntity(String username, String password, Map<String, ?> customFields) {
        this.username = username;
        this.password = password;
        this.customFields = customFields;
    }

    @Id
    private String id;
    private String username;
    @JsonIgnore
    private String password;

    private Map<String, ?> customFields = new HashMap<>();

    public String getId() {
        return id;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Map<String, ?> getCustomFields() {
        return customFields;
    }

    public void setCustomFields(Map<String, ?> customFields) {
        this.customFields = customFields;
    }
}