document.addEventListener('DOMContentLoaded', function() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Respect user accessibility preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately if user prefers reduced motion
    gsap.set('.reveal', {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1
    });
    return;
  }

  // Get all .reveal elements (only process if they exist)
  const revealElements = gsap.utils.toArray('.reveal');

  if (revealElements.length === 0) {
    console.log('No .reveal elements found - skipping animations');
    return;
  }

  console.log(`Found ${revealElements.length} .reveal elements`);

  // Process each .reveal element
  revealElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      // Above-the-fold: Don't hide, just add subtle entrance
      gsap.fromTo(element,
        {
          y: 15,
          opacity: 0.7
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.08,
          ease: 'power2.out'
        }
      );
    } else {
      // Below-the-fold: Hide initially, reveal on scroll
      gsap.set(element, { opacity: 0, y: 25 });

      gsap.fromTo(element,
        {
          y: 25,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }
  });

  console.log('Clean GSAP animations loaded - no errors!');
});
