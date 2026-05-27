package com.buildmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BuildMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuildMartApplication.class, args);
        System.out.println("""
            
            ╔══════════════════════════════════════════════╗
            ║   🏗️  BuildMart AI — Server Running          ║
            ║                                              ║
            ║   API    →  http://localhost:8080/api        ║
            ║   Swagger→  http://localhost:8080/api/       ║
            ║             swagger-ui.html                  ║
            ║   Health →  http://localhost:8080/api/       ║
            ║             actuator/health                  ║
            ║                                              ║
            ║   Demo logins (password: Demo@1234):         ║
            ║   customer@demo.com  |  vendor@demo.com      ║
            ║   admin@demo.com                             ║
            ╚══════════════════════════════════════════════╝
            """);
    }
}
