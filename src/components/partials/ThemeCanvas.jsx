import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

// Draw a plus sign at (x, y) with given size and color
function drawPlus(ctx, x, y, size, color, alpha = 0.5, angle = 0) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(-size / 2, 0);
  ctx.lineTo(size / 2, 0);
  ctx.moveTo(0, -size / 2);
  ctx.lineTo(0, size / 2);
  ctx.stroke();
  ctx.restore();
}

// Draw single peach blossom petal (cánh hoa đào)
function drawPeachBlossom(ctx, x, y, size = 18, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Single petal shape
  ctx.beginPath();
  ctx.moveTo(0, 0);
  
  // Left curve of petal
  ctx.bezierCurveTo(
    -size * 0.3, -size * 0.4,
    -size * 0.5, -size * 0.8,
    0, -size * 1.0
  );
  
  // Right curve of petal
  ctx.bezierCurveTo(
    size * 0.5, -size * 0.8,
    size * 0.3, -size * 0.4,
    0, 0
  );
  
  ctx.closePath();
  
  // Gradient fill for petal
  const gradient = ctx.createRadialGradient(0, -size * 0.3, 0, 0, -size * 0.5, size * 0.8);
  gradient.addColorStop(0, "#ffe4e8");
  gradient.addColorStop(0.5, "#ffb6c1");
  gradient.addColorStop(1, "#ff92a8");
  ctx.fillStyle = gradient;
  
  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
  ctx.shadowBlur = 4;
  ctx.fill();
  
  // Petal vein (gân cánh hoa)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -size * 0.85);
  ctx.strokeStyle = "rgba(255, 182, 193, 0.6)";
  ctx.lineWidth = size * 0.04;
  ctx.shadowBlur = 0;
  ctx.stroke();

  ctx.restore();
}

