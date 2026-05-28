package com.buildmart.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String     error;

    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
        this.error  = "Business Error";
    }

    public BusinessException(HttpStatus status, String error, String message) {
        super(message);
        this.status = status;
        this.error  = error;
    }

    public HttpStatus getStatus() { return status; }
    public String     getError()  { return error;  }

    public static BusinessException notFound(String entity) {
        return new BusinessException(HttpStatus.NOT_FOUND, "Not Found", entity + " not found");
    }

    public static BusinessException unauthorized(String message) {
        return new BusinessException(HttpStatus.UNAUTHORIZED, "Unauthorized", message);
    }

    public static BusinessException forbidden(String message) {
        return new BusinessException(HttpStatus.FORBIDDEN, "Forbidden", message);
    }

    public static BusinessException conflict(String message) {
        return new BusinessException(HttpStatus.CONFLICT, "Conflict", message);
    }
}
