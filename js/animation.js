gsap.from(".container", {
    duration: 1,
    opacity: 1,
    ease: "power3.out",
  });

  gsap.from(".card", {
    duration: 1,
    opacity: 0,
    y: 20,
    ease: "power3.out",
    stagger: 0.2,
  });

  gsap.from(".left_side", {
    duration: 1,
    x: 0,
    opacity: 1,
    ease: "power3.out",
  });

  gsap.to(".skeleton", {
    duration: 1.5,
    backgroundPosition: "200% 0",
    repeat: -1,
    ease: "linear",
  });
