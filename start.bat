@echo off
title LearnZ Local Server
echo ==============================================
echo    Starting LearnZ Local Server...
echo ==============================================
echo.
echo Opening http://localhost:3000 in your browser when ready.
echo Press Ctrl+C to stop the server anytime.
echo.
node "%~dp0server.js" dev
pause
