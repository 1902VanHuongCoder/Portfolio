import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// --- CÁC HÀM VẼ CHI TIẾT ---

// 1. Vẽ bóng đổ (giúp đối tượng bám mặt đất)
function drawShadow(ctx, x, y, width, color = "rgba(0,0,0,0.15)") {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  // Vẽ hình elip dẹt
  ctx.ellipse(0, 0, width, width * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// 2. Vẽ Cây thông (Style gọn, hiện đại)
function drawTree(ctx, x, y, height) {
  ctx.save();
  ctx.translate(x, y);

  // Thân cây
  ctx.fillStyle = "#5D4037";
  ctx.fillRect(-height * 0.1, 0, height * 0.2, height * 0.15);

  // Tán lá (Vẽ liền khối bằng Path để mềm mại hơn)
  ctx.fillStyle = "#2E7D32";
  ctx.beginPath();
  ctx.moveTo(0, -height); // Đỉnh

  // Tán 1 (Trên cùng)
  ctx.lineTo(height * 0.25, -height * 0.65);
  ctx.lineTo(height * 0.1, -height * 0.65);

  // Tán 2 (Giữa)
  ctx.lineTo(height * 0.35, -height * 0.35);
  ctx.lineTo(height * 0.15, -height * 0.35);

  // Tán 3 (Dưới cùng)
  ctx.lineTo(height * 0.45, 0);
  ctx.lineTo(-height * 0.45, 0); // Về phía trái

  // Đối xứng lại bên trái
  ctx.lineTo(-height * 0.15, -height * 0.35);
  ctx.lineTo(-height * 0.35, -height * 0.35);
  ctx.lineTo(-height * 0.1, -height * 0.65);
  ctx.lineTo(-height * 0.25, -height * 0.65);

  ctx.closePath();
  ctx.fill();

  // Trang trí đơn giản (Chấm tròn màu)
  const colors = ["#F44336", "#FFC107", "#2196F3", "#FFFFFF"];
  [
    { x: -0.15, y: -0.2 },
    { x: 0.2, y: -0.3 },
    { x: -0.1, y: -0.5 },
    { x: 0.15, y: -0.7 },
    { x: 0, y: -0.4 },
    { x: 0.25, y: -0.15 },
  ].forEach((pos, i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(pos.x * height, pos.y * height, height * 0.03, 0, Math.PI * 2);
    ctx.fill();
  });

  // Ngôi sao
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(0, -height, height * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. Vẽ Người tuyết (Dáng nghiêng nhẹ thân thiện)
function drawSnowman(ctx, x, y, height) {
  ctx.save();
  ctx.translate(x, y);
  const s = height / 100; // scale factor

  // Bóng thân
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(0, -25 * s, 25 * s, 0, Math.PI * 2);
  ctx.fill(); // Dưới
  ctx.beginPath();
  ctx.arc(0, -65 * s, 20 * s, 0, Math.PI * 2);
  ctx.fill(); // Đầu

  // Khăn quàng (Đỏ nổi bật)
  ctx.fillStyle = "#E53935";
  ctx.fillRect(-15 * s, -50 * s, 30 * s, 8 * s);
  ctx.fillRect(5 * s, -50 * s, 8 * s, 25 * s); // Vạt khăn rủ xuống

  // Mắt mũi
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(-7 * s, -70 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7 * s, -70 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FF9800"; // Mũi cà rốt
  ctx.beginPath();
  ctx.moveTo(0, -65 * s);
  ctx.lineTo(15 * s, -62 * s);
  ctx.lineTo(0, -59 * s);
  ctx.fill();

  // Mũ len (Xanh)
  ctx.fillStyle = "#1976D2";
  ctx.beginPath();
  ctx.arc(0, -80 * s, 18 * s, Math.PI, 0); // Vòm mũ
  ctx.fillRect(-20 * s, -80 * s, 40 * s, 6 * s); // Vành mũ
  ctx.fill();
  // Cục bông trên mũ
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(0, -98 * s, 6 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. Vẽ Hộp quà (Khối lập phương đơn giản)
function drawGift(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);

  // Hộp
  ctx.fillStyle = color;
  ctx.fillRect(-size / 2, -size, size, size);

  // Dây nơ dọc
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillRect(-size * 0.15, -size, size * 0.3, size);
  // Dây nơ ngang
  ctx.fillRect(-size / 2, -size * 0.6, size, size * 0.2);

  ctx.restore();
}

// --- COMPONENT CHÍNH ---
const ChristmasGroup = ({ width = 300, height = 300, scale = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Clear canvas (Transparent background)
    ctx.clearRect(0, 0, width, height);

    // Tọa độ gốc (Anchor point) - điểm đặt chân của nhóm đối tượng
    // Đặt ở giữa theo chiều ngang, và gần đáy theo chiều dọc
    const anchorX = width / 2;
    const anchorY = height * 0.85;

    // Kích thước cơ sở
    const treeH = 180 * scale;
    const snowmanH = 110 * scale;
    const giftS = 40 * scale;

    // --- BẮT ĐẦU VẼ (THEO THỨ TỰ LỚP: SAU -> TRƯỚC) ---

    // 1. Vẽ bóng đổ (Cho tất cả để tạo cảm giác cùng nằm trên 1 mặt phẳng)
    // Bóng cây (To nhất)
    drawShadow(ctx, anchorX, anchorY, treeH * 0.3);
    // Bóng người tuyết (Lệch phải)
    drawShadow(ctx, anchorX + treeH * 0.3, anchorY + 10, snowmanH * 0.25);
    // Bóng quà (Lệch trái)
    drawShadow(ctx, anchorX - treeH * 0.25, anchorY + 15, giftS * 0.6);

    // 2. Vẽ Cây thông (Là đối tượng nền, to nhất)
    drawTree(ctx, anchorX, anchorY, treeH);

    // 3. Vẽ Người tuyết
    // Đứng bên phải cây, che một phần tán lá dưới của cây -> Tạo chiều sâu
    drawSnowman(ctx, anchorX + treeH * 0.3, anchorY + 10, snowmanH);

    // 4. Vẽ Hộp quà
    // Đặt bên trái, dưới gốc cây, là đối tượng gần mắt nhất (Y lớn nhất)
    drawGift(ctx, anchorX - treeH * 0.25, anchorY + 15, giftS, "#D32F2F"); // Hộp đỏ
    drawGift(ctx, anchorX - treeH * 0.1, anchorY + 20, giftS * 0.7, "#7B1FA2"); // Hộp tím nhỏ hơn ở trước
  }, [width, height, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: "block",
        margin: "0 auto",
        // Không có background color hay border để hòa nhập vào thiết kế của bạn
      }}
    />
  );
};

ChristmasGroup.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  scale: PropTypes.number, // Dùng để phóng to/thu nhỏ cả cụm
};

export default ChristmasGroup;
