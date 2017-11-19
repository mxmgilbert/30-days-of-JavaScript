const player = document.querySelector('.player');
const video = player.querySelector('video');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('.full-screen');


/**
 * Play/pause the video
 */
function togglePlay() {
    video.paused ? video.play() : video.pause();
}

/**
 * Update play/pause button depending on video state
 */
function updatePlayButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

/**
 * Allow to move forward/backward few seconds
 */
function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

/**
 * Handle behaviour for volume and playback rate
 */
function handleRangeUpdate() {
    video[this.name] = this.value;
}

/**
 * Progress bar behaviour ofr following video progress
 */
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(event) {
    const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function handleFullscreen() {
    video.webkitRequestFullscreen();
}

let mousedown = false;

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

video.addEventListener('timeupdate', handleProgress);

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (event) => {
    mousedown && scrub(event)
});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullScreen.addEventListener('click', handleFullscreen);
