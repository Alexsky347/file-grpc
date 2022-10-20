package com.main.springhexagonal.adaptaters.api;

import com.main.springhexagonal.util.fileStorage.service.FilesStorageService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.*;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class FilesController extends MainController{
    @Autowired
    FilesStorageService storageService;



    @PostMapping("/files")
    @ResponseStatus(HttpStatus.OK)

    public String uploadFiles(@RequestParam("files") MultipartFile[] files, HttpServletRequest httpServletRequest) throws ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        List<String> fileNames = new ArrayList<>();
        Arrays.asList(files).stream().forEach(file -> {
            try {
                storageService.save(file, username);
            } catch (IOException e) {
                e.printStackTrace();
            }
            file.getOriginalFilename();
        });
        return "Uploaded the files successfully: " + fileNames;
    }

    @PostMapping("/file")
    @ResponseStatus(code = HttpStatus.OK)
    public Resource uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return storageService.save(file, username);
    }


    @GetMapping(value="/files", produces = MediaType.APPLICATION_JSON_VALUE)
    public Set<String> getListFiles(HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return storageService.loadAll(username);
    }

    @GetMapping(value="/file/{filename:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
    public Resource getFile(@PathVariable String filename,
                                            HttpServletRequest httpServletRequest,
                                            HttpServletResponse httpServletResponse) throws MalformedURLException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        Path dir = Paths.get(FilesStorageService.root + "/" + username);
        Resource file = storageService.load(filename, dir);
        httpServletResponse.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFilename());
        httpServletResponse.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
        return file;
    }

    @DeleteMapping(value="/file/{filename:.+}", produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean deleteFile(@PathVariable String filename, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        Path dir = Paths.get(FilesStorageService.root + "/" + username);
        return storageService.deleteOne(filename, dir);
    }
}
