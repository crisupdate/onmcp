import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";

export default function QRCodeGenerator({ qrText, img, thx, btnColor, previewSrc, setPreviewSrc }) {
  const [transparentBg, setTransparentBg] = useState(false);
  const [qrColor, setQrColor] = useState("#ffffff");
  const qrRef = useRef();

  const mergeQRWithBackground = () => {
    const qrCanvas = qrRef.current?.getElementsByTagName("canvas")[0];
    if (!qrCanvas) return;

    const finalSize = 500; // Output image size
    const padding = 80; // px space around QR
    const qrDrawSize = finalSize - padding * 2;
    const linkText = qrText.replace(/^https?:\/\//, '');

    // Create fixed-size canvas
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = finalSize;
    mergedCanvas.height = finalSize;
    const ctx = mergedCanvas.getContext("2d");

    if (transparentBg) {
      // Transparent background — draw QR with padding
      ctx?.drawImage(qrCanvas, padding, padding, qrDrawSize, qrDrawSize);
      setPreviewSrc(mergedCanvas.toDataURL("image/png"));
    } else {
      // QR over background image
      // const backgroundImage = new Image();
      const backgroundImage = new globalThis.Image();
      backgroundImage.src = img; // Your background path
      backgroundImage.crossOrigin = "anonymous";

      backgroundImage.onload = () => {
        // --- COVER logic (like CSS background-size: cover) ---
        const bgAspect = backgroundImage.width / backgroundImage.height;
        const canvasAspect = finalSize / finalSize; // always 1:1
        let drawWidth, drawHeight, offsetX, offsetY;

        if (bgAspect > canvasAspect) {
          // Background is wider → fit height, crop sides
          drawHeight = finalSize;
          drawWidth = drawHeight * bgAspect;
          offsetX = (finalSize - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Background is taller → fit width, crop top/bottom
          drawWidth = finalSize;
          drawHeight = drawWidth / bgAspect;
          offsetX = 0;
          offsetY = (finalSize - drawHeight) / 2;
        }

        ctx.filter = "blur(10px)";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";  // Shadow color (black, 50% opacity)
        ctx.shadowBlur = 10;                      // Blur radius for the shadow
        ctx.shadowOffsetX = 4;                    // Horizontal offset
        ctx.shadowOffsetY = 4;  
        ctx?.drawImage(
          backgroundImage,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight
        );

        // Darken permanently by multiplying with a black rectangle
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // adjust opacity for darkness
        ctx.fillRect(offsetX, offsetY, drawWidth, drawHeight);

        // Reset so future drawings behave normally
        ctx.globalCompositeOperation = "source-over";

        ctx.filter = "none";

        // Draw text below QR code
        ctx.font = "18px Arial";         // Choose font size and family
        ctx.fillStyle = qrColor;         // Text color (adjust as needed)
        ctx.textAlign = "center";        // Center the text horizontally

        const linkX = finalSize / 2;
        const linkY = padding - 30;

        ctx.fillText(linkText, linkX, linkY);

        // Draw QR on top with padding
        ctx?.drawImage(qrCanvas, padding, padding, qrDrawSize, qrDrawSize);

        // Calculate x center and y position just below QR
        const textX = finalSize / 2;
        const textY = finalSize - padding / 2; // slightly above bottom edge

        ctx.fillText("Made with CustomWaitlist.com", textX, textY);

        setPreviewSrc(mergedCanvas.toDataURL("image/png"));
      };
    }
  };

//   const mergeQRWithBackground = () => {
//   const qrCanvas = qrRef.current?.getElementsByTagName("canvas")[0];
//   if (!qrCanvas) return;

//   const finalSize = 500; // Output image size
//   const padding = 20; // px around QR
//   const qrDrawSize = finalSize - padding * 2;

//   // Create fixed-size canvas
//   const mergedCanvas = document.createElement("canvas");
//   mergedCanvas.width = finalSize;
//   mergedCanvas.height = finalSize;
//   const ctx = mergedCanvas.getContext("2d");
//   if (!ctx) return;

//   if (transparentBg) {
//     // Transparent background — draw QR with padding
//     ctx.drawImage(qrCanvas, padding, padding, qrDrawSize, qrDrawSize);
//     setPreviewSrc(mergedCanvas.toDataURL("image/png"));
//     return;
//   }

//   // QR over background image
//   const backgroundImage = new window.Image();
//   backgroundImage.crossOrigin = "anonymous";
//   backgroundImage.src = img; // Your background path

//   backgroundImage.onload = () => {
//     // Calculate cover dimensions (like CSS background-size: cover)
//     const bgAspect = backgroundImage.width / backgroundImage.height;
//     const canvasAspect = 1; // always square

//     let drawWidth, drawHeight, offsetX, offsetY;

//     if (bgAspect > canvasAspect) {
//       // Background is wider → fit height, crop sides
//       drawHeight = finalSize;
//       drawWidth = drawHeight * bgAspect;
//       offsetX = (finalSize - drawWidth) / 2;
//       offsetY = 0;
//     } else {
//       // Background is taller → fit width, crop top/bottom
//       drawWidth = finalSize;
//       drawHeight = drawWidth / bgAspect;
//       offsetX = 0;
//       offsetY = (finalSize - drawHeight) / 2;
//     }

//     // Draw background
//     ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);

//     // Draw QR code with padding
//     ctx.drawImage(qrCanvas, padding, padding, qrDrawSize, qrDrawSize);

//     // Save preview
//     setPreviewSrc(mergedCanvas.toDataURL("image/png"));
//   };

//   backgroundImage.onerror = () => {
//     console.error("Failed to load background image:", img);
//     // Fallback to QR only
//     ctx.drawImage(qrCanvas, padding, padding, qrDrawSize, qrDrawSize);
//     setPreviewSrc(mergedCanvas.toDataURL("image/png"));
//   };
// };


  const downloadQRCode = () => {
    if (!previewSrc) return;
    const link = document.createElement("a");
    link.download = `${qrText.replace(/^https?:\/\//, '')}-qr-cw.png`;
    link.href = previewSrc;
    link.click();
  };

  // Update preview when QR text, color, or transparency changes
  useEffect(() => {
    mergeQRWithBackground();
    // console.log("img", img);
  }, [qrColor, transparentBg, img, qrText, qrColor]);

  return (
    <div className="w-full space-y-4 ">

      {/* Hidden QR code canvas */}
      <div id="qrcode" ref={qrRef} className="hidden">
        <QRCodeCanvas
          size={500}
          value={qrText}
          fgColor={qrColor}
          bgColor="rgba(255,255,255,0)" // Always transparent so we can control bg manually
        />
      </div>

      {/* Preview */}
      {previewSrc && (
        <div className="w-full h-auto flex justify-center bg-white/0 p-4 rounded-xl">
          <Image
            src={previewSrc}
            alt="QR Preview"
            height={1000}
            width={1000}
            className="rounded-xl shadow-perfect w-full max-w-[200px] h-auto"
          />
        </div>
      )}

    <div className={`w-full grid grid-cols-2 gap-4 text-xs bg-white/5 px-4 py-2 rounded-xl ${thx && "hidden"}`}>
      <label className="flex items-center gap-2 justify-start">
        <input
          type="checkbox"
          checked={transparentBg}
          onChange={(e) => setTransparentBg(e.target.checked)}
          className="h-5 w-5 rounded-full accent-orange-600 cursor-pointer"
        />
        No Background
      </label>
      <label className="flex items-center gap-2 justify-end">
        QR Color:
        <input
          type="color"
          value={qrColor}
          onChange={(e) => setQrColor(e.target.value)}
          className="cursor-pointer bg-transparent h-7 w-6"
        />
      </label>
    </div>

      <button
        onClick={downloadQRCode}
        className={`w-full px-4 py-2 text-white hover:bg-orange-700 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600 ${thx ? "rounded-full" : "rounded-xl"} ${btnColor ?? "bg-orange-600"}`}
      >
        Download QR
      </button>
    </div>
  );
}
