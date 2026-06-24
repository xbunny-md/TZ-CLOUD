import React, { useEffect, useRef } from 'react';

export default function BackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let time = 0;
    let animationFrameId: number;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Function to draw a glowing blob
      const drawBlob = (x: number, y: number, r: number, color: string) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const w = width;
      const h = height;

      // Neon Green blob
      const x1 = w * 0.5 + Math.sin(time) * w * 0.4;
      const y1 = h * 0.5 + Math.cos(time * 0.8) * h * 0.4;
      drawBlob(x1, y1, w * 0.6, 'rgba(57, 255, 20, 0.15)');

      // Aurora Purple blob
      const x2 = w * 0.5 + Math.cos(time * 1.2) * w * 0.4;
      const y2 = h * 0.5 + Math.sin(time * 0.9) * h * 0.4;
      drawBlob(x2, y2, w * 0.6, 'rgba(138, 43, 226, 0.15)');

      // Plasma Pink blob
      const x3 = w * 0.5 + Math.sin(time * 0.5 + Math.PI) * w * 0.4;
      const y3 = h * 0.5 + Math.cos(time * 1.5) * h * 0.4;
      drawBlob(x3, y3, w * 0.7, 'rgba(255, 0, 127, 0.15)');

      // Add a slow moving large background hue
      drawBlob(w * 0.5, h * 0.5, Math.max(w, h), 'rgba(11, 11, 15, 0.5)');

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-80" />;
}
