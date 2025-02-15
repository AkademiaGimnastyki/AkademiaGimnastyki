'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";

// Standardowe importy obrazów
import art2Image from '../../public/images/arts/art2.png';
import art5Image from '../../public/images/arts/art5.png';

export default function IntroSection() {
  const [titleNumber, setTitleNumber] = useState(0);
  const componentRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: componentRef,
    offset: ["start end", "end start"]
  });

  const titles = useMemo(
    () => ["Pasją", "Przygodą", "Rozwojem", "Zabawą", "Wyzwaniem"],
    []
  );

  const images = useMemo(() => [
    { src: art2Image.src, alt: "Gimnastyka dla dzieci" },
    { src: art5Image.src, alt: "Zajęcia grupowe" }
  ], []);

  // Efekt paralaksy względem pozycji komponentu
  const leftImageX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [250, 0, -250],
    { clamp: true }
  );

  const rightImageX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-250, 0, 250],
    { clamp: true }
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev >= titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <motion.div 
      ref={componentRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[773px] w-full overflow-hidden bg-white"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Background blur effect */}
      <div
        className="absolute left-1/2 top-28 -translate-x-1/2 w-[650px] h-[549px] rounded-full bg-white"
        style={{ filter: 'blur(150px)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.h2 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block font-poppins text-[64px] font-bold">
            <span className="text-[#00b3d4]">Gimnastyka</span>
            <span className="text-[#e3a1a1] ml-4">jest</span>
          </span>
          <span className="relative flex w-full justify-center overflow-hidden text-center h-[90px]">
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-poppins text-[64px] font-extralight"
                initial={{ opacity: 0, y: "100%" }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? "-100%" : "100%", opacity: 0 }
                }
                transition={{ 
                  type: "spring", 
                  stiffness: 50,
                  damping: 12
                }}
              >
                {title}
              </motion.span>
            ))}
          </span>
        </motion.h2>

        <motion.div 
          className="max-w-[766px] text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-roboto text-xl leading-[160%] mb-12">
            Gimnastyka to klucz do świata, gdzie ruch staje się pasją, a wyzwania – źródłem dumy. 
            Trenujemy nie tylko ciało — budujemy pewność siebie i zdrowe nawyki na całe życie. 
            Nasi certyfikowani trenerzy, absolwenci AWF Kraków, zamienią każdy trening w przygodę 
            pełną wyzwań i uśmiechu
          </p>

          <motion.button
            className="rounded-[75px] border border-black px-12 py-3 font-roboto text-xl hover:bg-black hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Dołącz do nas!
          </motion.button>
        </motion.div>

        {/* Left image with parallax */}
        <motion.div 
          className="absolute left-[350px] top-32 z-0"
          style={{ x: leftImageX }}
          initial={{ opacity: 0, x: 0 }}
          animate={{ 
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
            rotate: [-1, 1, -1]
          }}
          transition={{ 
            duration: 1,
            delay: 0.2,
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <img
            src={images[0].src}
            alt={images[0].alt}
            width={458}
            height={458}
            className="object-cover will-change-transform"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* Right image with parallax */}
        <motion.div 
          className="absolute right-[350px] top-32 z-0"
          style={{ x: rightImageX }}
          initial={{ opacity: 0, x: 0 }}
          animate={{ 
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
            rotate: [1, -1, 1]
          }}
          transition={{ 
            duration: 1,
            delay: 0.2,
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <img
            src={images[1].src}
            alt={images[1].alt}
            width={458}
            height={458}
            className="object-cover will-change-transform"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
