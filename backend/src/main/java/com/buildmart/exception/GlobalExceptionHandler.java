package com.buildmart.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ── 400 Validation ────────────────────────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String field   = ((FieldError) err).getField();
            String message = err.getDefaultMessage();
            fieldErrors.put(field, message);
        });
        return ResponseEntity.badRequest().body(body(
            400, "Validation Failed", "Please check the input fields", fieldErrors));
    }

    // ── 401 Bad Credentials ───────────────────────────────────────────────────
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCreds(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Authentication Failed", "Invalid email or password");
    }

    // ── 403 Access Denied ─────────────────────────────────────────────────────
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "Access Denied",
            "You don't have permission to perform this action");
    }

    // ── 413 File Too Large ────────────────────────────────────────────────────
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleFileSize(MaxUploadSizeExceededException ex) {
        return build(HttpStatus.PAYLOAD_TOO_LARGE, "File Too Large",
            "Maximum file size is 10MB per file");
    }

    // ── Business exceptions ───────────────────────────────────────────────────
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusiness(BusinessException ex) {
        return build(ex.getStatus(), ex.getError(), ex.getMessage());
    }

    // ── 500 Catch-all ─────────────────────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAll(Exception ex, WebRequest req) {
        log.error("Unhandled exception at {}: {}", req.getDescription(false), ex.getMessage(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
            "Something went wrong. Please try again later.");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> build(
            HttpStatus status, String error, String message) {
        return ResponseEntity.status(status).body(body(status.value(), error, message, null));
    }

    private Map<String, Object> body(int status, String error, String message,
                                     Map<String, String> fieldErrors) {
        Map<String, Object> map = new HashMap<>();
        map.put("status",    status);
        map.put("error",     error);
        map.put("message",   message);
        map.put("timestamp", LocalDateTime.now().toString());
        if (fieldErrors != null && !fieldErrors.isEmpty()) {
            map.put("fieldErrors", fieldErrors);
        }
        return map;
    }
}
