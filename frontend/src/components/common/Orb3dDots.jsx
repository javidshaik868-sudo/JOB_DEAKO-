import React, { useEffect, useRef } from 'react';

/** Renders an animated, interactive depth-wave particle field inside its parent. */
export const Orb3dDots = ({
  className = '',
  style = {},
  spacing = 16,
  hoverRadius = 210,
  active = false,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovering: false,
    };

    let width = 0;
    let height = 0;
    let points = [];
    let time = 0;

    const buildGrid = (gridWidth, gridHeight) => {
      const gridPoints = [];
      const cols = Math.ceil(gridWidth / spacing) + 2;
      const rows = Math.ceil(gridHeight / spacing) + 2;
      const offsetX = (gridWidth - (cols - 1) * spacing) / 2;
      const offsetY = (gridHeight - (rows - 1) * spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < cols; column++) {
          const gridX = offsetX + column * spacing;
          const gridY = offsetY + row * spacing;

          gridPoints.push({
            gx: gridX,
            gy: gridY,
            x: gridX,
            y: gridY,
            glow: 0,
            baseSize: 0.75 + (Math.sin(column * 0.4) * Math.cos(row * 0.4)) * 0.15,
          });
        }
      }
      return gridPoints;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      points = buildGrid(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      if (
        clientX >= -80 &&
        clientX <= width + 80 &&
        clientY >= -80 &&
        clientY <= height + 80
      ) {
        mouse.targetX = clientX;
        mouse.targetY = clientY;
        mouse.isHovering = true;
      } else {
        mouse.isHovering = false;
        mouse.targetX = -9999;
        mouse.targetY = -9999;
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      mouse.x += (mouse.targetX - mouse.x) * 0.2;
      mouse.y += (mouse.targetY - mouse.y) * 0.2;
      time += 0.016;

      const glowX = mouse.isHovering ? mouse.x : width / 2;
      const glowY = mouse.isHovering ? mouse.y : height / 2;
      const isGlowing = active || mouse.isHovering;

      for (let index = 0; index < points.length; index++) {
        const point = points[index];
        const waveZ = Math.sin(point.gx * 0.007 + time * 1.1) * Math.cos(point.gy * 0.006 + time * 0.9) * 28
          + Math.sin((point.gx + point.gy) * 0.004 + time * 1.3) * 16;
        const depthFactor = Math.max(0, Math.min(1, (waveZ + 44) / 88));
        const dx = point.gx - glowX;
        const dy = point.gy - glowY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetGlow = 0;
        let pushX = 0;
        let pushY = 0;

        if (isGlowing && distance < hoverRadius) {
          const proximity = 1 - distance / hoverRadius;
          targetGlow = Math.pow(proximity, 1.35);
          const angle = Math.atan2(dy, dx);
          const pushForce = Math.sin(proximity * Math.PI) * 9;
          pushX = Math.cos(angle) * pushForce;
          pushY = Math.sin(angle) * pushForce;
        }

        const lerpSpeed = targetGlow > point.glow ? 0.25 : 0.08;
        point.glow += (targetGlow - point.glow) * lerpSpeed;

        const glow = point.glow;
        const drawX = point.gx + pushX;
        const drawY = point.gy + pushY;
        const dotRadius = Math.max(
          0.55,
          (point.baseSize + depthFactor * 0.45) * (1 + glow * 1.3)
        );

        ctx.beginPath();
        ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);

        if (glow > 0.03) {
          const red = Math.round(22 + glow * (145 - 22));
          const green = Math.round(38 + glow * (242 - 38));
          const blue = Math.round(26 + glow * (20 - 26));
          const alpha = (0.30 + glow * 0.70).toFixed(3);

          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          ctx.fill();

          if (glow > 0.28) {
            ctx.beginPath();
            ctx.arc(drawX, drawY, dotRadius * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(111, 243, 9, ${(glow * 0.22).toFixed(3)})`;
            ctx.fill();
          }
        } else {
          const baseAlpha = (0.11 + depthFactor * 0.16).toFixed(3);
          ctx.fillStyle = `rgba(24, 42, 30, ${baseAlpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [spacing, hoverRadius, active]);

  return (
    <div
      className={`orb-3d-dots-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};