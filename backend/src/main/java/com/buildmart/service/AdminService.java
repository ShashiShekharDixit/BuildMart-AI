package com.buildmart.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    // private final UserRepository userRepo;
    // private final VendorRepository vendorRepo;
    // private final OrderRepository orderRepo;
    // private final AuditLogRepository auditRepo;

    public Map<String, Object> getPlatformStats() {
        return Map.of(
            "totalUsers",           4821L,
            "totalVendors",         312L,
            "totalOrders",          18456L,
            "totalRevenue",         BigDecimal.valueOf(28450000),
            "pendingVendorApprovals", 18L,
            "fraudAlerts",          3L,
            "activeOrders",         234L,
            "newUsersThisMonth",    421L,
            "ordersThisMonth",      1842L,
            "revenueThisMonth",     BigDecimal.valueOf(4850000)
        );
    }

    public void logAudit(Long userId, String action, String entity,
                         Long entityId, String ipAddress, String details) {
        // AuditLog log = AuditLog.builder()
        //     .userId(userId).action(action).entity(entity)
        //     .entityId(entityId).ipAddress(ipAddress).details(details).build();
        // auditRepo.save(log);
        log.info("AUDIT user={} action={} entity={} id={}", userId, action, entity, entityId);
    }
}
