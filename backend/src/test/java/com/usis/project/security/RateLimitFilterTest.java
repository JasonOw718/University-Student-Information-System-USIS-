package com.usis.project.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.mockito.Mockito.*;

class RateLimitFilterTest {

    private RateLimitFilter rateLimitFilter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        rateLimitFilter = new RateLimitFilter();
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void shouldAllowAuthenticatedUserUpTo30() throws ServletException, IOException {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("authUser");

        for (int i = 0; i < 30; i++) {
            rateLimitFilter.doFilterInternal(request, response, filterChain);
        }

        verify(filterChain, times(30)).doFilter(request, response);
    }

    @Test
    void shouldBlockAuthenticatedUserOver30() throws ServletException, IOException {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("authUserBlock");

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);

        for (int i = 0; i < 30; i++) {
            rateLimitFilter.doFilterInternal(request, response, filterChain);
        }

        // 31st request
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(30)).doFilter(request, response);
        verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }

    @Test
    void shouldAllowAnonymousUserUpTo10() throws ServletException, IOException {
        when(securityContext.getAuthentication()).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        for (int i = 0; i < 10; i++) {
            rateLimitFilter.doFilterInternal(request, response, filterChain);
        }

        verify(filterChain, times(10)).doFilter(request, response);
    }

    @Test
    void shouldBlockAnonymousUserOver10() throws ServletException, IOException {
        when(securityContext.getAuthentication()).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("192.168.1.2");

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);

        for (int i = 0; i < 10; i++) {
            rateLimitFilter.doFilterInternal(request, response, filterChain);
        }

        // 11th request
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(10)).doFilter(request, response);
        verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }
}
