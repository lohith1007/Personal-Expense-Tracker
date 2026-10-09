package com.example.expensetracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.expensetracker.security.JwtAuthInterceptor;

/** Central place for CORS and for deciding which URLs require a JWT. */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final JwtAuthInterceptor jwtAuthInterceptor;
    private final String[] allowedOrigins;

    public WebConfig(JwtAuthInterceptor jwtAuthInterceptor,
                     @Value("${app.cors.allowed-origins:http://localhost:3000}") String[] allowedOrigins) {
        this.jwtAuthInterceptor = jwtAuthInterceptor;
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtAuthInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/register", "/login", "/error");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Accept")
                .maxAge(3600); // browsers may cache the preflight answer for an hour
    }
}
