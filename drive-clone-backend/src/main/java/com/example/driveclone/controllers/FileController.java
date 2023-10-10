package com.example.driveclone.controllers;

import com.example.driveclone.security.jwt.JwtUtils;
import com.example.driveclone.utils.exception.CustomRuntimeException;
import com.example.driveclone.utils.storage.service.FilesStorageService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.text.ParseException;
import java.util.*;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class FileController {

    private static final Logger logger =
            LoggerFactory.getLogger(FileController.class);
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    FilesStorageService storageService;

    @PostMapping(value = "/files/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)

    public Map<String, List<String>> uploadFiles(@RequestParam("file") MultipartFile[] files, HttpServletRequest httpServletRequest) {
        List<String> fileNames = new ArrayList<>();
        Map<String, List<String>> response = new HashMap<>();
        Arrays.stream(files).forEach(file -> {
            try {
                storageService.save(file, jwtUtils.retrieveUser(httpServletRequest));
            } catch (IOException | ParseException | JOSEException e) {
                throw new CustomRuntimeException(e);
            }
            fileNames.add(file.getOriginalFilename());
        });
        response.put("Uploaded the files successfully: ", fileNames);
        return response;
    }

    @PostMapping(value = "/file/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        return storageService.save(file, jwtUtils.retrieveUser(httpServletRequest));
    }


    @GetMapping(value = "/files/get", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getListFiles(@RequestParam String limit,
                                            @RequestParam String pageNumber,
                                            @RequestParam(required = false) String sortBy,
                                            @RequestParam(required = false) String sortMode,
                                            HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        int offset = (Integer.parseInt(pageNumber) - 1) * Integer.parseInt(limit);
        return storageService.loadAll(jwtUtils.retrieveUser(httpServletRequest), Integer.parseInt(limit), offset, sortBy, sortMode, null);
    }

    @GetMapping(value = "/file/get/{filename:.+}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public Resource getFile(@PathVariable String filename,
                            HttpServletRequest httpServletRequest,
                            HttpServletResponse httpServletResponse) throws MalformedURLException, ParseException, JOSEException {
        Resource file = storageService.load(filename, jwtUtils.retrieveUser(httpServletRequest));
        httpServletResponse.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFilename());
        httpServletResponse.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
        return file;
    }

    //DELETE AND PUT /PATCH = > CORS ISSUE
    @GetMapping(value = "/file/delete/{filename:.+}", produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean deleteFile(@PathVariable String filename, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        return storageService.deleteOne(filename, jwtUtils.retrieveUser(httpServletRequest));
    }


    @GetMapping(value = "/file/edit-name", produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean renameFile(@RequestParam String oldName, @RequestParam String newName, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        return storageService.renameOne(oldName, newName, jwtUtils.retrieveUser(httpServletRequest));
    }
}
