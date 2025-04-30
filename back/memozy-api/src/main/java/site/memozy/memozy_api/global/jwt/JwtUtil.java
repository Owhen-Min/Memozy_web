package site.memozy.memozy_api.global.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.MacAlgorithm;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtil {

	private static final MacAlgorithm ALG = Jwts.SIG.HS256;
	private final SecretKey secretKey;

	public JwtUtil(@Value("${spring.jwt.secret}") String secret) {
		secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
			Jwts.SIG.HS256.key().build().getAlgorithm());
	}

	public Integer getUserId(String token) {

		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.get("userId", Integer.class);
	}

	public String getPersonalId(String token) {

		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.get("personalId", String.class);
	}

	public String getRole(String token) {

		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.get("role", String.class);
	}

	public String getName(String token) {
		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.get("name", String.class);
	}

	public Boolean isExpired(String token) {

		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.getExpiration()
			.before(new Date());
	}

	public String createJwt(Integer userId, String personalId, String role, String name, Long expiredMs) {

		return Jwts.builder()
			.claim("userId", userId)
			.claim("personalId", personalId)
			.claim("role", role)
			.claim("name", name)
			.issuedAt(new Date(System.currentTimeMillis()))
			.expiration(new Date(System.currentTimeMillis() + expiredMs * 1000))
			.signWith(secretKey, ALG)
			.compact();
	}
}
