"use client";
import { useEffect, useRef } from 'react';

interface FloatingCirclesProps {
  className?: string;
}

export const FloatingCircles: React.FC<FloatingCirclesProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating circles
    const circles = Array.from({ length: 8 }, (_, i) => {
      const circle = document.createElement('div');
      circle.className = `absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-sm`;
      
      // Random sizes
      const size = Math.random() * 100 + 50;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      
      // Random positions
      circle.style.left = `${Math.random() * 100}%`;
      circle.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration
      const duration = Math.random() * 20 + 10;
      circle.style.animation = `float ${duration}s ease-in-out infinite`;
      circle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(circle);
      return circle;
    });

    // Cleanup
    return () => {
      circles.forEach(circle => {
        if (circle.parentNode) {
          circle.parentNode.removeChild(circle);
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
};

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  className = "", 
  particleCount = 50 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections to nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = 0.1 * (1 - distance / 100);
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

interface AnimatedGradientProps {
  className?: string;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-900/20 via-purple-900/20 to-pink-900/20 animation-delay-1000 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/20 via-indigo-800/20 to-purple-800/20 animation-delay-2000 animate-pulse"></div>
    </div>
  );
};
