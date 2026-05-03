# Playwright Interactive Learning Lab - Startup Script

Write-Host ""
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "   🎭 Playwright Interactive Learning Lab    " -ForegroundColor Cyan -BackgroundColor DarkBlue
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host ""

Write-Host "🚀 Starting local server on port 8080..." -ForegroundColor Gray
Write-Host "📝 Note: Avoid running 'node build.js' as it will overwrite the lab UI." -ForegroundColor Red

# Check if npx is available
if (!(Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: 'npx' not found. Please install Node.js first." -ForegroundColor Red
    pause
    exit
}

# Open the browser in a separate thread so it doesn't wait for the server to finish
Start-Sleep -Seconds 2
Write-Host "🔗 Opening Lab at http://localhost:8080/App/" -ForegroundColor Yellow
Start-Process "http://localhost:8080/App/"

# Run the server
npx serve . -l 8080
