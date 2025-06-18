package com.drive.backend.grpc.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.time.LocalDateTime;


@Entity
@Table(name = "files")
@Getter
@Setter
@ToString
public class FileEntity {

    @Id
    @SequenceGenerator(name = "files_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "files_id_seq")
    private Long id;
    private String name;
    private String url;
    private long size;
    private String contentType;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String userId;
}