package com.example.driveclone.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;


@Getter
@Setter
@Entity
@Table(name = "files")
public class FileInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String url;
    private long size;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastModifiedDate;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    public FileInfo() {
    }

    public FileInfo(String name, long size, User user, Date createdDate) {
        this.name = name;
        this.url = "/static/" + user.getUsername() + "/" + name;
        this.size = size;
        this.user = user;
        this.createdDate = createdDate;
    }

}