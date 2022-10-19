package com.main.springhexagonal.adaptaters.api;

import com.main.springhexagonal.util.auth.util.JwtUtil;
import com.nimbusds.jose.JOSEException;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

public class MainController {

    public String retrieveUser(@NotNull HttpServletRequest request) throws ParseException, JOSEException {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        String token;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring("Bearer ".length());
            UsernamePasswordAuthenticationToken authenticationToken = JwtUtil.parseToken(token);
            return (String) authenticationToken.getPrincipal();

        }
        return null;
    }
}
