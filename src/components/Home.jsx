import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import './Home.css';

// The updated Particle class for a more premium effect
class Particle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 1.5 + 0.5; // Varied particle sizes for depth
    this.color = { r: 0, g: 160, b: 255 }; // Consistent Neon Blue
    this.opacity = 0; // Starts invisible
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.95; // More friction for a smoother feel
    this.spring = 0.03; // Slightly softer spring effect
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    this.ctx.fill();
  }

  update(mouse) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influenceRadius = 200; // Increased influence radius

    if (distance < influenceRadius) {
      const force = (influenceRadius - distance) / influenceRadius;
      this.velocity.x += -dx * force * 0.15;
      this.velocity.y += -dy * force * 0.15;
      this.opacity = Math.min(1, this.opacity + 0.05); // Smooth opacity increase
    } else {
      const returnForceX = (this.baseX - this.x) * this.spring;
      const returnForceY = (this.baseY - this.y) * this.spring;
      this.velocity.x += returnForceX;
      this.velocity.y += returnForceY;
      this.opacity = Math.max(0, this.opacity - 0.02); // Smooth opacity decrease
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    this.draw();
  }
}

// Home component with integrated background canvas
const Home = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesArray = useRef([]);
  const mouse = useRef({ x: null, y: null });

  const initParticles = useCallback(() => {
    particlesArray.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Optimized: Increased gap to reduce particle count for performance
    const gap = 40; 
    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        particlesArray.current.push(new Particle(canvas.getContext('2d'), x, y));
      }
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#000000ff';

    for (const particle of particlesArray.current) {
      particle.update(mouse.current);
    }

    connectParticles(ctx);

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const connectParticles = useCallback((ctx) => {
    const maxLineDistance = 100;
    const particles = particlesArray.current;
    
    // Optimized: Only loop a fixed number of particles to check for connections
    for (let a = 0; a < particles.length; a++) {
      if (particles[a].opacity <= 0.1) continue;

      for (let b = a + 1; b < Math.min(a + 50, particles.length); b++) {
        if (particles[b].opacity <= 0.1) continue;

        const particleA = particles[a];
        const particleB = particles[b];

        const distance = Math.sqrt(
          (particleA.x - particleB.x) ** 2 +
          (particleA.y - particleB.y) ** 2
        );

        if (distance < maxLineDistance) {
          const lineOpacity = (1 - (distance / maxLineDistance)) * Math.max(particleA.opacity, particleB.opacity);

          const gradient = ctx.createLinearGradient(particleA.x, particleA.y, particleB.x, particleB.y);
          gradient.addColorStop(0, `rgba(0, 160, 255, ${lineOpacity})`);
          gradient.addColorStop(1, `rgba(100, 200, 255, ${lineOpacity * 0.7})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particleA.x, particleA.y);
          ctx.lineTo(particleB.x, particleB.y);
          ctx.stroke();
        }
      }
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
  }, [initParticles]);

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

  return (
    <section id="home" className="home-section" ref={ref}>
      <canvas ref={canvasRef} className="home-canvas"></canvas>
      <div className="home-content">
        <h1>RAJU KUMAR</h1>
        <p>The Analyst</p>
      </div>
    </section>
  );
});

export default Home;