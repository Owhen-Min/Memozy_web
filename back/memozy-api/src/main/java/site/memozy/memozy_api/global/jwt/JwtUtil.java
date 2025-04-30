package site.memozy.memozy_api.global.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.MacAlgorithm;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;

@Slf4j
@Component
public class JwtUtil {

	private static final long TOKEN_EXPIRATION = 60L * 60L * 24L * 365L; // 1년
	private static final MacAlgorithm ALG = Jwts.SIG.HS256;
	private final SecretKey secretKey;

	public JwtUtil(@Value("${spring.jwt.secret}") String secret) {
		secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
			ALG.key().build().getAlgorithm());
	}

	private Claims parseClaims(String token) {
		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}

	public Integer getUserId(String token) {
		return parseClaims(token).get("userId", Integer.class);
	}

	public String getPersonalId(String token) {
		return parseClaims(token).get("personalId", String.class);
	}

	public String getRole(String token) {
		return parseClaims(token).get("role", String.class);
	}

	public String getName(String token) {
		return parseClaims(token).get("name", String.class);
	}

	public String getEmail(String token) {
		return parseClaims(token).get("email", String.class);
	}

	public String getProfileImage(String token) {
		return parseClaims(token).get("profileImage", String.class);
	}

	public Boolean isExpired(String token) {
		return parseClaims(token).getExpiration().before(new Date());
	}

	public String createJwt(CustomOAuth2User customOAuth2User, String role) {
		return Jwts.builder()
			.claim("userId", customOAuth2User.getUserId())
			.claim("personalId", customOAuth2User.getPersonalId())
			.claim("role", role)
			.claim("name", customOAuth2User.getName())
			.claim("email", customOAuth2User.getEmail())
			.claim("profileImage", customOAuth2User.getProfileImage())
			.issuedAt(new Date(System.currentTimeMillis()))
			.expiration(new Date(System.currentTimeMillis() + TOKEN_EXPIRATION * 1000))
			.signWith(secretKey, ALG)
			.compact();
	}
}