// Draw mai flower (hoa mai)
function drawMaiFlower(ctx, x, y, size = 16, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 5 petals (yellow)
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * 2 * Math.PI) / 5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 0.15, -size * 0.25,
      size * 0.75, -size * 0.25,
      size * 0.75, 0
    );
    ctx.bezierCurveTo(
      size * 0.75, size * 0.25,
      size * 0.15, size * 0.25,
      0, 0
    );
    ctx.closePath();
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 3;
    ctx.fill();
    ctx.restore();
  }

  // Center
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = "#FFA500";
  ctx.shadowBlur = 0;
  ctx.fill();

  // Long stamens
  for (let i = 0; i < 12; i++) {
    const a = (i * 2 * Math.PI) / 12;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.35, 0);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.35, 0, size * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = "#FF8C00";
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// Draw moon for christmas theme
function drawMoon(ctx, x, y, radius) {
  // Main moon circle
  ctx.save();
  ctx.fillStyle = "#F0E68C";
  ctx.shadowColor = "#FFF";
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Moon craters
  ctx.fillStyle = "#E8D878";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.2, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x + radius * 0.2, y + radius * 0.1, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x + radius * 0.1, y - radius * 0.4, radius * 0.1, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// Draw snowy mountains for christmas theme
function drawSnowyMountains(ctx, width, height) {
  // Mountain layers (back to front for depth)
  const mountainLayers = [
    { color: "#E6F3FF", heights: [0.4, 0.5, 0.3, 0.6, 0.4, 0.5], opacity: 0.6 },
    { color: "#CCE7FF", heights: [0.5, 0.3, 0.6, 0.4, 0.7, 0.3], opacity: 0.7 },
    { color: "#B3DBFF", heights: [0.3, 0.7, 0.4, 0.8, 0.3, 0.6], opacity: 0.8 },
    { color: "#99CFFF", heights: [0.6, 0.4, 0.8, 0.5, 0.6, 0.4], opacity: 0.9 }
  ];

  mountainLayers.forEach((layer) => {
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.fillStyle = layer.color;
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Create mountain peaks
    const peakCount = layer.heights.length;
    for (let i = 0; i <= peakCount; i++) {
      const x = (width / peakCount) * i;
      const peakHeight = height * (0.08 + layer.heights[i % peakCount] * 0.25); // 8-33% of height (reduced from 15-55%)
      const y = height - peakHeight;
      
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        // Create smooth curves between peaks
        const prevX = (width / peakCount) * (i - 1);
        const prevHeight = height * (0.08 + layer.heights[(i - 1) % peakCount] * 0.25);
        const prevY = height - prevHeight;
        
        const controlX = (prevX + x) / 2;
        const controlY = Math.min(prevY, y) - 20;
        
        ctx.quadraticCurveTo(controlX, controlY, x, y);
      }
    }
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    
    // Add snow caps on mountain peaks
    ctx.fillStyle = "#FFFFFF";
    ctx.globalAlpha = layer.opacity * 0.8;
    
    for (let i = 0; i < peakCount; i++) {
      const x = (width / peakCount) * i + (width / peakCount) / 2;
      const peakHeight = height * (0.08 + layer.heights[i] * 0.25);
      const y = height - peakHeight;
      
      // Snow cap
      ctx.beginPath();
      ctx.moveTo(x - 15, y + 10);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 15, y + 10);
      ctx.quadraticCurveTo(x + 10, y + 15, x - 10, y + 15);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  });

  // Add some pine trees on mountains
  ctx.fillStyle = "#0F4C0F";
  const trees = [
    // Pre-defined tree positions to avoid random flickering
    {x: width * 0.05, y: height - (height * 0.15), height: 25},
    {x: width * 0.12, y: height - (height * 0.12), height: 30},
    {x: width * 0.23, y: height - (height * 0.14), height: 20},
    {x: width * 0.35, y: height - (height * 0.18), height: 35},
    {x: width * 0.45, y: height - (height * 0.11), height: 25},
    {x: width * 0.58, y: height - (height * 0.16), height: 28},
    {x: width * 0.67, y: height - (height * 0.13), height: 22},
    {x: width * 0.75, y: height - (height * 0.19), height: 33},
    {x: width * 0.82, y: height - (height * 0.14), height: 26},
    {x: width * 0.88, y: height - (height * 0.12), height: 29},
    {x: width * 0.93, y: height - (height * 0.16), height: 24},
    {x: width * 0.97, y: height - (height * 0.13), height: 27}
  ];

  trees.forEach(tree => {
    // Tree trunk
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(tree.x - 2, tree.y, 4, tree.height * 0.3);
    
    // Tree layers (3 layers)
    ctx.fillStyle = "#0F4C0F";
    for (let layer = 0; layer < 3; layer++) {
      const layerY = tree.y - (layer * tree.height * 0.25);
      const layerWidth = (tree.height * 0.8) - (layer * 5);
      
      ctx.beginPath();
      ctx.moveTo(tree.x, layerY - tree.height * 0.3);
      ctx.lineTo(tree.x - layerWidth / 2, layerY);
      ctx.lineTo(tree.x + layerWidth / 2, layerY);
      ctx.closePath();
      ctx.fill();
    }
    
    // Snow on tree
    ctx.fillStyle = "#FFFFFF";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(tree.x - tree.height * 0.4, tree.y - tree.height * 0.1, tree.height * 0.8, 3);
    ctx.globalAlpha = 1;
  });
}

// Calculate point on quadratic Bezier curve
function getCurvePoint(t, start, control, end) {
  const x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x;
  const y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y;
  return { x, y };
}

// Calculate tangent angle for rotation
function getCurveTangent(t, start, control, end) {
  const dx = 2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x);
  const dy = 2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y);
  return Math.atan2(dy, dx);
}


