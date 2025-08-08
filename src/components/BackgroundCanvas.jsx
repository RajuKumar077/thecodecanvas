import React, { useEffect, useRef, useCallback } from 'react';

// The new Particle class with water-like physics
class Particle {
  constructor(ctx, x, y, color) {
    this.ctx = ctx;
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 0.5; // Smaller, more subtle particles
    this.color = color;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.95; // Slower deceleration for fluid motion
    this.spring = 0.05; // Spring-like effect to return to base
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  update(mouse) {
    // Distance from mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 100; // Radius of mouse influence

    if (distance < repulsionRadius) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      this.velocity.x += -dx * force * 0.1;
      this.velocity.y += -dy * force * 0.1;
    }

    // Spring effect to pull back to base position
    const returnForceX = (this.baseX - this.x) * this.spring;
    const returnForceY = (this.baseY - this.y) * this.spring;
    this.velocity.x += returnForceX;
    this.velocity.y += returnForceY;

    // Apply friction and update position
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.draw();
  }
}

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesArray = useRef([]);
  const mouse = useRef({ x: null, y: null });

  // Premium palette with vibrant, watery colors
  const colors = [
    'rgba(0, 191, 255, 0.7)', // Deep Sky Blue
    'rgba(173, 216, 230, 0.7)', // Light Blue
    'rgba(135, 206, 235, 0.7)', // Sky Blue
    'rgba(70, 130, 180, 0.7)', // Steel Blue
  ];

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
  }, []);

  const initParticles = useCallback(() => {
    particlesArray.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Density of particles
    const numberOfParticles = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particlesArray.current.push(new Particle(canvas.getContext('2d'), x, y, color));
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Softly fade previous frames for a trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00c6ff'; // A bright, watery glow

    for (let i = 0; i < particlesArray.current.length; i++) {
      particlesArray.current[i].update(mouse.current);
    }

    connectParticles(ctx);

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const connectParticles = useCallback((ctx) => {
    const maxLineDistance = 80;
    const particles = particlesArray.current;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const particleA = particles[a];
        const particleB = particles[b];

        const dx = particleA.x - particleB.x;
        const dy = particleA.y - particleB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxLineDistance) {
          const opacity = 1 - (distance / maxLineDistance);
          ctx.strokeStyle = `rgba(0, 191, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particleA.x, particleA.y);
          ctx.lineTo(particleB.x, particleB.y);
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initParticles();

    const handleMouseMove = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animate, initParticles, resizeCanvas]);

  return <canvas ref={canvasRef} className="background-canvas"></canvas>;
};

export default BackgroundCanvas;