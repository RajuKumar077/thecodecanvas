import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import './Home.css';

// Particle class with a hover effect
class Particle {
  constructor(ctx, x, y, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x || Math.random() * this.canvas.width;
    this.y = y || Math.random() * this.canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
    };
    this.opacity = 1; // Added opacity property
    this.color = {
      r: Math.random() * 150,
      g: Math.random() * 20000 + 100,
      b: 255,
    };
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    this.ctx.fill();
  }

update(mouse) {
  // Check for canvas boundaries and reverse velocity
  if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
    this.velocity.x = -this.velocity.x;
  }
  if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
    this.velocity.y = -this.velocity.y;
  }

  // Cursor movement effect
  if (mouse.x !== null && mouse.y !== null) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influenceRadius = 120; // How far the cursor influences

    if (distance < influenceRadius) {
      // Push particles away from cursor
      const force = (influenceRadius - distance) / influenceRadius;
      const angle = Math.atan2(dy, dx);
      this.velocity.x -= Math.cos(angle) * force * 0.3;
      this.velocity.y -= Math.sin(angle) * force * 0.3;
    }
  }

  // Slow down particles slightly to avoid endless acceleration
  this.velocity.x *= 0.98;
  this.velocity.y *= 0.98;

  this.x += this.velocity.x;
  this.y += this.velocity.y;
  this.draw();
}

}

// Home component with the lightweight background animation
const Home = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesArray = useRef([]);
  const mouse = useRef({ x: null, y: null });
  const particleCount = 100;

  const initParticles = useCallback(() => {
    particlesArray.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < particleCount; i++) {
      particlesArray.current.push(new Particle(canvas.getContext('2d'), null, null, canvas));
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Clear the entire canvas on each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each particle
    for (let i = particlesArray.current.length - 1; i >= 0; i--) {
      const particle = particlesArray.current[i];
      particle.update(mouse.current);
      // Remove particle from array once it's invisible
      if (particle.opacity <= 0) {
        particlesArray.current.splice(i, 1);
      }
    }

    // If particles are below a certain number, add more
    if (particlesArray.current.length < particleCount) {
      const canvas = canvasRef.current;
      if (canvas) {
        particlesArray.current.push(new Particle(canvas.getContext('2d'), null, null, canvas));
      }
    }

    animationFrameId.current = requestAnimationFrame(animate);
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