import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/useThemeStore';

const DynamicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const speed = 0.008;
    const isInteractive = true;
    const blendMode = theme === 'dark' ? 'screen' : 'multiply';

    // Different colors based on theme
    const blobs = theme === 'dark' ? [
      { color: '#14184d', x: 0, y: 0, vx: 1, vy: 1, s: 1, t: 0 },
      { color: '#000000', x: 0, y: 0, vx: -1, vy: 1, s: 1, t: 2 },
      { color: '#000000', x: 0, y: 0, vx: -1, vy: -1, s: 1, t: 4 },
      { color: '#0c1045ff', x: 0, y: 0, vx: 1, vy: -1, s: 1, t: 6 }
    ] : [
      { color: '#e0e7ff', x: 0, y: 0, vx: 1, vy: 1, s: 1, t: 0 },
      { color: '#f3e8ff', x: 0, y: 0, vx: -1, vy: 1, s: 1, t: 2 },
      { color: '#dbeafe', x: 0, y: 0, vx: -1, vy: -1, s: 1, t: 4 },
      { color: '#bfdbfe', x: 0, y: 0, vx: 1, vy: -1, s: 1, t: 6 }
    ];

    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let hasMouse = false;

    const resize = () => {
      canvas.width = 128;
      canvas.height = 128;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      hasMouse = true;
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width * canvas.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height * canvas.height;
    };

    const handleMouseLeave = () => {
      hasMouse = false;
    };

    if (isInteractive) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    let animationFrameId: number;

    const animate = () => {
      time += speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = blendMode;

      if (isInteractive) {
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;
      }

      blobs.forEach((b) => {
        const movementX = Math.sin(time + b.t) * 0.5 + Math.sin(time * 0.5 + b.t * 2) * 0.5;
        const movementY = Math.cos(time + b.t) * 0.5 + Math.cos(time * 0.6 + b.t * 2) * 0.5;

        let x = (canvas.width / 2) + movementX * (canvas.width * 0.3);
        let y = (canvas.height / 2) + movementY * (canvas.height * 0.3);

        if (isInteractive && hasMouse) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = canvas.width * 0.6;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            x += dx * force * 0.2;
            y += dy * force * 0.2;
          }
        }

        const radius = canvas.width * 0.5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (isInteractive) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div 
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden transition-colors duration-500 ease-in-out ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}
      style={{
        backgroundImage: theme === 'dark' 
          ? 'radial-gradient(circle at 0% 0%, #14184d, transparent 80%), radial-gradient(circle at 100% 0%, #000000, transparent 80%), radial-gradient(circle at 100% 100%, #000000, transparent 80%), radial-gradient(circle at 0% 100%, #1d2487, transparent 80%)'
          : 'radial-gradient(circle at 0% 0%, #e0e7ff, transparent 80%), radial-gradient(circle at 100% 0%, #f3f4f6, transparent 80%), radial-gradient(circle at 100% 100%, #f3f4f6, transparent 80%), radial-gradient(circle at 0% 100%, #bae6fd, transparent 80%)'
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-100 mix-blend-normal"
        style={{ filter: 'blur(100px)' }}
      />
    </div>
  );
};

export default DynamicBackground;
