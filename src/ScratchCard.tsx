import { useEffect, useRef, useState } from "react";
import { Sparkles, Heart } from "lucide-react";
import { useInvitation } from "./invitation/InvitationContext";

export function ScratchCard() {
  const config = useInvitation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const lastProgressCheck = useRef(0);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const paintCover = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width || 340;
      const height = rect.height || 210;
      if (canvas.width === Math.round(width * dpr) && canvas.height === Math.round(height * dpr))
        return;
      setScratchPercent(0);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      // A pastel yellow cover matches the invitation stationery.
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#f6e6a1");
      grad.addColorStop(0.25, "#e6d181");
      grad.addColorStop(0.5, "#fff5c8");
      grad.addColorStop(0.75, "#e6d181");
      grad.addColorStop(1, "#e8d78e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Elegant inner border on the scratch foil
      ctx.strokeStyle = "rgba(171, 133, 46, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(8, 8, width - 16, height - 16);

      // Subtle star dust specks
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 35; i++) {
        const px = ((i * 43) % (width - 24)) + 12;
        const py = ((i * 57) % (height - 24)) + 12;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Centered foil text
      ctx.fillStyle = "#204e49";
      ctx.font = `700 ${width < 340 ? 15 : 17}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.03em";
      ctx.fillText("A date to remember", width / 2, height / 2 - 14);

      ctx.fillStyle = "#405d50";
      ctx.font = "italic 18px Georgia, serif";
      ctx.fillText("Scratch here, or reveal below", width / 2, height / 2 + 18);
    };
    paintCover();
    // WebKit reports a resize loop when canvas styles change during delivery.
    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(paintCover);
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(resizeFrame);
    };
  }, [isRevealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();

    if (lastPoint.current) {
      ctx.lineWidth = 38;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPoint.current = { x, y };
    // Pixel readback is expensive on phones; keep drawing fluid between checks.
    const now = performance.now();
    if (now - lastProgressCheck.current >= 120) {
      lastProgressCheck.current = now;
      checkProgress();
    }
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      const step = 16;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let transparent = 0;
      let total = 0;

      for (let y = 0; y < h; y += step * dpr) {
        for (let x = 0; x < w; x += step * dpr) {
          const idx = (Math.floor(y) * w + Math.floor(x)) * 4 + 3;
          if (data[idx] < 128) {
            transparent++;
          }
          total++;
        }
      }

      const percent = Math.round((transparent / total) * 100);
      setScratchPercent(percent);

      if (percent >= 35) {
        revealCard();
      }
    } catch {
      // Fallback
    }
  };

  const revealCard = () => {
    setIsRevealed(true);
    setScratchPercent(100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPoint.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (isDrawing.current) checkProgress();
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div className="scratch-card-wrapper">
      <div
        ref={containerRef}
        className="scratch-card-box"
        role="region"
        aria-label="Interactive scratch card revealing wedding date"
      >
        {/* Base Layer: Revealed Wedding Date */}
        <div className="scratch-underlay">
          <div className="scratch-inner-border">
            <span className="scratch-kicker">Save The Date</span>
            <div className="scratch-date-display">
              <span className="scratch-day-num">{config.display.wedding.day}</span>
              <div className="scratch-month-col">
                <strong>{config.display.wedding.month.toUpperCase()}</strong>
                <span>
                  {config.display.wedding.year} · {config.display.wedding.weekday.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="scratch-couple-names">
              {config.couple.first} <span>&amp;</span> {config.couple.second}
            </p>
            <p className="scratch-venue-city">{config.scratchLocation || config.city}</p>
            <div className="scratch-forever-pill">
              <Heart size={12} className="text-[var(--teal)]" aria-hidden="true" />
              <span>Our forever begins here</span>
            </div>
          </div>
        </div>

        {/* Scratchable Canvas Layer */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
          />
        )}
      </div>

      <div className="scratch-actions-row">
        <p className="scratch-status-hint" aria-live="polite" aria-atomic="true">
          {isRevealed ? (
            <span className="scratch-revealed-text">
              <Sparkles size={13} className="inline mr-1 text-[var(--teal)]" aria-hidden="true" />
              Date Revealed! {config.display.wedding.full}
            </span>
          ) : (
            <span>
              {scratchPercent > 0
                ? "Keep scratching to discover our date"
                : "A little surprise, just for you"}
            </span>
          )}
        </p>

        {!isRevealed && (
          <button type="button" className="scratch-reveal-button focus-ring" onClick={revealCard}>
            Reveal the date
          </button>
        )}
      </div>
    </div>
  );
}
