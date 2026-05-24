package com.buildmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableAsync
public class BuildMartApplication {
    public static void main(String[] args) {
        SpringApplication.run(BuildMartApplication.class, args);
        System.out.println("""
            ╔══════════════════════════════════════════╗
            ║    BuildMart AI — Marketplace Running    ║
            ║    http://localhost:8080/api             ║
            ║    Swagger: /api/swagger-ui.html         ║
            ╚══════════════════════════════════════════╝
            """);
    }
}