// Draw Santa and Reindeer flying
function drawSantaAndReindeer(ctx, x, y, rotation = 0, scale = 1, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha; // Apply fade effect
  ctx.translate(x, y);
  ctx.rotate(rotation); // Rotate based on flight direction
  ctx.scale(-scale, scale); // Flip horizontally to correct direction

  // Reindeer (front) - more detailed
  // Reindeer body (oval, more realistic)
  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  ctx.ellipse(-65, 0, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Reindeer neck
  ctx.beginPath();
  ctx.ellipse(-78, -8, 6, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Reindeer head (more realistic shape)
  ctx.fillStyle = "#A0522D";
  ctx.beginPath();
  ctx.ellipse(-85, -12, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Reindeer snout
  ctx.fillStyle = "#654321";
  ctx.beginPath();
  ctx.ellipse(-92, -10, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Reindeer eyes
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(-88, -15, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(-87, -16, 1, 0, Math.PI * 2);
  ctx.fill();

  // Reindeer antlers (more detailed)
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Main antler branches
  ctx.moveTo(-85, -20);
  ctx.lineTo(-88, -30);
  ctx.moveTo(-85, -20);
  ctx.lineTo(-82, -28);
  // Small branches
  ctx.moveTo(-86, -25);
  ctx.lineTo(-89, -27);
  ctx.moveTo(-84, -23);
  ctx.lineTo(-81, -25);
  ctx.stroke();

  // Reindeer legs (more dynamic flying position)
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-70, 12);
  ctx.lineTo(-75, 22);
  ctx.moveTo(-60, 12);
  ctx.lineTo(-58, 20);
  ctx.moveTo(-70, 8);
  ctx.lineTo(-72, 18);
  ctx.moveTo(-60, 8);
  ctx.lineTo(-55, 16);
  ctx.stroke();

  // Reindeer hooves
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(-75, 22, 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-58, 20, 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red nose (Rudolph) - glowing effect
  ctx.shadowColor = "#FF0000";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.arc(-95, -10, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Sleigh (more detailed and realistic)
  ctx.fillStyle = "#8B0000";
  ctx.beginPath();
  ctx.moveTo(-45, 12);
  ctx.lineTo(5, 12);
  ctx.lineTo(8, 8);
  ctx.lineTo(8, -5);
  ctx.lineTo(-48, -5);
  ctx.closePath();
  ctx.fill();

  // Sleigh decorative trim
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(-45, 8, 50, 2);
  ctx.fillRect(-45, -3, 50, 2);

  // Sleigh runners (more realistic curved design)
  ctx.strokeStyle = "#C0C0C0";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-50, 15);
  ctx.quadraticCurveTo(-25, 18, 10, 15);
  ctx.moveTo(-50, 17);
  ctx.quadraticCurveTo(-25, 20, 10, 17);
  ctx.stroke();

  // Santa - more realistic proportions
  // Santa body (coat)
  ctx.fillStyle = "#DC143C";
  ctx.beginPath();
  ctx.roundRect(-25, -18, 22, 30, 3);
  ctx.fill();

  // Santa arms
  ctx.beginPath();
  ctx.ellipse(-30, -8, 5, 12, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-1, -8, 5, 12, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Santa hands (holding reins)
  ctx.fillStyle = "#FDBCB4";
  ctx.beginPath();
  ctx.arc(-33, 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2, 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Santa head (more realistic)
  ctx.fillStyle = "#FDBCB4";
  ctx.beginPath();
  ctx.ellipse(-14, -25, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Santa facial features
  // Eyes
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(-17, -28, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-11, -28, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = "#FF69B4";
  ctx.beginPath();
  ctx.arc(-14, -24, 2, 0, Math.PI * 2);
  ctx.fill();

  // Mustache
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(-14, -22, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Santa hat (more detailed)
  ctx.fillStyle = "#DC143C";
  ctx.beginPath();
  ctx.moveTo(-23, -25);
  ctx.quadraticCurveTo(-14, -42, -5, -25);
  ctx.lineTo(-5, -22);
  ctx.lineTo(-23, -22);
  ctx.closePath();
  ctx.fill();

  // Hat pom-pom (fluffy)
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(-14, -42, 4, 0, Math.PI * 2);
  ctx.fill();
  // Small fluffy details
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const fx = -14 + Math.cos(angle) * 3;
    const fy = -42 + Math.sin(angle) * 3;
    ctx.beginPath();
    ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hat trim (fluffy white band)
  ctx.fillRect(-23, -24, 18, 3);

  // Santa beard (more realistic)
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(-14, -18, 7, 6, 0, 0, Math.PI);
  ctx.fill();
  // Beard texture
  for (let i = 0; i < 8; i++) {
    const bx = -20 + i * 2;
    const by = -15 + Math.sin(i) * 2;
    ctx.beginPath();
    ctx.arc(bx, by, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Santa belt
  ctx.fillStyle = "#000";
  ctx.fillRect(-25, -8, 22, 4);

  // Belt buckle (more detailed)
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.roundRect(-16, -7, 6, 3, 1);
  ctx.fill();
  ctx.strokeStyle = "#B8860B";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Santa boots
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(-20, 12, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-8, 12, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rope/reins connecting reindeer to sleigh (more detailed)
  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(-48, -2);
  ctx.quadraticCurveTo(-55, -5, -65, -3);
  ctx.stroke();
  ctx.setLineDash([]);

  // Magic sparkles around sleigh (more magical)
  ctx.fillStyle = "#FFD700";
  for (let i = 0; i < 8; i++) {
    const sx = Math.random() * 60 - 30;
    const sy = Math.random() * 40 - 20;
    const sparkleSize = Math.random() * 2 + 1;
    
    // Star-shaped sparkles
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(Math.random() * Math.PI);
    ctx.beginPath();
    ctx.moveTo(0, -sparkleSize);
    ctx.lineTo(sparkleSize * 0.3, 0);
    ctx.lineTo(sparkleSize, 0);
    ctx.lineTo(sparkleSize * 0.3, sparkleSize * 0.3);
    ctx.lineTo(0, sparkleSize);
    ctx.lineTo(-sparkleSize * 0.3, sparkleSize * 0.3);
    ctx.lineTo(-sparkleSize, 0);
    ctx.lineTo(-sparkleSize * 0.3, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Wind trail effect
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(10 + i * 8, -5 + Math.sin(i) * 3);
    ctx.quadraticCurveTo(15 + i * 8, -8, 20 + i * 8, -5 + Math.sin(i) * 3);
    ctx.stroke();
  }

  ctx.restore();
}

const ThemeCanvas = ({ height }) => {
  const canvasRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(null);

  // Fetch active theme from Firestore
  useEffect(() => {
    const fetchActiveTheme = async () => {
      try {
        const q = query(collection(db, "themes"), where("isShow", "==", true));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const themeData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          };
          setActiveTheme(themeData);
        } else {
          // No theme is active, use default
          setActiveTheme({ themeSlug: "default" });
        }
      } catch (error) {
        console.error("Error fetching active theme:", error);
        setActiveTheme({ themeSlug: "default" });
      }
    };
    fetchActiveTheme();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeTheme) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation based on theme slug
    if (activeTheme.themeSlug === "new-year") {
      // Peach blossom and Mai flower falling animation
      const flowers = [];
      const NUM_FLOWERS = 40;

      // Create flowers (mix of peach blossom and mai flower)
      for (let i = 0; i < NUM_FLOWERS; i++) {
        flowers.push({
          x: Math.random() * width,
          y: Math.random() * height - height, // Start above screen
          type: Math.random() > 0.5 ? "peach" : "mai", // Random flower type
          size: Math.random() * 8 + 12, // 12-20px
          speed: Math.random() * 0.5 + 0.3, // 0.3-0.8 fall speed
          drift: Math.random() * 0.8 - 0.4, // -0.4 to 0.4 horizontal drift
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02, // Rotation speed
          opacity: Math.random() * 0.4 + 0.6, // 0.6-1.0 opacity
          swingAmplitude: Math.random() * 30 + 20, // 20-50px swing
          swingSpeed: Math.random() * 0.02 + 0.01, // Swing frequency
          swingPhase: Math.random() * Math.PI * 2, // Random starting phase
        });
      }

      // Couplet animation state
      let coupletScrollOffset = -450; // Start off-screen (left for slide-in effect)
      const finalPosition = 80; // Final position from top
      const slideSpeed = 3; // Speed of slide-in animation
      let hasSlideIn = false;

      function animate() {
        ctx.clearRect(0, 0, width, height);

        // Slide-in animation for couplets
        if (!hasSlideIn) {
          coupletScrollOffset += slideSpeed;
          if (coupletScrollOffset >= finalPosition) {
            coupletScrollOffset = finalPosition;
            hasSlideIn = true;
          }
        }

        // Update and draw flowers
        flowers.forEach((flower) => {
          // Move flower down
          flower.y += flower.speed;
          
          // Swing motion (sine wave)
          flower.swingPhase += flower.swingSpeed;
          const swingOffset = Math.sin(flower.swingPhase) * flower.swingAmplitude;
          const currentX = flower.x + swingOffset;

          // Rotate flower
          flower.rotation += flower.rotationSpeed;

          // Reset flower when it falls off screen
          if (flower.y > height + 50) {
            flower.y = -50;
            flower.x = Math.random() * width;
            flower.swingPhase = Math.random() * Math.PI * 2;
          }

          // Draw flower
          ctx.save();
          ctx.globalAlpha = flower.opacity;
          
          if (flower.type === "peach") {
            drawPeachBlossom(ctx, currentX, flower.y, flower.size, flower.rotation);
          } else {
            drawMaiFlower(ctx, currentX, flower.y, flower.size, flower.rotation);
          }
          
          ctx.restore();
        });

        animationFrameId = requestAnimationFrame(animate);
      }
      animate();
    } else if (activeTheme.themeSlug === "christmas") {
      // Christmas snowfall and Santa flying to moon animation
      const snowflakes = [];
      const NUM_SNOWFLAKES = 80;
      let santaT = 0;
      const santaSpeed = 0.002;

      // Create snowflakes
      for (let i = 0; i < NUM_SNOWFLAKES; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          drift: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.6 + 0.4,
        });
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw snowy mountains background
        drawSnowyMountains(ctx, width, height);

        // Draw moon in top right corner
        const moonRadius = 120;
        const moonX = width - moonRadius - 50;
        const moonY = moonRadius + 50;
        drawMoon(ctx, moonX, moonY, moonRadius);

        // Santa flying path (quadratic curve with multiple waypoints for natural movement)
        const start = { x: -100, y: height - 150 };
        const control = { x: width / 2, y: height / 4 };
        const end = { x: moonX - 30, y: moonY + 20 };
        
        // Get current position and next position for rotation calculation
        const santaPos = getCurvePoint(santaT, start, control, end);
        const rotation = getCurveTangent(santaT, start, control, end);

        // Add vertical bobbing motion (up and down oscillation)
        const bobbingOffset = Math.sin(santaT * Math.PI * 8) * 8;
        santaPos.y += bobbingOffset;

        // Add horizontal swaying motion
        const swayOffset = Math.sin(santaT * Math.PI * 6) * 5;
        santaPos.x += swayOffset;

        // Dynamic scale with slight pulsing and shrinking near moon
        const baseScale = 0.7 + Math.sin(santaT * Math.PI * 10) * 0.05;
        const shrinkEffect = santaT > 0.8 ? (1 - santaT) * 5 : 1; // Start shrinking at 80% of journey
        const santaScale = baseScale * shrinkEffect;

        // Fade out effect near the moon
        const fadeAlpha = santaT > 0.85 ? (1 - santaT) * 6.67 : 1; // Start fading at 85%

        // Draw Santa and Reindeer with rotation, scaling and fading
        drawSantaAndReindeer(ctx, santaPos.x, santaPos.y, rotation, santaScale, fadeAlpha);

        // Update Santa position with variable speed (faster at beginning, slower near moon)
        const speedMultiplier = 1 - (santaT * 0.5); // Slow down as approaching moon
        santaT += santaSpeed * speedMultiplier;
        
        if (santaT > 1) {
          santaT = 0; // Reset animation
        }

        // Update and draw snowflakes
        snowflakes.forEach((flake) => {
          flake.y += flake.speed;
          flake.x += flake.drift;

          if (flake.y > height) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }

          if (flake.x > width) flake.x = 0;
          if (flake.x < 0) flake.x = width;

          ctx.save();
          ctx.globalAlpha = flake.opacity;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw curve path (optional, for debugging)
        // ctx.strokeStyle = "rgba(255,255,255,0.2)";
        // ctx.lineWidth = 2;
        // ctx.beginPath();
        // ctx.moveTo(start.x, start.y);
        // ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
        // ctx.stroke();

        animationFrameId = requestAnimationFrame(animate);
      }
      animate();
    } else {
      // Default: Plus signs animation
      const NUM_PLUS = 28;
      const pluses = Array.from({ length: NUM_PLUS }).map(() => {
        // 32 is max size, 18 is min size for plus signs
        const size = Math.random() * 15 + 10;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          color: Math.random() > 0.5 ? "#33A1E0" : "#154D71",
          alpha: Math.random() * 0.4 + 0.3,
          angle: Math.random() * Math.PI,
          speedX: (Math.random() - 0.5) * 0.7,
          speedY: (Math.random() - 0.5) * 0.7,
          spin: (Math.random() - 0.5) * 0.01,
        };
      });

      function animate() {
        ctx.clearRect(0, 0, width, height);
        for (const p of pluses) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.angle += p.spin;
          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
          if (p.y < -p.size) p.y = height + p.size;
          if (p.y > height + p.size) p.y = -p.size;
          drawPlus(ctx, p.x, p.y, p.size, p.color, p.alpha, p.angle);
        }
        animationFrameId = requestAnimationFrame(animate);
      }
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [activeTheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: height || "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

ThemeCanvas.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ThemeCanvas;
