let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

/**
 * Compute remaining time
 * @param seconds
 */
function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);

    const now = Date.now(); // milliseconds
    const then = now + seconds * 1000;

    // first display
    displayTimeLeft(seconds);
    displayEndTime(then);


    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        // check if we should stop it from running
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }

        // display seconds left
        displayTimeLeft(secondsLeft);
    }, 1000);
}

/**
 * Display the time remaining before timer ends
 * @param seconds
 */
function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;

    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;

    // update tab title
    document.title = display;
}

/**
 * Display the hour at which we should come back
 * @param timestamp
 */
function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    endTime.innerText = `Be back at ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

/**
 * Get seconds from HTML and pass it to the timer function
 */
function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

// event listeners
buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(event) {
    // prevent from reloading page on form submit
    event.preventDefault();

    const mins = parseInt(this.minutes.value);
    timer(mins * 60);

    this.reset();
});