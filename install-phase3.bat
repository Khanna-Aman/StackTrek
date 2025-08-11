@echo off
echo Installing Phase 3: Gamification & User Experience dependencies...
echo.

REM Install Firebase and authentication dependencies
echo Installing Firebase and authentication libraries...
npm install firebase react-firebase-hooks

if %errorlevel% neq 0 (
    echo Error: Failed to install Firebase dependencies
    pause
    exit /b 1
)

REM Install utility libraries
echo Installing utility libraries...
npm install uuid date-fns recharts confetti-js

if %errorlevel% neq 0 (
    echo Error: Failed to install utility libraries
    pause
    exit /b 1
)

REM Install TypeScript definitions
echo Installing TypeScript definitions...
npm install --save-dev @types/uuid @types/confetti-js

if %errorlevel% neq 0 (
    echo Error: Failed to install TypeScript definitions
    pause
    exit /b 1
)

echo.
echo ✅ Phase 3 dependencies installed successfully!
echo.
echo Next steps:
echo 1. Set up Firebase project at https://console.firebase.google.com/
echo 2. Copy .env.example to .env and add your Firebase config
echo 3. Run: npm run dev
echo.
echo See PHASE3_SETUP.md for detailed setup instructions!
echo.
pause
