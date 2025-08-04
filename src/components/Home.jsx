import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import './Home.css';

// Class to represent a single particle in the network
class Particle {
  constructor(ctx, x, y, radius, color) {
    this.ctx = ctx;
    this.baseX = x; // Original position
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.targetX = x;
    this.targetY = y;
    this.easeFactor = 0.08;
  }

  update(mouse) {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;

    if (mouse.x !== null && mouse.y !== null && distance < maxDistance) {
      let forceFactor = (maxDistance - distance) / maxDistance;
      this.targetX = this.baseX + (dx / distance) * -forceFactor * 30;
      this.targetY = this.baseY + (dy / distance) * -forceFactor * 30;
    } else {
      this.targetX = this.baseX;
      this.targetY = this.baseY;
    }

    this.x += (this.targetX - this.x) * this.easeFactor;
    this.y += (this.targetY - this.y) * this.easeFactor;

    const stopThreshold = 0.1;
    if (Math.abs(this.x - this.targetX) < stopThreshold) {
      this.x = this.targetX;
    }
    if (Math.abs(this.y - this.targetY) < stopThreshold) {
      this.y = this.targetY;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

// Home component with integrated background canvas
const Home = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesArray = useRef([]);
  const mouse = useRef({ x: null, y: null });

  const colors = [
    'rgba(74, 144, 226, 0.7)',
    'rgba(80, 200, 120, 0.7)',
    'rgba(150, 100, 200, 0.7)',
    'rgba(0, 191, 191, 0.7)',
    'rgba(255, 165, 0, 0.7)',
    'rgba(255, 99, 71, 0.7)',
    'rgba(255, 206, 86, 0.7)',
  ];

  const initParticles = useCallback(() => {
    particlesArray.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      let radius = Math.random() * 2 + 1;
      let x = Math.random() * (canvas.width - radius * 2) + radius;
      let y = Math.random() * (canvas.height - radius * 2) + radius;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particlesArray.current.push(new Particle(canvas.getContext('2d'), x, y, radius, color));
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.current.length; i++) {
      particlesArray.current[i].update(mouse.current);
      particlesArray.current[i].draw();
    }

    connectParticles(ctx);

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const connectParticles = useCallback((ctx) => {
    const maxLineDistance = 100;
    const mouseInfluenceLineDistance = 200;

    for (let a = 0; a < particlesArray.current.length; a++) {
      for (let b = a; b < particlesArray.current.length; b++) {
        const particleA = particlesArray.current[a];
        const particleB = particlesArray.current[b];

        let distance = Math.sqrt(
          (particleA.x - particleB.x) ** 2 +
          (particleA.y - particleB.y) ** 2
        );

        if (distance < maxLineDistance) {
          let mouseLineDistanceA = mouse.current.x !== null ? Math.sqrt((mouse.current.x - particleA.x)**2 + (mouse.current.y - particleA.y)**2) : Infinity;
          let mouseLineDistanceB = mouse.current.x !== null ? Math.sqrt((mouse.current.x - particleB.x)**2 + (mouse.current.y - particleB.y)**2) : Infinity;
          let minMouseDistance = Math.min(mouseLineDistanceA, mouseLineDistanceB);

          let lineOpacity = 0;
          if (minMouseDistance < mouseInfluenceLineDistance) {
            lineOpacity = 1 - (minMouseDistance / mouseInfluenceLineDistance);
            lineOpacity = Math.max(0.1, lineOpacity);
          } else {
            lineOpacity = 0.05;
          }

          const colorMatch = particleA.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
          if (colorMatch) {
            ctx.strokeStyle = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, ${lineOpacity})`;
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
          }

          ctx.lineWidth = 1;
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
      {/* The canvas is absolutely positioned to be the background */}
      <canvas ref={canvasRef} className="home-canvas"></canvas>

      {/* The main content, positioned on top of the canvas */}
      <div className="home-content">
        <h1>RAJU KUMAR</h1>
        <p>The Analyst</p>
      </div>
    </section>
  );
});

export default Home;
