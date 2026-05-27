package com.buildmart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String action;
    private String entity;
    private Long entityId;
    private String ipAddress;
    private String userAgent;

    @Column(length = 2000)
    private String details;

    @CreationTimestamp
    private LocalDateTime timestamp;
}
