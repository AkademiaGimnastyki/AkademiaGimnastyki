'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const lightboxRoot = document.getElementById('lightbox-root');
    if (!lightboxRoot) return;

    const handleShowLightbox = (e: CustomEvent) => {
      setImageUrl(e.detail.imageUrl);
      setIsOpen(true);
    };

    lightboxRoot.addEventListener('showLightbox', handleShowLightbox as EventListener);

    return () => {
      lightboxRoot.removeEventListener('showLightbox', handleShowLightbox as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (!isOpen) {
        setTimeout(() => {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 300);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-10 max-w-[90vw] max-h-[90vh] mx-auto"
          >
            <button
              onClick={handleClose}
              className="absolute -top-12 right-4 text-white hover:text-[#00b3d4] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            <motion.div className="relative">
              <motion.img
                src={imageUrl}
                alt="Powiększone zdjęcie"
                className="rounded-lg shadow-2xl max-h-[85vh] w-auto object-contain"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
