let currentQuestion = 1;
let selectedOptions = {};
let banCursorTimeout = null;
let isPlaying = false;
let noEscapeCount = 0;
let hasVisitedIntro = sessionStorage.getItem('spiderIntroVisited');
const RESPONSE_STORAGE_KEY = 'spiderVerseQuizResponses';
const VIDEO_URL = 'assets/spiderverse-video.mp4';
const GWEN_QUOTE_VIDEO = 'assets/gwen-quote.mp4';
const SPIDER_NO_LINES = [
    'Spider-Sense says that No was a canon event cancellation attempt.',
    'Miles just swung off with that button before you could click it.',
    'Peter B. Parker dropped the No button in another dimension.',
    'Gwen muted that choice with one eyebrow raise.',
    'Miguel has flagged No as an unstable anomaly.',
    'The web-shooters jam every time somebody reaches for No.',
    'That click bounced off the multiverse like a bad aim from The Spot.'
];

document.addEventListener('DOMContentLoaded', () => {
    createSparkles();
    createPetals();
    createFloatingEmojis();
    initializeVibeMeter();
    initializeFakeOptions();
    initializeMediaState();
    initializeVideoPlayer();
    initializeIntroSlide();
    renderResponses();
});

function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    if (!sparklesContainer) return;

    for (let i = 0; i < 40; i += 1) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 3}s`;
        sparkle.style.animationDuration = `${2 + Math.random() * 2}s`;
        sparklesContainer.appendChild(sparkle);
    }
}

function createPetals() {
    const petalsContainer = document.getElementById('petals');
    if (!petalsContainer) return;

    const labels = ['WEB', 'BAM', 'THWIP', 'POW', 'ZAP'];
    for (let i = 0; i < 18; i += 1) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = labels[i % labels.length];
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDelay = `${Math.random() * 10}s`;
        petal.style.animationDuration = `${10 + Math.random() * 10}s`;
        petalsContainer.appendChild(petal);
    }
}

function createFloatingEmojis() {
    const emojisContainer = document.getElementById('floatingEmojis');
    if (!emojisContainer) return;

    const labels = ['SPDR', 'WEB', '1610', 'THWIP', 'BAM', 'GLOW'];
    for (let i = 0; i < 12; i += 1) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = labels[Math.floor(Math.random() * labels.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.animationDelay = `${Math.random() * 12}s`;
        emoji.style.animationDuration = `${16 + Math.random() * 8}s`;
        emojisContainer.appendChild(emoji);
    }
}

function initializeVibeMeter() {
    const vibeMeter = document.getElementById('vibeMeter');
    if (!vibeMeter || vibeMeter.children.length) return;

    for (let i = 0; i < 5; i += 1) {
        const segment = document.createElement('div');
        segment.className = 'vibe-segment';
        vibeMeter.appendChild(segment);
    }
}

function initializeFakeOptions() {
    document.querySelectorAll('.fake-option').forEach((button) => {
        button.setAttribute('type', 'button');
    });
}

function initializeIntroSlide() {
    const introSlide = document.getElementById('introSlide');
    if (!introSlide) return;

    // Show intro only on first visit (session-based)
    if (hasVisitedIntro) {
        introSlide.classList.add('hidden');
        setTimeout(() => introSlide.style.display = 'none', 800);
    }
}

function proceedToIntroEnd() {
    const introSlide = document.getElementById('introSlide');
    if (!introSlide) return;

    // Mark as visited for this session
    sessionStorage.setItem('spiderIntroVisited', 'true');
    hasVisitedIntro = true;

    // Hide intro slide
    introSlide.classList.add('hidden');
    setTimeout(() => {
        introSlide.style.display = 'none';
        // Scroll to quiz start
        const quizStart = document.getElementById('quizStart');
        if (quizStart) {
            quizStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 800);
}

function updateVibeMeter(questionNum) {
    const vibeMeter = document.getElementById('vibeMeter');
    const meterText = document.getElementById('vibeMeterText');
    if (!vibeMeter) return;

    const segments = vibeMeter.querySelectorAll('.vibe-segment');
    const activeSegments = Math.min(questionNum, segments.length);

    segments.forEach((segment, index) => {
        segment.classList.toggle('active', index < activeSegments);
    });

    if (meterText) {
        meterText.textContent = questionNum >= 4
            ? 'Final timeline unlocked.'
            : `Question ${questionNum} of 4 in progress.`;
    }
}

function resetVibeMeter() {
    const vibeMeter = document.getElementById('vibeMeter');
    const meterText = document.getElementById('vibeMeterText');
    if (!vibeMeter) return;

    vibeMeter.querySelectorAll('.vibe-segment').forEach((segment) => {
        segment.classList.remove('active');
    });

    if (meterText) meterText.textContent = 'Scroll down and start the quiz.';
}

function selectOption(questionNum, optionNum, event) {
    if (!event) event = window.event;

    selectedOptions[questionNum] = optionNum;

    document.querySelectorAll(`#q${questionNum} .option-btn`).forEach((btn, index) => {
        btn.classList.toggle('selected', index + 1 === optionNum);
    });

    if (event && event.clientX) {
        createClickSparkles(event);
    }

    updateVibeMeter(questionNum);

    if (questionNum === 4) {
        setTimeout(() => nextQuestion('messageBox'), 350);
        return;
    }

    setTimeout(() => nextQuestion(questionNum + 1), 350);
}

