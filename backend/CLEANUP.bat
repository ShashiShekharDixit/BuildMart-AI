@echo off
REM ============================================================
REM BuildMart Backend - DELETE OLD BROKEN FILES
REM Run this ONCE before doing mvn compile
REM Double-click this file or run in Command Prompt
REM ============================================================

SET BASE=src\main\java\com\buildmart

echo Deleting old broken multi-class files...

IF EXIST "%BASE%\repository\Repositories.java" (
    DEL /F "%BASE%\repository\Repositories.java"
    echo DELETED: Repositories.java
) ELSE (
    echo OK: Repositories.java already removed
)

IF EXIST "%BASE%\util\SecurityUtils.java" (
    DEL /F "%BASE%\util\SecurityUtils.java"
    echo DELETED: SecurityUtils.java
) ELSE (
    echo OK: SecurityUtils.java already removed
)

IF EXIST "%BASE%\controller\VendorAdminController.java" (
    DEL /F "%BASE%\controller\VendorAdminController.java"
    echo DELETED: VendorAdminController.java
) ELSE (
    echo OK: VendorAdminController.java already removed
)

IF EXIST "%BASE%\entity\Entities.java" (
    DEL /F "%BASE%\entity\Entities.java"
    echo DELETED: Entities.java
) ELSE (
    echo OK: Entities.java already removed
)

IF EXIST "%BASE%\service\Services.java" (
    DEL /F "%BASE%\service\Services.java"
    echo DELETED: Services.java
) ELSE (
    echo OK: Services.java already removed
)

IF EXIST "%BASE%\security\SecurityConfig.java.bak" (
    DEL /F "%BASE%\security\SecurityConfig.java.bak"
)

echo.
echo ============================================================
echo  Cleanup complete! Now run: mvn clean compile
echo ============================================================
pause
