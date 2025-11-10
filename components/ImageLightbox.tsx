
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ImageLightboxProps {
  imageUrls: string[];
  startIndex: number;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrls, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for gesture handling
  const lastTap = useRef(0);
  const pinchStartDist = useRef(0);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const hasMultipleImages = imageUrls.length > 1;

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const goToPrevious = useCallback(() => {
    if (!hasMultipleImages) return;
    resetZoom();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  }, [hasMultipleImages, imageUrls.length, resetZoom]);

  const goToNext = useCallback(() => {
    if (!hasMultipleImages) return;
    resetZoom();
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  }, [hasMultipleImages, imageUrls.length, resetZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) { // Pinch
      e.preventDefault();
      isPanning.current = false;
      pinchStartDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    } else if (e.touches.length === 1) { // Single touch
      const now = new Date().getTime();
      if (now - lastTap.current < 300) { // Double tap
        e.preventDefault();
        if (scale > 1) resetZoom();
        else setScale(2);
      }
      lastTap.current = now;

      if (scale > 1) { // Panning
        isPanning.current = true;
        panStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
      } else if (hasMultipleImages) { // Swiping
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = e.touches[0].clientX;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) { // Pinching
      e.preventDefault();
      const pinchCurrentDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const newScale = Math.max(1, Math.min(scale * (pinchCurrentDist / pinchStartDist.current), 5));
      setScale(newScale);
      pinchStartDist.current = pinchCurrentDist;
    } else if (e.touches.length === 1) {
      if (isPanning.current) { // Panning
        e.preventDefault();
        const newX = e.touches[0].clientX - panStart.current.x;
        const newY = e.touches[0].clientY - panStart.current.y;
        setPosition({ x: newX, y: newY });
      } else if (hasMultipleImages && scale === 1) { // Swiping
        touchEndX.current = e.touches[0].clientX;
      }
    }
  };
  
  const handleTouchEnd = () => {
     if (hasMultipleImages && scale === 1 && touchStartX.current !== 0) {
      const swipeDistance = touchStartX.current - touchEndX.current;
      if (Math.abs(swipeDistance) > 50) { // Swipe threshold
        if (swipeDistance > 0) { // Swipe left
          goToNext();
        } else { // Swipe right
          goToPrevious();
        }
      }
    }
    
    isPanning.current = false;
    pinchStartDist.current = 0;
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.01;
    setScale(Math.max(1, Math.min(newScale, 5)));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      ref={containerRef}
      onWheel={handleWheel}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl hover:text-stone-300 transition-colors z-[110]" aria-label="Fermer">&times;</button>

      {hasMultipleImages && (
        <>
          <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-[110]" aria-label="Image précédente"><ChevronLeftIcon className="h-8 w-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-[110]" aria-label="Image suivante"><ChevronRightIcon className="h-8 w-8" /></button>
        </>
      )}

      {scale > 1 && (
         <button onClick={(e) => { e.stopPropagation(); resetZoom(); }} className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-[110]" aria-label="Réinitialiser le zoom">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
         </button>
      )}

      <div
        className="relative max-w-full max-h-full flex flex-col items-center justify-center gap-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={imageUrls[currentIndex]}
          alt={`Vue en grand ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg animate-slide-up"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            cursor: scale > 1 ? 'grab' : 'auto',
            transition: isPanning.current ? 'none' : 'transform 0.2s ease-out',
            touchAction: 'none'
          }}
        />
        {hasMultipleImages && (
            <div className="text-white bg-black/40 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {imageUrls.length}
            </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ImageLightbox;
