/**
 * FMW Elite Protection - scripts.js
 * jQuery + Vanilla JS interactions
 */

$(document).ready(function () {

  /* ================================================
     1. LENIS SMOOTH SCROLL INITIALIZATION
  ================================================ */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ================================================
     2. NAVBAR & BACK TO TOP - Scroll behavior (Optimized via Lenis scroll event)
  ================================================ */
  const $navbar = $('#mainNav');
  const $scrollTopBtn = $('#scrollTopBtn');

  lenis.on('scroll', (e) => {
    const scrollTop = e.scroll;

    // Scrolled style for Navbar
    if (scrollTop > 60) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollTop > 400) {
      $scrollTopBtn.addClass('visible');
    } else {
      if (!$scrollTopBtn.hasClass('accelerating')) {
        $scrollTopBtn.removeClass('visible');
      }
    }

    // Hero Parallax subtle effect
    if (scrollTop < window.innerHeight) {
      $('.hero-content').css('transform', `translateY(${scrollTop * 0.15}px)`);
    }
  });

  // Highlight active nav link based on scroll position (Using IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            $('.navbar-nav .nav-link').removeClass('active');
            $(`.navbar-nav .nav-link[href="#${id}"]`).addClass('active');
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    document.querySelectorAll('section[id], header[id]').forEach(el => {
      navObserver.observe(el);
    });
  }

  // Scroll to top (with custom car acceleration animation)
  $scrollTopBtn.on('click', function () {
    if ($(this).hasClass('accelerating')) return;
    
    $(this).addClass('accelerating');
    
    // Smoothly scroll to top using Lenis
    lenis.scrollTo(0, {
      duration: 1.4,
      easing: (t) => t * t * t, // cubic acceleration curve
      onComplete: () => {
        $scrollTopBtn.removeClass('accelerating visible');
      }
    });
  });

  // Smooth scroll for all anchor links using Lenis
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (target === '#' || !$(target).length) return;
    e.preventDefault();
    
    const offset = $navbar.outerHeight() + 10;
    
    lenis.scrollTo(target, {
      offset: -offset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    // Close mobile menu
    if ($('#navMenu').hasClass('show')) {
      $('#navMenu').collapse('hide');
    }
  });

  /* ================================================
     2. BEFORE / AFTER IMAGE COMPARISON SLIDER
  ================================================ */
  const $container = $('#compareContainer');
  const $before = $('#compareBefore');
  const $handle = $('#compareHandle');
  let isDragging = false;

  if ($container.length) {
    function setComparePosition(x) {
      const rect = $container[0].getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(2, Math.min(98, pos));
      $before.css('width', pos + '%');
      $handle.css('left', pos + '%');
    }

    // Mouse events
    $handle.on('mousedown touchstart', function (e) {
      isDragging = true;
      e.preventDefault();
    });

    $(document).on('mousemove touchmove', function (e) {
      if (!isDragging) return;
      const x = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
      setComparePosition(x);
    });

    $(document).on('mouseup touchend', function () {
      isDragging = false;
    });

    // Click on container also moves slider
    $container.on('click', function (e) {
      setComparePosition(e.clientX);
    });

    // Initialize at 50%
    setTimeout(() => {
      const rect = $container[0].getBoundingClientRect();
      setComparePosition(rect.left + rect.width * 0.5);
    }, 300);
  }

  /* ================================================
     3. PORTFOLIO FILTER TABS
  ================================================ */
  $('.port-tab').on('click', function () {
    const filter = $(this).data('filter');

    // Update active tab
    $('.port-tab').removeClass('active');
    $(this).addClass('active');

    // Filter items
    $('.port-item').each(function () {
      const cat = $(this).data('cat');
      if (filter === 'all' || cat === filter) {
        $(this).removeClass('hidden').css({ opacity: 0, transform: 'scale(0.9)' });
        setTimeout(() => {
          $(this).css({ opacity: 1, transform: 'scale(1)', transition: 'all 0.35s ease' });
        }, 50);
      } else {
        $(this).addClass('hidden');
      }
    });
  });

  /* ================================================
     4. ANIMATE ON SCROLL (IntersectionObserver)
  ================================================ */
  // Add fade-up class to elements
  const animTargets = [
    '.service-card',
    '.why-card',
    '.pkg-card',
    '.testi-card',
    '.stat-item',
    '.port-card',
    '.section-header',
  ];
  animTargets.forEach(selector => {
    $(selector).addClass('fade-up');
  });

  // IntersectionObserver for elements entrance animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  } else {
    // Simple fallback if no IntersectionObserver
    $('.fade-up').addClass('visible');
  }

  /* ================================================
     5. STAGGER ANIMATION FOR GRIDS
  ================================================ */
  // Stagger delays for grid items
  $('.section-services .service-card').each(function (i) {
    $(this).css('transition-delay', (i * 0.1) + 's');
  });
  $('.section-why .why-card').each(function (i) {
    $(this).css('transition-delay', (i * 0.08) + 's');
  });
  $('.section-packages .pkg-card').each(function (i) {
    $(this).css('transition-delay', (i * 0.1) + 's');
  });
  $('.section-testimonials .testi-card').each(function (i) {
    $(this).css('transition-delay', (i * 0.1) + 's');
  });

  /* ================================================
     6. TESTIMONIALS DOT NAVIGATION (decorative)
  ================================================ */
  $('.testi-dot').on('click', function () {
    $('.testi-dot').removeClass('active');
    $(this).addClass('active');
  });

  /* ================================================
     7. RESULTS SECTION NAVIGATION BUTTONS
  ================================================ */
  const compareImages = [
    {
      before: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
      after: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80'
    },
    {
      before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80'
    },
    {
      before: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80',
      after: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=80'
    }
  ];

  let currentCompare = 0;

  function updateCompareImages() {
    const { before, after } = compareImages[currentCompare];
    $('#compareBefore img').attr('src', before);
    $('.compare-after img').attr('src', after);
    // Reset position
    const rect = $container[0].getBoundingClientRect();
    setComparePosition(rect.left + rect.width * 0.5);
  }

  $('#nextResult').on('click', function () {
    currentCompare = (currentCompare + 1) % compareImages.length;
    $('#prevResult').removeClass('active');
    $(this).addClass('active');
    updateCompareImages();
  });

  $('#prevResult').on('click', function () {
    currentCompare = (currentCompare - 1 + compareImages.length) % compareImages.length;
    $('#nextResult').removeClass('active');
    $(this).addClass('active');
    updateCompareImages();
  });

  /* ================================================
     8. COUNTER ANIMATION for stats (IntersectionObserver)
  ================================================ */
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;
    $('.stat-number').each(function () {
      const $el = $(this);
      const text = $el.text().trim();
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      const suffix = text.replace(/[0-9]/g, '');
      if (isNaN(num)) return;

      $({ count: 0 }).animate({ count: num }, {
        duration: 1500,
        easing: 'swing',
        step: function () {
          $el.text(Math.floor(this.count) + suffix);
        },
        complete: function () {
          $el.text(num + suffix);
        }
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);
  } else {
    animateCounters();
  }

  /* ================================================
     9. NAVBAR MOBILE - auto collapse on resize
  ================================================ */
  $(window).on('resize', function () {
    if ($(window).width() > 991) {
      $('#navMenu').removeClass('show');
    }
  });

  /* ================================================
     10. SHOW MORE PORTFOLIO
  ================================================ */
  $('#btnShowMore').on('click', function (e) {
    e.preventDefault();
    // Toggle hidden items (for demo purposes)
    $(this).text($(this).text() === 'كل الأعمال' ? 'عرض أقل' : 'كل الأعمال');
  });

  // Parallax is now handled efficiently within the Lenis scroll callback

  /* ================================================
     12. Initial page load animation
  ================================================ */
  $('body').css('opacity', 0);
  $('body').animate({ opacity: 1 }, 600);

});
