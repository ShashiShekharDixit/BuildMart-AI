package com.buildmart.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableCaching
@EnableScheduling
@EnableAsync
public class AppConfig implements WebMvcConfigurer {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public OpenAPI buildMartOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("BuildMart AI — REST API")
                .description("""
                    Smart Construction Material Marketplace API.
                    
                    **Demo accounts:**
                    - customer@demo.com / Demo@1234
                    - vendor@demo.com   / Demo@1234
                    - admin@demo.com    / Demo@1234
                    
                    Login at `/auth/login`, copy the `accessToken`, click **Authorize** and paste it.
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("BuildMart Team")
                    .email("api@buildmart.ai"))
                .license(new License().name("Proprietary")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
            .components(new Components()
                .addSecuritySchemes("Bearer Authentication",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Paste the accessToken from /auth/login")));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
    }
}
