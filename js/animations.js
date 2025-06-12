document.addEventListener('DOMContentLoaded', function() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Respect user accessibility preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately if user prefers reduced motion
    gsap.set('.reveal, .stagger-children > *', {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1
    });
    return;
  }

  // Helper function to check if element is below the fold
  function isBelowFold(element) {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    return elementTop > window.innerHeight;
  }

  // Process .reveal elements
  gsap.utils.toArray('.reveal').forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      // CRITICAL: Don't hide above-the-fold content
      // Just add a subtle animation without hiding
      gsap.fromTo(element,
        {
          y: 10,
          opacity: 0.8
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          delay: index * 0.05, // Reduced stagger
          ease: 'power1.out'
        }
      );
    } else {
      // Only hide elements that are below the fold
      gsap.set(element, { opacity: 0, y: 25 });

      gsap.fromTo(element,
        {
          y: 25,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }
  });

  // Stagger children animations (only if container exists)
  const staggerContainers = gsap.utils.toArray('.stagger-children');
  if (staggerContainers.length > 0) {
    staggerContainers.forEach((container) => {
      const rect = container.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      const children = container.children;

      if (isInViewport) {
        // Don't hide above-the-fold stagger content
        gsap.fromTo(children,
          {
            y: 8,
            opacity: 0.9
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.25,
            ease: 'power1.out',
            stagger: 0.03,
            delay: 0.1
          }
        );
      } else {
        // Only hide below-the-fold stagger content
        gsap.set(children, { opacity: 0, y: 20 });

        gsap.fromTo(children,
          {
            y: 20,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
            stagger: 0.04,
            scrollTrigger: {
              trigger: container,
              start: 'top 78%',
              toggleActions: 'play none none none',
              once: true
            }
          }
        );
      }
    });
  }
});
