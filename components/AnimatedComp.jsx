import React, { useEffect, useRef } from "react";

const AnimatedComp = ({ children, obj }) => {
  const animatedTextRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      //   threshold: 0.5,
    };

    let lastScrollPosition =
      window.scrollY || document.documentElement.scrollTop;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const currentScrollPosition =
          window.scrollY || document.documentElement.scrollTop;

        if (animatedTextRef.current) {
          // Check if the ref is not null
          // Check if scrolling down and the currentScrollPosition is greater than the lastScrollPosition
          if (
            currentScrollPosition > lastScrollPosition &&
            entry.isIntersecting
          ) {
            animatedTextRef.current.classList.add(
              obj === "title"
                ? "animate-slideIn"
                : obj === "text"
                ? "animate-slideIn-d1"
                : obj === "any"
                ? "animate-opacityIn"
                : "animate-slideIn"
            );
          } else {
            animatedTextRef.current.classList.remove(
              "animate-slideIn",
              "animate-slideIn-d1",
              "animate-opacityIn"
            );
          }
        }

        lastScrollPosition = currentScrollPosition;
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (animatedTextRef.current) {
      observer.observe(animatedTextRef.current);
    }

    return () => {
      if (animatedTextRef.current) {
        observer.unobserve(animatedTextRef.current);
      }
    };
  }, []);

  return (
    <div key="animatedText" ref={animatedTextRef}>
      {children}
    </div>
  );
};

export default AnimatedComp;
