package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import java.util.Date;

@RegisterForReflection
public class FileInfo {
    private String objectName;
    private String filename;
    private long size;
    private Date lastModified;
    private String fileUrl;

    public FileInfo() {
    }

    public FileInfo(String objectName, String filename, long size, Date lastModified, String fileUrl) {
        this.objectName = objectName;
        this.filename = filename;
        this.size = size;
        this.lastModified = lastModified;
        this.fileUrl = fileUrl;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}
