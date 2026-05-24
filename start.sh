#!/bin/bash
# ============================================================
# BuildMart AI — Quick Start Script (Linux/Mac)
# Run: chmod +x start.sh && ./start.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🏗️  =============================================="
echo "    BuildMart AI — Starting Up"
echo "    =============================================="
echo ""

# ── Check prerequisites ──
check_cmd() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}✗ $1 not found. Please install it first.${NC}"
    echo "  See README.md for installation instructions."
    exit 1
  fi
  echo -e "${GREEN}✓ $1 found${NC}"
}

echo "Checking prerequisites..."
check_cmd node
check_cmd npm
echo ""

# ── Ask user which mode to start ──
echo "Choose startup mode:"
echo "  1) Frontend only (no Java/MySQL needed) — recommended for first run"
echo "  2) Full stack (requires Java 17 + MySQL + Redis)"
echo "  3) Docker (requires Docker Desktop)"
echo ""
read -p "Enter choice [1/2/3] (default: 1): " choice
choice=${choice:-1}

case $choice in
  1)
    echo ""
    echo -e "${YELLOW}Starting Frontend Only...${NC}"
    cd frontend
    if [ ! -d "node_modules" ]; then
      echo "Installing dependencies (first time — ~2 mins)..."
      npm install --silent
    fi
    echo ""
    echo -e "${GREEN}✓ Starting React dev server on http://localhost:3000${NC}"
    echo "  (API calls will fail gracefully — demo data will be shown)"
    echo ""
    npm start
    ;;

  2)
    echo ""
    check_cmd java
    check_cmd mvn

    # Start backend
    echo -e "${YELLOW}Starting Spring Boot backend...${NC}"
    cd backend
    if [ ! -f "target/buildmart-backend-1.0.0.jar" ]; then
      echo "Building backend (first time — ~3 mins)..."
      mvn clean package -DskipTests -q
    fi
    mvn spring-boot:run &
    BACKEND_PID=$!
    echo -e "${GREEN}✓ Backend starting (PID: $BACKEND_PID)${NC}"
    cd ..

    # Wait for backend
    echo "Waiting for backend to be ready..."
    for i in {1..30}; do
      if curl -s http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend ready!${NC}"
        break
      fi
      sleep 2
    done

    # Start frontend
    echo -e "${YELLOW}Starting React frontend...${NC}"
    cd frontend
    if [ ! -d "node_modules" ]; then
      npm install --silent
    fi
    npm start &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓ Frontend starting (PID: $FRONTEND_PID)${NC}"
    cd ..

    echo ""
    echo -e "${GREEN}======================================"
    echo "  BuildMart AI is running!"
    echo "======================================"
    echo -e "  Frontend:  http://localhost:3000"
    echo "  Backend:   http://localhost:8080/api"
    echo "  Swagger:   http://localhost:8080/api/swagger-ui.html${NC}"
    echo ""
    echo "Press Ctrl+C to stop all services"
    wait
    ;;

  3)
    check_cmd docker
    echo ""
    if [ ! -f ".env" ]; then
      cp .env.example .env
      echo -e "${YELLOW}⚠ Created .env from .env.example${NC}"
      echo "  Edit .env to add your OPENAI_API_KEY for AI features"
    fi
    echo -e "${YELLOW}Starting with Docker Compose...${NC}"
    docker compose up --build
    ;;

  *)
    echo -e "${RED}Invalid choice${NC}"
    exit 1
    ;;
esac
