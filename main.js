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
          bg.style.opacity = entry.target.id === 'gears-slide' ? '1.0' : '0.7';
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

  const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bg = entry.target.querySelector('.bg-image');
        if (bg && bg.dataset.bg) {
          bg.style.backgroundImage = `url('${bg.dataset.bg}')`;
          bg.removeAttribute('data-bg');
        }
      }
    });
  }, { rootMargin: '1500px 0px', threshold: 0 });

  const slides = document.querySelectorAll('.slide');
  slides.forEach(el => {
    const bg = el.querySelector('.bg-image');
    if(bg) bg.style.transition = 'opacity 2s ease, transform 10s ease';
    observer.observe(el);
    lazyLoadObserver.observe(el);
  });

  // Falling leaves animation
  function initLeaves() {
    const container = document.getElementById('leaves-container');
    if (!container) return;
    for (let i = 0; i < 35; i++) {
      const leaf = document.createElement('div');
      leaf.classList.add('leaf');
      leaf.style.left = `${Math.random() * 100}%`;
      const fallDuration = 15 + Math.random() * 20; 
      const swayDuration = 3 + Math.random() * 4; 
      const delay = Math.random() * 20; 
      leaf.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
      leaf.style.animationDelay = `${delay}s, 0s`;
      const scale = 0.5 + Math.random() * 1.5;
      leaf.style.transform = `scale(${scale})`;
      const colorRand = Math.random();
      if(colorRand > 0.7) leaf.style.background = 'rgba(139, 69, 19, 0.4)';
      else if(colorRand > 0.4) leaf.style.background = 'rgba(160, 82, 45, 0.4)';
      container.appendChild(leaf);
    }
  }
  initLeaves();

  // Audio Player Logic with Chapter Tracking
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play-btn');
  const seekBar = document.getElementById('seek-bar');
  const chapterDisplay = document.getElementById('chapter-display');
  const timeDisplay = document.getElementById('time');

  let currentActiveSlideIndex = 0;
  let isDragging = false;

  const chapters = [
    { percent: 0.000, title: '開場：人生100' },
    { percent: 0.094, title: '壽命中位數 107 歲' },
    { percent: 0.183, title: '伊斯特林悖論' },
    { percent: 0.245, title: '保羅朗格蘭：終身教育' },
    { percent: 0.280, title: '回流教育的侷限' },
    { percent: 0.321, title: '學校如圓形監獄' },
    { percent: 0.351, title: '匿名性ベースの社会' },
    { percent: 0.417, title: 'AAR 的做法' },
    { percent: 0.544, title: '共感 Compassion' },
    { percent: 0.595, title: '關懷下一代 Generativity' },
    { percent: 0.640, title: '老年期超越' },
    { percent: 0.666, title: '動態拼圖模式' },
    { percent: 0.710, title: '陪伴與留白' },
    { percent: 0.747, title: '孤食' },
    { percent: 0.783, title: '社會處方箋' },
    { percent: 0.806, title: '住み開き' },
    { percent: 0.834, title: '出番 (出場舞台)' },
    { percent: 0.873, title: '恩送 Pay It Forward' },
    { percent: 0.908, title: '軟著陸' },
    { percent: 0.932, title: '學習的甜甜圈' },
    { percent: 0.985, title: '終章：幸福人生 頑張って' }
  ];

  function getChapterByPercent(percent) {
    let currentChapter = chapters[0];
    for (let i = 0; i < chapters.length; i++) {
      if (percent >= chapters[i].percent) {
        currentChapter = chapters[i];
      } else {
        break;
      }
    }
    return currentChapter;
  }

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
      currentActiveSlideIndex = -1;
    } else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    
    const percent = audio.currentTime / audio.duration;
    
    if (!isDragging) {
      seekBar.value = percent * 100;
      const currentChapter = getChapterByPercent(percent);
      chapterDisplay.textContent = `章節：${currentChapter.title}`;
    }
    
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

    // Auto scroll logic
    let targetSlideIndex = 0;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (percent >= chapters[i].percent) {
        targetSlideIndex = i;
        break;
      }
    }

    if (targetSlideIndex !== currentActiveSlideIndex) {
      slides[targetSlideIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentActiveSlideIndex = targetSlideIndex;
      
      const leavesContainer = document.getElementById('leaves-container');
      if (leavesContainer) {
        leavesContainer.style.opacity = targetSlideIndex === 0 ? '1' : '0';
      }
    }
  });

  // Range slider interaction
  seekBar.addEventListener('input', (e) => {
    isDragging = true;
    const percent = e.target.value / 100;
    const hoverChapter = getChapterByPercent(percent);
    chapterDisplay.textContent = `跳轉至：${hoverChapter.title}`;
  });

  seekBar.addEventListener('change', (e) => {
    isDragging = false;
    const percent = e.target.value / 100;
    audio.currentTime = percent * audio.duration;
    currentActiveSlideIndex = -1;
  });
  
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
  });
});
