const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const focusTimeInput = document.getElementById('focus-time');
const breakTimeInput = document.getElementById('break-time');
const loopCountInput = document.getElementById('loop-count');

let countdown;
let timer;
let isPaused = false;
let isBreak = false;
let currentLoop = 0;

function startTimer() {
    if (countdown) {
        return;
    }

    const focusTime = focusTimeInput.value * 60;
    const breakTime = breakTimeInput.value * 60;

    if (isPaused) {
        isPaused = false;
    } else {
        timer = isBreak ? breakTime : focusTime;
    }

    document.body.style.backgroundColor = isBreak ? '#4CAF50' : '#333';

    countdown = setInterval(() => {
        timer--;
        updateDisplay(timer);

        if (timer <= 0) {
            clearInterval(countdown);
            countdown = null;

            if (isBreak) {
                // A full cycle (focus + break) has completed.
                currentLoop++;
                const totalLoops = loopCountInput.value;
                if (currentLoop >= totalLoops) {
                    alert("Pomodoro session(s) complete!");
                    resetTimer();
                    return;
                }
            }

            isBreak = !isBreak;
            new Audio('https://www.soundjay.com/buttons/beep-07.wav').play();
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (countdown) {
        clearInterval(countdown);
        countdown = null;
        isPaused = true;
    }
}

function resetTimer() {
    clearInterval(countdown);
    countdown = null;
    isPaused = false;
    isBreak = false;
    currentLoop = 0;
    timer = focusTimeInput.value * 60;
    updateDisplay(timer);
    document.body.style.backgroundColor = '#333';
}

function updateDisplay(time) {
    if (time < 0) time = 0;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
focusTimeInput.addEventListener('change', () => {
    if (!countdown) {
        updateDisplay(focusTimeInput.value * 60);
    }
});
breakTimeInput.addEventListener('change', () => {
    // No action needed on change, will be used when break starts
});

updateDisplay(focusTimeInput.value * 60);
