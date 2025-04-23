import React, { useEffect, useRef } from "react";

const SnakeLoading: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<{
    x: number;
    y: number;
    dx: number;
    dy: number;
    segments: { x: number; y: number }[];
  }>({
    x: 0,
    y: 0,
    dx: 2,
    dy: 0,
    segments: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize snake
    const snake = snakeRef.current;
    snake.x = canvas.width / 2;
    snake.y = canvas.height / 2;
    snake.segments = Array(20)
      .fill(null)
      .map((_, i) => ({
        x: snake.x - i * 10,
        y: snake.y,
      }));

    let lastTime = 0;
    const speed = 2;
    const segmentDistance = 10;

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime < 16) {
        requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update snake position
      snake.x += snake.dx;
      snake.y += snake.dy;

      // Check boundaries and change direction
      if (snake.x < 0 || snake.x > canvas.width) {
        snake.dx = -snake.dx;
        snake.dy = (Math.random() - 0.5) * speed;
      }
      if (snake.y < 0 || snake.y > canvas.height) {
        snake.dy = -snake.dy;
        snake.dx = (Math.random() - 0.5) * speed;
      }

      // Update segments
      snake.segments.unshift({ x: snake.x, y: snake.y });
      if (snake.segments.length > 20) {
        snake.segments.pop();
      }

      // Draw snake
      ctx.beginPath();
      ctx.moveTo(snake.segments[0].x, snake.segments[0].y);
      for (let i = 1; i < snake.segments.length; i++) {
        ctx.lineTo(snake.segments[i].x, snake.segments[i].y);
      }
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Draw head
      ctx.beginPath();
      ctx.arc(snake.segments[0].x, snake.segments[0].y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#2563EB";
      ctx.fill();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default SnakeLoading;
