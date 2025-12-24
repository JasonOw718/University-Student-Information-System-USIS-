package com.usis.project.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, UserRateLimit> userRateLimits = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_AUTH = 30;
    private static final int MAX_REQUESTS_ANON = 10;
    private static final Duration WINDOW_DURATION = Duration.ofMinutes(1);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String key;
        int limit;

        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {
            key = "USER:" + authentication.getName();
            limit = MAX_REQUESTS_AUTH;
        } else {
            key = "IP:" + request.getRemoteAddr();
            limit = MAX_REQUESTS_ANON;
        }

        if (!allowRequest(key, limit)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean allowRequest(String key, int maxRequests) {
        UserRateLimit limit = userRateLimits.compute(key, (k, current) -> {
            Instant now = Instant.now();
            if (current == null || now.isAfter(current.windowStart.plus(WINDOW_DURATION))) {
                return new UserRateLimit(now, 1);
            }
            return new UserRateLimit(current.windowStart, current.requestCount + 1);
        });

        return limit.requestCount <= maxRequests;
    }

    private static class UserRateLimit {
        final Instant windowStart;
        final int requestCount;

        UserRateLimit(Instant windowStart, int requestCount) {
            this.windowStart = windowStart;
            this.requestCount = requestCount;
        }
    }
}
