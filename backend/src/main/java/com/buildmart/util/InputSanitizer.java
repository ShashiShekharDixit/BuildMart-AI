package com.buildmart.util;

public final class InputSanitizer {

    private static final String[] XSS_PATTERNS = {
        "<script>", "</script>", "javascript:", "onload=",
        "onerror=", "<iframe>", "</iframe>", "eval(",
        "document.cookie", "alert("
    };

    private InputSanitizer() {}

    public static String sanitize(String input) {
        if (input == null) return null;
        String out = input;
        for (String pattern : XSS_PATTERNS) {
            out = out.replaceAll("(?i)" + java.util.regex.Pattern.quote(pattern), "");
        }
        return out.trim();
    }

    public static boolean containsSqlInjection(String input) {
        if (input == null) return false;
        String lower = input.toLowerCase();
        return lower.contains("' or '")   || lower.contains("1=1")
            || lower.contains("drop table") || lower.contains("union select")
            || lower.contains("insert into") || lower.contains("delete from");
    }
}
