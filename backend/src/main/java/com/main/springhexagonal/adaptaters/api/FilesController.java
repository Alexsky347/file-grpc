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
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

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


    @GetMapping(value="/files", produces = MediaType.IMAGE_JPEG_VALUE)
    public Set<String> getListFiles(HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return storageService.loadAll(username);
    }

    @GetMapping(value="/file/{filename:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<Resource> getFile(@PathVariable String filename, HttpServletRequest httpServletRequest) throws MalformedURLException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        Path dir = Paths.get(FilesStorageService.root + "/" + username);
        Resource file = storageService.load(filename, dir);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}
