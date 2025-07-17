"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useState, useRef, useEffect } from "react";

export interface Card {
  id: number;
  title: string;
  description: string;
  className: string;
  thumbnail: string;
}

export const BentoGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsVisible(entries[0].isIntersecting);
        }
      },
      {
        threshold: 0.2 // Animacja rozpocznie się gdy 20% sekcji będzie widoczne
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleClick = (card: Card) => {
    if (selected?.id === card.id) {
      setLastSelected(selected);
      setSelected(null);
    } else {
      setLastSelected(selected);
      setSelected(card);
    }
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="relative w-full min-h-[400px] lg:min-h-[600px]" ref={sectionRef}>
      <motion.div 
        className="flex flex-col items-center mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="relative group"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div 
            className="absolute -inset-1 bg-gradient-to-r from-[#00b3d4] to-[#e3a1a1] rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"
            style={{ filter: 'blur(20px)' }}
          />
          <img
            src="/images/arts/art4.png"
            alt="Dzieci z pucharem"
            className="relative w-[434px] h-[434px] object-cover rounded-full hover:brightness-110 hover:scale-105 transform transition-all duration-500 ease-in-out"
          />
        </motion.div>
        <motion.h2 
          className="text-[36px] md:text-[48px] font-bold mt-8 text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <span className="font-extralight">Nasze </span>
          <span className="font-bold">osiągnięcia</span>
        </motion.h2>
        <motion.p 
          className="text-xl text-center max-w-[586px] mt-6 text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          Zobacz najważniejsze sukcesy członków Klubu Sportowego Małopolska Akademia Gimnastyki
        </motion.p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto relative">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden rounded-xl cursor-pointer h-full w-full",
              selected?.id === card.id
                ? "rounded-lg absolute inset-0 m-auto z-30 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-20"
                : "hover:scale-[1.02] transition-transform duration-300 ease-in-out"
            )}
            layoutId={`card-${card.id}`}
          >
            <ImageComponent card={card} />
            {selected?.id === card.id && (
              <>
                <ContentComponent card={card} />
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOutsideClick();
                  }}
                  className="absolute top-4 right-4 z-50 text-white/80 hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </motion.button>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.div
      layoutId={`image-${card.id}-image`}
      className="absolute inset-0 h-full w-full"
    >
      <img
        src={card.thumbnail}
        alt={card.title}
        width={800}
        height={800}
        loading="lazy"
        decoding="async"
        className="object-cover object-center absolute inset-0 h-full w-full transition duration-200"
      />
      <div className="absolute inset-0 bg-black/20"></div>
    </motion.div>
  );
};

const ContentComponent = ({ card }: { card: Card }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative z-20 h-full w-full p-8 flex flex-col justify-center items-center text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#AC6BD6]/80 via-[#AC6BD6]/50 to-transparent" />
      <motion.h3 
        className="relative z-30 font-bold md:text-4xl text-xl mb-4 text-white drop-shadow-lg"
      >
        {card.title}
      </motion.h3>
      <motion.p 
        className="relative z-30 font-normal text-base max-w-lg text-white drop-shadow-lg"
      >
        {card.description}
      </motion.p>
    </motion.div>
  );
};
