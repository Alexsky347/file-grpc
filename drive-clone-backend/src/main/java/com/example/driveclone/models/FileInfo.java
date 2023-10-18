package com.example.driveclone.models;

import com.example.driveclone.utils.storage.util.FileUtil;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;


@Entity
@Table(name = "files")
public class FileInfo {

    private static final Logger logger =
            LoggerFactory.getLogger(FileUtil.class);
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private String name;

    @Setter
    private String url;

    @Getter
    @Setter
    private long size;

    @Getter
    private String contentType;

    @Getter
    @Setter
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;

    @Getter
    @Setter
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastModifiedDate;

    @Getter
    @Setter
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
        this.contentType = FileUtil.getContentType(name);
    }

    public String getUrl() {
        try {
            Resource resource = new ClassPathResource(url);
            byte[] fileContent = FileCopyUtils.copyToByteArray(resource.getInputStream());
            String encodedFile = null;
            if (contentType != null) {
                encodedFile = Base64.getEncoder().encodeToString(fileContent);
            }
            return encodedFile;
        } catch (IOException e) {
            logger.error(String.valueOf(e));
            return null;
        }
    }
}