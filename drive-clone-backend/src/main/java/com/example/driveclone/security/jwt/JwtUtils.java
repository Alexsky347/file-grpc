package com.example.driveclone.security.jwt;

import com.example.driveclone.security.services.UserDetailsImpl;
import com.example.driveclone.utils.main.GenerateKeyUtils;
import com.nimbusds.jose.JOSEException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.security.Key;
import java.security.interfaces.RSAPrivateKey;
import java.text.ParseException;
import java.util.Date;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${drive.app.jwtSecret}")
  private String jwtSecret;

  @Value("${drive.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  @Value("${drive.app.jwtCookieName}")
  private String jwtCookie;

  public String getJwtFromCookies(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtCookie);
    if (cookie != null) {
      return cookie.getValue();
    } else {
      return null;
    }
  }

  public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
    String jwt = generateTokenFromUsername(userPrincipal.getUsername());
    return ResponseCookie.from(jwtCookie, jwt)
            .httpOnly(true)
            .sameSite("None")
            .secure(true)
            .path("/")
            .maxAge(Math.toIntExact(jwtExpirationMs))
            .build();
  }

  public ResponseCookie getCleanJwtCookie() {
    return ResponseCookie.from(jwtCookie, null).path("/").build();
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key()).build()
            .parseClaimsJws(token).getBody().getSubject();
  }

  private RSAPrivateKey key() {
    return GenerateKeyUtils.getPrivateKey();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder()
              .setSigningKey(key())
              .build()
              .parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }

  public String generateTokenFromUsername(String username) {
    return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + 100000))
            .signWith(key(), SignatureAlgorithm.RS256)
            .compact();
  }

  public String retrieveUser(@NotNull HttpServletRequest request) throws ParseException, JOSEException {
    Cookie[] cookies = request.getCookies();
    String user = null;

    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals(jwtCookie)) {
          String token = cookie.getValue();
          UsernamePasswordAuthenticationToken authenticationToken = GenerateKeyUtils.parseToken(token);
          user = (String) authenticationToken.getPrincipal();
        }
      }
    }

    return user;
  }
}
