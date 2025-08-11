@echo off
echo Installing Phase 2 dependencies...
echo.

REM Install D3.js and visualization dependencies
echo Installing D3.js and visualization libraries...
npm install d3 d3-selection d3-transition d3-ease

if %errorlevel% neq 0 (
    echo Error: Failed to install D3.js dependencies
    pause
    exit /b 1
)

REM Install code editor dependencies
echo Installing code editor dependencies...
npm install prismjs react-syntax-highlighter

if %errorlevel% neq 0 (
    echo Error: Failed to install code editor dependencies
    pause
    exit /b 1
)

REM Install type definitions
echo Installing TypeScript definitions...
npm install --save-dev @types/d3 @types/prismjs @types/react-syntax-highlighter

if %errorlevel% neq 0 (
    echo Error: Failed to install TypeScript definitions
    pause
    exit /b 1
)

echo.
echo ✅ Phase 2 dependencies installed successfully!
echo.
echo You can now run:
echo   npm run dev
echo.
echo To start the development server and see the interactive data structures!
echo.
pause
