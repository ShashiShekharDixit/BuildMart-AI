#!/bin/bash
# BuildMart Backend - DELETE OLD BROKEN FILES
# Run: chmod +x CLEANUP.sh && ./CLEANUP.sh

BASE="src/main/java/com/buildmart"
echo "Deleting old broken multi-class files..."

for f in \
    "$BASE/repository/Repositories.java" \
    "$BASE/util/SecurityUtils.java" \
    "$BASE/controller/VendorAdminController.java" \
    "$BASE/entity/Entities.java" \
    "$BASE/service/Services.java"
do
    if [ -f "$f" ]; then
        rm "$f"
        echo "DELETED: $f"
    else
        echo "OK (not found): $f"
    fi
done

echo ""
echo "Cleanup done! Now run: mvn clean compile"
