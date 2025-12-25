package com.example.ecommerce.service;

import com.example.ecommerce.dto.*;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.repository.*;
import com.example.ecommerce.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.NoSuchElementException;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo,
                       RefreshTokenRepository refreshRepo,
                       PasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.refreshRepo = refreshRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(Role.valueOf(req.getRole().toUpperCase()));
        userRepo.save(user);
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Invalid credentials"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String access = jwtUtil.generateAccessToken(
                user.getEmail(), user.getRole().name());
        String refresh = jwtUtil.generateRefreshToken(user.getEmail());

        // Save refresh token
        RefreshToken rt = new RefreshToken();
        rt.setToken(refresh);
        rt.setEmail(user.getEmail());
        rt.setExpiryDate(Instant.now().plusSeconds(604800)); // 7 days
        rt.setRevoked(false);
        refreshRepo.save(rt);

        return new AuthResponse(access, refresh);
    }

    public void logout(String refreshToken) {
        RefreshToken rt = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new NoSuchElementException("Invalid refresh token"));
        rt.setRevoked(true);
        refreshRepo.save(rt);
    }

    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken rt = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new NoSuchElementException("Invalid refresh token"));

        if (rt.isRevoked() || rt.getExpiryDate().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token expired or revoked");
        }

        User user = userRepo.findByEmail(rt.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        String access = jwtUtil.generateAccessToken(
                user.getEmail(), user.getRole().name());
        String newRefresh = jwtUtil.generateRefreshToken(user.getEmail());

        // Update refresh token
        rt.setToken(newRefresh);
        rt.setExpiryDate(Instant.now().plusSeconds(604800));
        refreshRepo.save(rt);

        return new AuthResponse(access, newRefresh);
    }
}
