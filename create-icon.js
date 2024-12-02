function createIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Set background color (light blue like in the image)
  ctx.fillStyle = '#00bfff';
  ctx.fillRect(0, 0, size, size);

  // Draw yellow circle for emoji face
  ctx.beginPath();
  ctx.fillStyle = '#ffd700';
  ctx.arc(size/2, size/2, size*0.4, 0, Math.PI * 2);
  ctx.fill();

  // Draw sunglasses
  ctx.fillStyle = '#000000';
  const glassesWidth = size * 0.6;
  const glassesHeight = size * 0.25;
  const glassesY = size * 0.35;
  ctx.fillRect((size - glassesWidth)/2, glassesY, glassesWidth, glassesHeight);

  // Draw smile
  ctx.beginPath();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = size * 0.05;
  ctx.arc(size/2, size * 0.65, size * 0.2, 0, Math.PI);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

// Generate icons and download them
function generateAndDownloadIcons() {
  const sizes = [48, 128];
  
  sizes.forEach(size => {
    const dataUrl = createIcon(size);
    const link = document.createElement('a');
    link.download = `icon${size}.png`;
    link.href = dataUrl;
    link.click();
  });
}

// If we're in a browser, generate icons
if (typeof window !== 'undefined') {
  generateAndDownloadIcons();
}