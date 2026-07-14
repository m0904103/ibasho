import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const bg = entry.target.querySelector('.bg-image');
        if(bg) {
          bg.style.opacity = '0.7';
          bg.style.transform = 'scale(1.05)';
        }
      } else {
        const bg = entry.target.querySelector('.bg-image');
        if(bg) {
          bg.style.opacity = '0.2';
          bg.style.transform = 'scale(1)';
        }
      }
    });
  }, observerOptions);

  const slides = document.querySelectorAll('.slide');
  slides.forEach(el => {
    const bg = el.querySelector('.bg-image');
    if(bg) bg.style.transition = 'opacity 2s ease, transform 10s ease';
    observer.observe(el);
  });

  // Audio Player Logic
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play-btn');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.getElementById('progress');
  const timeDisplay = document.getElementById('time');
  const autoScrollBtn = document.getElementById('auto-scroll-btn');

  let isAutoScrollEnabled = true;
  let hasUserScrolled = false;
  let currentActiveSlideIndex = 0;

  // Auto Scroll Toggle
  autoScrollBtn.addEventListener('click', () => {
    isAutoScrollEnabled = !isAutoScrollEnabled;
    autoScrollBtn.classList.toggle('active', isAutoScrollEnabled);
    if(isAutoScrollEnabled) {
       hasUserScrolled = false; // Force resume
       currentActiveSlideIndex = -1; // Force immediate scroll update
    }
  });

  // Removed oversensitive manual scroll detection on mobile

  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`;
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(e => console.error("Playback failed:", e));
      playBtn.textContent = '⏸';
      hasUserScrolled = false; 
      currentActiveSlideIndex = -1; // Trigger scroll to current section immediately
    } else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const percent = audio.currentTime / audio.duration;
      
      progress.style.width = `${percent * 100}%`;
      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

      // Precise thresholds extracted via Whisper AI speech recognition (16 slides)
      let targetSlideIndex = 0;
      if (percent >= 0.932) targetSlideIndex = 15;
      else if (percent >= 0.899) targetSlideIndex = 14;
      else if (percent >= 0.841) targetSlideIndex = 13;
      else if (percent >= 0.815) targetSlideIndex = 12;
      else if (percent >= 0.757) targetSlideIndex = 11;
      else if (percent >= 0.710) targetSlideIndex = 10;
      else if (percent >= 0.666) targetSlideIndex = 9;
      else if (percent >= 0.640) targetSlideIndex = 8;
      else if (percent >= 0.595) targetSlideIndex = 7;
      else if (percent >= 0.544) targetSlideIndex = 6;
      else if (percent >= 0.417) targetSlideIndex = 5;
      else if (percent >= 0.349) targetSlideIndex = 4;
      else if (percent >= 0.272) targetSlideIndex = 3;
      else if (percent >= 0.188) targetSlideIndex = 2;
      else if (percent >= 0.134) targetSlideIndex = 1;

      if (isAutoScrollEnabled) {
        if (targetSlideIndex !== currentActiveSlideIndex) {
          slides[targetSlideIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
          currentActiveSlideIndex = targetSlideIndex;
        }
      }
    }
  });

  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
    hasUserScrolled = false;
    currentActiveSlideIndex = -1;
  });
  
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    progress.style.width = '0%';
    audio.currentTime = 0;
    currentActiveSlideIndex = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
