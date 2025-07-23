import React, { useEffect, useRef, useCallback } from 'react';

// Class to represent a single particle in the network
class Particle {
  constructor(ctx, x, y, radius, color) {
    this.ctx = ctx;
    this.baseX = x; // Original position
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color; // Assigned color for this particle
    this.targetX = x;
    this.targetY = y;
    this.easeFactor = 0.08; // How smoothly it moves to target
  }

  // Update particle position based on mouse interaction and return to base
  update(mouse) {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let maxDistance = 150; // Mouse influence radius for particle repulsion

    if (mouse.x !== null && mouse.y !== null && distance < maxDistance) {
      // Repel from mouse
      let forceFactor = (maxDistance - distance) / maxDistance;
      this.targetX = this.baseX + (dx / distance) * -forceFactor * 30; // Repel strength
      this.targetY = this.baseY + (dy / distance) * -forceFactor * 30;
    } else {
      // Smoothly return to base position
      this.targetX = this.baseX;
      this.targetY = this.baseY;
    }

    // Smoothly interpolate towards target position
    this.x += (this.targetX - this.x) * this.easeFactor;
    this.y += (this.targetY - this.y) * this.easeFactor;

    // Add a small threshold to stop movement when very close to target
    const stopThreshold = 0.1;
    if (Math.abs(this.x - this.targetX) < stopThreshold) {
      this.x = this.targetX;
    }
    if (Math.abs(this.y - this.targetY) < stopThreshold) {
      this.y = this.targetY;
    }
  }

  // Draw the particle
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

// This component is now designed to be a global, fixed background
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesArray = useRef([]);
  const mouse = useRef({
    x: null,
    y: null,
  });

  // Define a palette of vibrant, data-analyst friendly colors
  const colors = [
    'rgba(74, 144, 226, 0.7)',  // Bright Blue
    'rgba(80, 200, 120, 0.7)',  // Fresh Green
    'rgba(150, 100, 200, 0.7)', // Soft Purple
    'rgba(0, 191, 191, 0.7)',   // Vibrant Cyan
    'rgba(255, 165, 0, 0.7)',   // Warm Orange
    'rgba(255, 99, 71, 0.7)',   // Tomato Red (for accent)
    'rgba(255, 206, 86, 0.7)',  // Gold Yellow
  ];

  // Handle canvas resizing and re-initialization of particles
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth; // Fill window width
      canvas.height = window.innerHeight; // Fill window height
      initParticles(); // Re-initialize particles to fit new dimensions
    }
  }, []);

  // Initialize particles randomly across the canvas
  const initParticles = useCallback(() => {
    particlesArray.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const numberOfParticles = (canvas.width * canvas.height) / 9000; // Adjust density
    for (let i = 0; i < numberOfParticles; i++) {
      let radius = Math.random() * 2 + 1; // Particle size
      let x = Math.random() * (canvas.width - radius * 2) + radius;
      let y = Math.random() * (canvas.height - radius * 2) + radius;
      const color = colors[Math.floor(Math.random() * colors.length)]; // Pick a random color
      particlesArray.current.push(new Particle(canvas.getContext('2d'), x, y, radius, color));
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Update and draw particles
    for (let i = 0; i < particlesArray.current.length; i++) {
      particlesArray.current[i].update(mouse.current);
      particlesArray.current[i].draw();
    }

    // Draw lines between close particles, influenced by hover
    connectParticles(ctx);

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  // Function to connect particles with lines
  const connectParticles = useCallback((ctx) => {
    const maxLineDistance = 100; // Max distance for lines to appear
    const mouseInfluenceLineDistance = 200; // Mouse influence for line intensity

    for (let a = 0; a < particlesArray.current.length; a++) {
      for (let b = a; b < particlesArray.current.length; b++) {
        const particleA = particlesArray.current[a];
        const particleB = particlesArray.current[b];

        let distance = Math.sqrt(
          (particleA.x - particleB.x) ** 2 +
          (particleA.y - particleB.y) ** 2
        );

        if (distance < maxLineDistance) {
          // Calculate line intensity based on mouse proximity to either particle
          let mouseLineDistanceA = mouse.current.x !== null ? Math.sqrt((mouse.current.x - particleA.x)**2 + (mouse.current.y - particleA.y)**2) : Infinity;
          let mouseLineDistanceB = mouse.current.x !== null ? Math.sqrt((mouse.current.x - particleB.x)**2 + (mouse.current.y - particleB.y)**2) : Infinity;
          let minMouseDistance = Math.min(mouseLineDistanceA, mouseLineDistanceB);

          let lineOpacity = 0;
          if (minMouseDistance < mouseInfluenceLineDistance) {
            lineOpacity = 1 - (minMouseDistance / mouseInfluenceLineDistance);
            lineOpacity = Math.max(0.1, lineOpacity); // Ensure a minimum opacity for subtle presence
          } else {
            lineOpacity = 0.05; // Default very low opacity when no hover
          }

          // Use the color of the first particle for the line
          // Extract RGB values from rgba string
          const colorMatch = particleA.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
          if (colorMatch) {
            ctx.strokeStyle = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, ${lineOpacity})`;
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`; // Fallback to white
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

  // Effect for setting up canvas and animations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initParticles();

    // Mouse move event listener (attached to window for global effect)
    const handleMouseMove = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    // Mouse leave event listener (attached to window)
    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    // Resize event listener (attached to window)
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave); // Listen to window for mouse leave

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animate, initParticles, resizeCanvas]); // Dependencies for useEffect

  return (
    // This canvas will be styled by the global .background-canvas class
    <canvas ref={canvasRef} className="background-canvas"></canvas>
  );
};

export default BackgroundCanvas;
