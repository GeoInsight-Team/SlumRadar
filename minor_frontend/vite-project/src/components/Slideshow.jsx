import React, { useState, useEffect } from "react";
import slum1 from "../assets/slum1.jpg";
import slum2 from "../assets/slum2.jpg";
import slum3 from "../assets/slum3.jpg";

const Slideshow = () => {
  const images = [slum1, slum2, slum3];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            i === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default Slideshow;
