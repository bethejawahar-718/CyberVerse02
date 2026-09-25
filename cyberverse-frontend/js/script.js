document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("matrixCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initColumns();
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const fontSize = 14;
    let columns = [];

    function initColumns() {
        const colCount = Math.floor(canvas.width / fontSize);
        columns = [];
        
        for (let i = 0; i < colCount; i++) {
            columns.push({
                x: i * fontSize,
                y: Math.random() * -canvas.height, // staggered start positions
                speed: 1 + Math.random() * 2.5,   // variable speed per column
                length: 10 + Math.floor(Math.random() * 20),
                drift: (Math.random() - 0.5) * 0.3 // subtle horizontal drift
            });
        }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function drawMatrix() {
        // Dark translucent overlay to create smooth trailing motion
        ctx.fillStyle = "rgba(5, 8, 7, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        columns.forEach((col) => {
            // Pick a random symbol for the head
            const char = chars.charAt(Math.floor(Math.random() * chars.length));
            const currentX = col.x + Math.sin(col.y * 0.02) * col.drift * 10;

            // Draw glowing bright leader head
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#39ff8e";
            ctx.fillText(char, currentX, col.y);

            // Draw trailing body characters
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#39ff8e";
            const tailChar = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(tailChar, currentX, col.y - fontSize);

            // Update drop position
            col.y += col.speed * fontSize * 0.5;

            // Reset column once it moves off-screen with random variations
            if (col.y > canvas.height + col.length * fontSize && Math.random() > 0.975) {
                col.y = -col.length * fontSize;
                col.speed = 1 + Math.random() * 2.5;
            }
        });
    }

    setInterval(drawMatrix, 33);
});