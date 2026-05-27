package com.buildmart.util;

import com.buildmart.exception.BusinessException;

public final class PasswordValidator {

    private PasswordValidator() {}

    public static void validate(String password) {
        if (password == null || password.length() < 8)
            throw new BusinessException("Password must be at least 8 characters");
        if (!password.matches(".*[A-Z].*"))
            throw new BusinessException("Password must contain at least one uppercase letter");
        if (!password.matches(".*[a-z].*"))
            throw new BusinessException("Password must contain at least one lowercase letter");
        if (!password.matches(".*[0-9].*"))
            throw new BusinessException("Password must contain at least one digit");
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;':\",./<>?].*"))
            throw new BusinessException("Password must contain at least one special character");
    }
}
