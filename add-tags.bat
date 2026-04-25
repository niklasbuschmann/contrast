@echo off
cd /d "D:\qwen\asim-raza665.github.io\_posts"

:: Article 2 - Scholarship
powershell -Command "(Get-Content '2026-01-02-a-life-changing-scholarship-the-support-that-made-my-dreams-possible.md') -replace 'summary: \"A story of unexpected support, generous mentors, and the scholarship that made my higher education possible.\"', 'summary: \"A story of unexpected support, generous mentors, and the scholarship that made my higher education possible.`ntags:`n  - Scholarship`n  - Financial Aid`n  - Support' | Set-Content '2026-01-02-a-life-changing-scholarship-the-support-that-made-my-dreams-possible.md'"

echo Done
