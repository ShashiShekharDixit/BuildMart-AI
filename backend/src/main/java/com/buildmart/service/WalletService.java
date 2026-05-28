package com.buildmart.service;

import com.buildmart.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
@RequiredArgsConstructor
public class WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletService.class);


    // private final WalletRepository walletRepo;

    public Map<String, Object> getWallet(Long userId) {
        // Wallet wallet = walletRepo.findByUserId(userId)
        //     .orElseThrow(() -> BusinessException.notFound("Wallet"));
        return Map.of("balance", 500.0, "transactions", List.of());
    }

    @Transactional
    public void credit(Long userId, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BusinessException("Credit amount must be positive");
        // walletRepo.credit(userId, amount);
        log.info("Wallet credit: user={} amount={} desc={}", userId, amount, description);
    }

    @Transactional
    public void debit(Long userId, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BusinessException("Debit amount must be positive");
        // int updated = walletRepo.debit(userId, amount);
        // if (updated == 0) throw new BusinessException("Insufficient wallet balance");
        log.info("Wallet debit: user={} amount={} desc={}", userId, amount, description);
    }
}
