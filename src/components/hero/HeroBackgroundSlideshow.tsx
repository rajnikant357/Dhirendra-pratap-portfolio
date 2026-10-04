import React, { useState, useEffect, useRef } from 'react';

interface Slide {
  src: string;
  title: string;
}

const HERO_SLIDES: Slide[] = [
  {
    src: '/photos/Work/CM%20Yogi/FB_IMG_1672659760788%20-%20Copy.jpg',
    title: 'Ceremonial Art Welcome for UP Chief Minister Yogi Adityanath',
  },
  {
    src: '/photos/awards/certificates%20and%20awards/FB_IMG_1659231446075.jpg',
    title: 'Kala Shree Samman & COVID-19 Warrior Award Presentation',
  },
  {
    src: '/photos/Work/CM%20Yogi/FB_IMG_1672659784107.jpg',
    title: 'Ceremonial Multi-Coloured Rangoli Carpet for UP CM Yogi Adityanath',
  },
  {
    src: '/photos/awards/certificates%20and%20awards/FB_IMG_1659231484703.jpg',
    title: 'Uttar Pradesh Kala Ratna Felicitation Ceremony',
  },
  {
    src: '/photos/Work/CM%20Yogi/FB_IMG_1672659812126.jpg',
    title: 'Grand Rangoli Welcome Installation for UP Chief Minister',
  },
  {
    src: '/photos/awards/certificates%20and%20awards/Screenshot_2023-03-16-19-35-35-245_com.instagram.android-edit%20-%20Copy.jpg',
    title: 'State Honor Trophy & Certificate Conferred on Stage',
  },
  {
    src: '/photos/Work/CM%20Yogi/FB_IMG_1672659820546.jpg',
    title: 'Fresh Flower Rangoli Carpet Welcoming UP CM Yogi Adityanath',
  },
  {
    src: '/photos/Work/sketches%20&%20paintings/FB_IMG_1659231349500.jpg',
    title: 'Commissioned Fine Art Portrait Presentation to Dignitary',
  },
  {
    src: '/photos/awards/certificates%20and%20awards/FB_IMG_1672659976673.jpg',
    title: 'Honorary Memento & Certificate Presentation Ceremony',
  },
];

export const HeroBackgroundSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const total = HERO_SLIDES.length;

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Background Images Layer covering entire hero section with 90% opacity and smooth crossfade */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-90 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}
    </div>
  );
};