function nextQuestion(questionNum) {
    const currentId = typeof currentQuestion === 'number' ? `q${currentQuestion}` : currentQuestion;
    const currentEl = document.getElementById(currentId);
    if (currentEl) currentEl.classList.add('hidden');

    currentQuestion = questionNum;

    const nextId = typeof questionNum === 'number' ? `q${questionNum}` : questionNum;
    const nextCard = document.getElementById(nextId);
    if (nextCard) nextCard.classList.remove('hidden');

    // Show Gwen quote video when reaching question 4
    if (questionNum === 4) {
        showGwenQuote();
    }
}

function showGwenQuote() {
    const gwenQuoteContainer = document.getElementById('gwenQuoteContainer');
    const gwenQuoteVideo = document.getElementById('gwenQuoteVideo');

    if (gwenQuoteContainer) {
        gwenQuoteContainer.classList.remove('hidden');
    }

    if (gwenQuoteVideo) {
        gwenQuoteVideo.muted = false;
        gwenQuoteVideo.play().catch(() => {
            // Auto-play might be blocked, user needs to interact first
            gwenQuoteVideo.muted = true;
            gwenQuoteVideo.play().catch(() => {});
        });
    }
}

function sendMessage() {
    const q4Answer = selectedOptions[4];
    const messageInput = document.getElementById('userMessage');
    const message = messageInput ? messageInput.value.trim() : '';

    saveResponse(message);

    if (message) {
        showResultWithMessage(q4Answer, message);
    } else {
        showResult(q4Answer);
    }
}

function showResult(answer) {
    renderResult(answer, '');
}

function showResultWithMessage(answer, message) {
    renderResult(answer, message);
}

function renderResult(answer, message) {
    const messageBox = document.getElementById('messageBox');
    const resultCard = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const resultDescription = document.getElementById('resultDescription');
    const vibeCrown = document.getElementById('vibeCrown');
    const quoteText = document.getElementById('quoteText');

    if (messageBox) messageBox.classList.add('hidden');
    if (resultCard) resultCard.classList.remove('hidden');

    const safeMessage = message ? `<p><strong>Your message:</strong> "${escapeHtml(message)}"</p>` : '';

    if (answer === 1) {
        if (vibeCrown) vibeCrown.textContent = 'YES';
        if (resultText) resultText.textContent = 'Certified Main Character';
        if (resultDescription) {
            resultDescription.innerHTML = `
                <p>You picked the bold timeline.</p>
                <p>Good taste, good vibes, and absolutely dangerous chemistry.</p>
                ${safeMessage}
            `;
        }
        if (quoteText) quoteText.textContent = 'Some decisions do not need a committee. This was one of them.';
    } else {
        if (vibeCrown) vibeCrown.textContent = 'OK';
        if (resultText) resultText.textContent = 'Friendly Neighborhood Menace';
        if (resultDescription) {
            resultDescription.innerHTML = `
                <p>No hard feelings. The multiverse is still stable.</p>
                <p>You chose distance, mystery, and maybe a little emotional acrobatics.</p>
                ${safeMessage}
            `;
        }
        if (quoteText) quoteText.textContent = 'Not every door closes forever. Some just need better timing.';
    }
}

