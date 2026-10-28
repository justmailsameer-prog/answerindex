$rootDir = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $rootDir "dist"

Write-Host "Syncing from $rootDir to $distDir..."

if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

$htmlFiles = @(
    'index.html', 'pro.html', 'about.html', 'how-it-works.html',
    'pricing.html', 'audit.html', 'dashboard.html', 'privacy.html',
    'terms.html', 'feedback.html', 'index-oss.html', 'v1.html'
)

foreach ($h in $htmlFiles) {
    $src = Join-Path $rootDir $h
    $dst = Join-Path $distDir $h
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "  [OK] Copied $h -> dist/$h"
    }
}

$manifestFiles = @(
    'robots.txt', 'sitemap.xml', 'ai-sitemap.xml', 'sitemap.md',
    'llms.txt', 'llms-full.txt', 'ai.txt', 'ai-disclosure.txt',
    'training-data-policy.txt', 'ai-schema.json', 'ai-entities.json',
    'ai-intent.json', 'rag-index.json', 'rag-index.jsonl'
)

foreach ($m in $manifestFiles) {
    $src = Join-Path $rootDir $m
    $dst = Join-Path $distDir $m
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "  [OK] Copied $m -> dist/$m"
    }
}

$subdirs = @('pro', 'assets', 'functions', '.well-known', 'v1', 'v2', 'v3', 'v4', 'v5')

foreach ($sd in $subdirs) {
    $src = Join-Path $rootDir $sd
    $dst = Join-Path $distDir $sd
    if (Test-Path $src) {
        if (-not (Test-Path $dst)) {
            New-Item -ItemType Directory -Path $dst | Out-Null
        }
        Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force
        Write-Host "  [OK] Synced contents $sd -> dist/$sd"
    }
}

Write-Host "`nSync completed successfully!"
