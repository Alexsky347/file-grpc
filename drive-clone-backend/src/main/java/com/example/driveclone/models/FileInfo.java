package com.example.driveclone.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import java.sql.Date;

@Getter
@Setter
@Entity
@Table(name = "files",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "url"),
                @UniqueConstraint(columnNames = "name")
        })
public class FileInfo {git add
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String url;
    private Float size;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastModifiedDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    public FileInfo() {
    }

    public FileInfo(String name, Float size, User user, Date createdDate, @Nullable Date lastModifiedDate) {
        this.name = name;
        this.url = "/static/" + user.getUsername() + "/" + name;
        this.size = size;
        this.user = user;
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate != null ? new Date(lastModifiedDate.getTime()) : null;
    }

}