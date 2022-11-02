package com.main.springhexagonal.adaptaters.api;

import com.main.springhexagonal.adaptaters.service.UserService;
import com.main.springhexagonal.util.auth.model.UserEntity;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController extends MainController{
    @Autowired
    private UserService userService;

    @PostMapping
    public UserEntity register(@Valid @RequestBody UserEntity user) {
        return userService.save(user);
    }


    @PostMapping("/editCustomFields")
    public UserEntity editCustomFields(@RequestBody Map<String, ?> customFields, HttpServletRequest httpServletRequest) throws ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return userService.editCustomFields(customFields, username);
    }
}
