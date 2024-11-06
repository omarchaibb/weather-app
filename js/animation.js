gsap.from(".container", {
    duration: 1,
    opacity: 0,
    scale: 0.8,
    ease: "power3.out",
  });

  gsap.from(".card", {
    duration: 1,
    opacity: 0,
    y: 20,
    ease: "power3.out",
    stagger: 0.2,
  });

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.1, duration: 0.2 });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.2 });
    });
  });

  gsap.from(".left_side", {
    duration: 1,
    x: -300,
    opacity: 0,
    ease: "power3.out",
  });

  gsap.to(".skeleton", {
    duration: 1.5,
    backgroundPosition: "200% 0",
    repeat: -1,
    ease: "linear",
  });
