package com.example.driveclone.utils.main;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.util.List;


public abstract class KeysPairUtils {

    @Value("${drive.app.jwtExpirationMs}")
    private static int jwtExpirationMs;

    private static final int expireHourToken = 24;
    private static final int expireHourRefreshToken = 72;
    private static JWSSigner signer;
    private static RSAPublicKey publicKey;

    @Getter
    private static RSAPrivateKey privateKey;

    public static void generateRSAKeys() throws NoSuchAlgorithmException {
        if (signer == null && publicKey == null) {
            // RSA signatures require a public and private RSA key pair,
            // the public key must be made known to the JWS recipient in
            // order to verify the signatures
            KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance("RSA");
            keyGenerator.initialize(2048);

            KeyPair kp = keyGenerator.genKeyPair();
            publicKey = (RSAPublicKey) kp.getPublic();
            privateKey = (RSAPrivateKey) kp.getPrivate();

            // Create RSA-signer with the private key
            signer = new RSASSASigner(privateKey);
        }
    }

    public static UsernamePasswordAuthenticationToken parseToken(String token) throws JOSEException, ParseException {

        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new RSASSAVerifier(publicKey);
        signedJWT.verify(verifier);
        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
        String username = claims.getSubject();
        var roles = (List<String>) claims.getClaim("roles");
        var authorities = roles == null ? null : roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }

    public static boolean validateToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new RSASSAVerifier(publicKey);
        return signedJWT.verify(verifier);
    }

}
