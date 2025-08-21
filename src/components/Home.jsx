import React, { useEffect, useRef, useCallback, forwardRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

// Particle background
class Particle {
  constructor(ctx, x, y, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
    };
    this.opacity = 1;
    this.color = {
      r: Math.random() * 150,
      g: Math.random() * 150 + 50,
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
    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) this.velocity.x *= -1;
    if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) this.velocity.y *= -1;

    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const angle = Math.atan2(dy, dx);
        this.velocity.x -= Math.cos(angle) * 0.3;
        this.velocity.y -= Math.sin(angle) * 0.3;
      }
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

const Home = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const animationId = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: null, y: null });
  const particleCount = 120;

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(new Particle(ctx, null, null, canvas));
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach((p) => p.update(mouse.current));
    animationId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    const handleMouseMove = (e) => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    const handleMouseLeave = () => { mouse.current.x = null; mouse.current.y = null; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    animationId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animate, initParticles]);



  return (
    <section id="home" className="home-section" ref={ref}>
      <canvas ref={canvasRef} className="home-canvas"></canvas>
      <div className="home-content">
        <div className="home-intro">
          <p className="tagline">I turn complex datasets into clear, actionable insights</p>
          <h1>Raju Kumar</h1>
          <p className="role">Data Analyst | BI Developer | ML Enthusiast</p>
          <a href="#projects" className="cta-button">🚀 View My Work</a>
        </div>
      </div>


    </section>
  );
});

export default Home;
