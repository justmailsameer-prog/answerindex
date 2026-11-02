/**
 * Answer Index - Interactive 4-Stage Demo Player Walkthrough
 * Inspired by BeyondComments' subtle, high-performance progressive simulation.
 * Pure lightweight vanilla JS (Zero external libraries, requestAnimationFrame timing).
 */

(function () {
  const STAGE_DURATIONS = [4200, 4600, 4600, 5200]; // ms per stage
  let currentStage = 0;
  let isPlaying = true;
  let isVisible = true;
  let stageStartTime = performance.now();
  let elapsedBeforePause = 0;
  let rafId = null;

  // DOM Elements
  let playerContainer = null;
  let chapterButtons = [];
  let stagePanels = [];
  let toggleBtn = null;
  let toggleBtnText = null;

  // Stage 1 Typewriter elements
  let simDomainText = null;
  const sampleDomains = ["nordicnesting.com", "shopify.com", "stripe.com"];
  let currentDomainIdx = 0;

  // Stage 2 Counter elements
  let tickerNumEl = null;

  function initDemoPlayer() {
    playerContainer = document.getElementById('demoWalkthroughPlayer');
    if (!playerContainer) return;

    chapterButtons = Array.from(playerContainer.querySelectorAll('.demo-chapter-btn'));
    stagePanels = Array.from(playerContainer.querySelectorAll('.demo-stage-panel'));
    toggleBtn = document.getElementById('demoPlayerToggleBtn');
    toggleBtnText = document.getElementById('demoPlayerToggleText');

    simDomainText = document.getElementById('demoSimDomainText');
    tickerNumEl = document.getElementById('demoTickerNum');

    // Add click listeners to chapter buttons
    chapterButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        jumpToStage(idx);
      });
    });

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        togglePlayPause();
      });
    }

    // IntersectionObserver to pause when scrolled out of view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isPlaying) {
          stageStartTime = performance.now() - elapsedBeforePause;
          startLoop();
        } else {
          stopLoop();
        }
      }, { threshold: 0.25 });
      observer.observe(playerContainer);
    }

    // Check for prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isPlaying = false;
      updatePlayToggleUI();
    }

    // Initial render
    renderStage(0);
    stageStartTime = performance.now();
    startLoop();
  }

  function jumpToStage(stageIdx) {
    currentStage = stageIdx % STAGE_DURATIONS.length;
    elapsedBeforePause = 0;
    stageStartTime = performance.now();
    renderStage(currentStage);
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      stageStartTime = performance.now() - elapsedBeforePause;
      startLoop();
    } else {
      stopLoop();
    }
    updatePlayToggleUI();
  }

  function updatePlayToggleUI() {
    if (!toggleBtn || !toggleBtnText) return;
    if (isPlaying) {
      toggleBtnText.textContent = "Pause Walkthrough";
      toggleBtn.querySelector('svg').innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    } else {
      toggleBtnText.textContent = "Play Walkthrough";
      toggleBtn.querySelector('svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
  }

  function renderStage(stageIdx) {
    // 1. Update Chapter Buttons
    chapterButtons.forEach((btn, i) => {
      const progressFill = btn.querySelector('.demo-chapter-progress');
      if (i === stageIdx) {
        btn.classList.add('active');
        if (progressFill) progressFill.style.width = '0%';
      } else {
        btn.classList.remove('active');
        if (progressFill) progressFill.style.width = i < stageIdx ? '100%' : '0%';
      }
    });

    // 2. Update Panels
    stagePanels.forEach((panel, i) => {
      if (i === stageIdx) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // 3. Stage-specific trigger animations
    if (stageIdx === 0) {
      triggerStage1Typewriter();
    } else if (stageIdx === 1) {
      triggerStage2Counter();
    } else if (stageIdx === 2) {
      triggerStage3Calendar();
    } else if (stageIdx === 3) {
      triggerStage4ScoreRiser();
    }
  }

  // Stage 1: Subtle Character Typing
  function triggerStage1Typewriter() {
    if (!simDomainText) return;
    const targetDomain = sampleDomains[currentDomainIdx % sampleDomains.length];
    currentDomainIdx++;
    simDomainText.textContent = "";
    let charIdx = 0;
    const typeSpeed = 55; // ms per char

    function typeChar() {
      if (currentStage !== 0) return;
      if (charIdx <= targetDomain.length) {
        simDomainText.textContent = targetDomain.substring(0, charIdx);
        charIdx++;
        setTimeout(typeChar, typeSpeed);
      }
    }
    setTimeout(typeChar, 250);
  }

  // Stage 2: Rapid Counter Up
  function triggerStage2Counter() {
    if (!tickerNumEl) return;
    const targetCount = 1248;
    const startTime = performance.now();
    const duration = 2200;

    function countStep(now) {
      if (currentStage !== 1) return;
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * targetCount);
      tickerNumEl.textContent = val.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(countStep);
      }
    }
    requestAnimationFrame(countStep);
  }

  // Stage 3: 30-Day Calendar Step-Through (Day 1 -> Day 2 -> Day 3 -> Day 4)
  function triggerStage3Calendar() {
    const dayPills = [
      document.getElementById('demoCalDay1'),
      document.getElementById('demoCalDay2'),
      document.getElementById('demoCalDay3'),
      document.getElementById('demoCalDay4')
    ];

    dayPills.forEach((p, idx) => {
      if (!p) return;
      p.style.opacity = '0.3';
      p.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (currentStage === 2) {
          p.style.opacity = '1';
          p.style.transform = 'scale(1)';
        }
      }, 100 + idx * 250);
    });
  }

  // Stage 4: Dynamic Score Counter Rising from 68 to 100 & Bar Rise
  function triggerStage4ScoreRiser() {
    const scoreEl = document.getElementById('demoScoreCounter');
    const bars = playerContainer.querySelectorAll('.demo-sg-bar');

    // Animate bars rise
    const targetHeights = ['40%', '46%', '52%', '58%', '66%', '74%', '82%', '90%', '96%', '100%'];
    bars.forEach((bar, idx) => {
      bar.style.height = '6px';
      setTimeout(() => {
        if (currentStage === 3) {
          bar.style.height = targetHeights[idx] || '100%';
        }
      }, 100 + idx * 100);
    });

    if (!scoreEl) return;
    const startScore = 68;
    const targetScore = 100;
    const startTime = performance.now();
    const duration = 2000;

    function countUp(now) {
      if (currentStage !== 3) return;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startScore + (targetScore - startScore) * eased);
      scoreEl.textContent = currentVal;
      if (progress < 1) {
        requestAnimationFrame(countUp);
      }
    }
    requestAnimationFrame(countUp);
  }

  // Main Loop
  function startLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    function loop(now) {
      if (!isPlaying || !isVisible) return;
      const stageDuration = STAGE_DURATIONS[currentStage];
      const elapsed = now - stageStartTime;
      elapsedBeforePause = elapsed;
      const progress = Math.min(elapsed / stageDuration, 1);

      // Update current chapter progress bar
      const activeBtn = chapterButtons[currentStage];
      if (activeBtn) {
        const progressFill = activeBtn.querySelector('.demo-chapter-progress');
        if (progressFill) {
          progressFill.style.width = (progress * 100) + '%';
        }
      }

      if (progress >= 1) {
        // Advance to next stage
        currentStage = (currentStage + 1) % STAGE_DURATIONS.length;
        elapsedBeforePause = 0;
        stageStartTime = performance.now();
        renderStage(currentStage);
      }

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoPlayer);
  } else {
    initDemoPlayer();
  }
})();

