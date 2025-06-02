// Immediately hide elements to prevent flash
gsap.set('.reveal, .stagger-children > *', {
  opacity: 0,
  y: 25
});
gsap.set('.stagger-children > *', {
  y: 20
});

document.addEventListener('DOMContentLoaded', function() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Respect user accessibility preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately if user prefers reduced motion
    gsap.set('.reveal, .fade-up, .slide-left, .slide-right, .stagger-children > *', {
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
    return elementTop > window.innerHeight * 0.8;
  }

  // Page load animations for .reveal elements
  gsap.utils.toArray('.reveal').forEach((element, index) => {
    // Check if element is in the initial viewport (above the fold)
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      // Animate on page load with a slight delay for stagger
      gsap.fromTo(element,
        {
          y: 25,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: index * 0.1, // Stagger delay
          ease: 'power1.out'
        }
      );
    } else {
      // For elements below the fold, they're already hidden by the initial gsap.set
      // Animate on scroll for elements below the fold
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
            once: true // Ensures animation only plays once
          }
        }
      );
    }
  });

  // Professional stagger animation
  gsap.utils.toArray('.stagger-children').forEach((container) => {
    const rect = container.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    const children = container.children;

    if (isInViewport) {
      // Animate immediately if in viewport
      gsap.fromTo(children,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
          stagger: 0.06,
          delay: 0.3
        }
      );
    } else if (isBelowFold(container)) {
      // Elements already hidden by initial gsap.set
      gsap.fromTo(children,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: container,
            start: 'top 78%',
            toggleActions: 'play none none none',
            once: true // Ensures animation only plays once
          }
        }
      );
    }
  });

  console.log('Professional GSAP animations loaded successfully!');
});