function restartQuiz() {
    currentQuestion = 1;
    selectedOptions = {};
    noEscapeCount = 0;

    ['q1', 'q2', 'q3', 'q4', 'messageBox', 'result'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const q1 = document.getElementById('q1');
    if (q1) q1.classList.remove('hidden');

    document.querySelectorAll('.question-card .option-btn').forEach((btn) => {
        btn.classList.remove('selected', 'is-rejected');
        btn.style.transform = '';
    });

    const messageInput = document.getElementById('userMessage');
    if (messageInput) messageInput.value = '';

    const tooltip = document.getElementById('banTooltip');
    if (tooltip) tooltip.classList.remove('visible');
    const noJokeBox = document.getElementById('noJokeBox');
    if (noJokeBox) {
        noJokeBox.classList.add('hidden');
        noJokeBox.textContent = '';
    }

    // Hide Gwen quote container and pause video
    const gwenQuoteContainer = document.getElementById('gwenQuoteContainer');
    const gwenQuoteVideo = document.getElementById('gwenQuoteVideo');
    if (gwenQuoteContainer) gwenQuoteContainer.classList.add('hidden');
    if (gwenQuoteVideo) {
        gwenQuoteVideo.pause();
        gwenQuoteVideo.currentTime = 0;
    }

    document.body.classList.remove('show-ban-cursor');
    resetVibeMeter();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showBan(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const clickedButton = event ? event.currentTarget : null;
    const tooltip = document.getElementById('banTooltip');

    document.body.classList.add('show-ban-cursor');

    if (clickedButton) {
        clickedButton.classList.add('is-rejected');
        setTimeout(() => clickedButton.classList.remove('is-rejected'), 320);
    }

    if (tooltip && event) {
        tooltip.style.left = `${(event.clientX || 0) + 12}px`;
        tooltip.style.top = `${(event.clientY || 0) + 12}px`;
        tooltip.classList.add('visible');

        clearTimeout(showBan.hideTimeout);
        showBan.hideTimeout = setTimeout(() => {
            tooltip.classList.remove('visible');
        }, 1000);
    }

    clearTimeout(banCursorTimeout);
    banCursorTimeout = setTimeout(() => {
        document.body.classList.remove('show-ban-cursor');
    }, 650);
}

function createClickSparkles(event) {
    for (let i = 0; i < 10; i += 1) {
        const sparkle = document.createElement('div');
        sparkle.className = 'click-sparkle';
        sparkle.style.left = `${event.clientX}px`;
        sparkle.style.top = `${event.clientY}px`;
        sparkle.style.setProperty('--tx', `${(Math.random() - 0.5) * 140}px`);
        sparkle.style.setProperty('--ty', `${(Math.random() - 0.5) * 140}px`);
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }
}

function moveNoButton(button) {
    if (!button) return;

    const parent = button.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const maxX = Math.max(parentRect.width - buttonRect.width, 0);
    const maxY = Math.max(parentRect.height - buttonRect.height, 0);
    const offsetX = buttonRect.left - parentRect.left;
    const offsetY = buttonRect.top - parentRect.top;
    const nextX = Math.random() * maxX - offsetX;
    const nextY = Math.random() * maxY - offsetY;

    button.style.transform = `translate(${nextX}px, ${nextY}px)`;
}

function rejectNo(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const button = event ? event.currentTarget : document.getElementById('noBtn');
    noEscapeCount += 1;

    if (button) {
        button.classList.add('is-rejected');
        moveNoButton(button);
        setTimeout(() => button.classList.remove('is-rejected'), 320);
    }

    const jokeBox = document.getElementById('noJokeBox');
    if (jokeBox) {
        jokeBox.textContent = SPIDER_NO_LINES[(noEscapeCount - 1) % SPIDER_NO_LINES.length];
        jokeBox.classList.remove('hidden');
    }
}

function scrollToQuiz() {
    const quizStart = document.getElementById('quizStart');
    if (quizStart) {
        quizStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initializeMediaState() {
    const videoNote = document.getElementById('videoNote');
    updateMusicUi(false, 'Tap play for sound');
    if (videoNote) {
        videoNote.textContent = 'This page now uses the downloaded local video file, so the in-page video and audio will work without YouTube embed errors.';
    }
}

function initializeVideoPlayer() {
    const bgVideo = document.getElementById('bgVideo');
    if (!bgVideo) return;

    bgVideo.muted = true;
    bgVideo.volume = 1;

    const playAttempt = bgVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {
            updateMusicUi(false, 'Tap play to start video');
        });
    }

    bgVideo.addEventListener('play', () => {
        isPlaying = !bgVideo.muted;
        updateMusicUi(isPlaying, isPlaying ? 'Sound on' : 'Video only');
    });

    bgVideo.addEventListener('pause', () => {
        isPlaying = false;
        updateMusicUi(false, 'Paused');
    });

    bgVideo.addEventListener('ended', () => {
        bgVideo.currentTime = 0;
        bgVideo.play().catch(() => {
            updateMusicUi(false, 'Tap play to restart');
        });
    });
}

function updateMusicUi(playing, label) {
    const playBtn = document.getElementById('playBtn');
    const musicStatus = document.getElementById('musicStatus');
    const musicPlayer = document.getElementById('musicPlayer');

    if (playBtn) {
        playBtn.textContent = playing ? 'Pause' : 'Play';
        playBtn.classList.toggle('playing', playing);
    }

    if (musicPlayer) musicPlayer.classList.toggle('is-live', playing);
    if (musicStatus && label) musicStatus.textContent = label;
}

function startPlayback() {
    const bgVideo = document.getElementById('bgVideo');
    if (!bgVideo) return;

    bgVideo.muted = false;
    bgVideo.play()
        .then(() => {
            isPlaying = true;
            updateMusicUi(true, 'Sound on');
        })
        .catch(() => {
            updateMusicUi(false, 'Click page then press play');
        });
}

function pausePlayback() {
    const bgVideo = document.getElementById('bgVideo');
    if (!bgVideo) return;

    bgVideo.pause();
    bgVideo.muted = true;
    isPlaying = false;
    updateMusicUi(false, 'Paused');
}

function toggleMusic() {
    if (isPlaying) {
        pausePlayback();
    } else {
        startPlayback();
    }
}

function getSavedResponses() {
    try {
        const raw = window.localStorage.getItem(RESPONSE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

function saveResponse(message) {
    const entry = {
        id: Date.now(),
        submittedAt: new Date().toLocaleString(),
        answers: {
            q1: selectedOptions[1] || null,
            q2: selectedOptions[2] || null,
            q3: selectedOptions[3] || null,
            q4: selectedOptions[4] || null
        },
        message: message || ''
    };

    const responses = getSavedResponses();
    responses.unshift(entry);
    window.localStorage.setItem(RESPONSE_STORAGE_KEY, JSON.stringify(responses));
    renderResponses();
}

function renderResponses() {
    const responseList = document.getElementById('responseList');
    const responseCount = document.getElementById('responseCount');
    if (!responseList || !responseCount) return;

    const responses = getSavedResponses();
    responseCount.textContent = `${responses.length} saved response${responses.length === 1 ? '' : 's'}`;

    if (!responses.length) {
        responseList.innerHTML = '<p class="empty-responses">No responses yet. Once someone finishes the quiz, they will show up here.</p>';
        return;
    }

    responseList.innerHTML = responses.map((response) => `
        <article class="response-card">
            <div class="response-card-top">
                <strong>${escapeHtml(response.submittedAt)}</strong>
                <span>ID ${response.id}</span>
            </div>
            <p><strong>Q1:</strong> ${formatAnswer(response.answers.q1)}</p>
            <p><strong>Q2:</strong> ${formatAnswer(response.answers.q2)}</p>
            <p><strong>Q3:</strong> ${formatAnswer(response.answers.q3)}</p>
            <p><strong>Q4:</strong> ${formatAnswer(response.answers.q4)}</p>
            <p><strong>Message:</strong> ${response.message ? escapeHtml(response.message) : 'No message left.'}</p>
        </article>
    `).join('');
}

function formatAnswer(value) {
    if (value === null || value === undefined) return 'Skipped';
    return `Option ${value}`;
}

function exportResponses() {
    const responses = getSavedResponses();
    const blob = new Blob([JSON.stringify(responses, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spider-verse-responses.json';
    link.click();
    URL.revokeObjectURL(url);
}

function clearResponses() {
    window.localStorage.removeItem(RESPONSE_STORAGE_KEY);
    renderResponses();
}
