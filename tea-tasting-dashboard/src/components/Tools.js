export const renderTools = () => {
    const container = document.createElement('div');
    container.className = 'grid-layout';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';

    // Timer Section
    const timerCard = document.createElement('div');
    timerCard.className = 'glass-panel';
    timerCard.style.padding = '2rem';
    timerCard.style.textAlign = 'center';
    timerCard.innerHTML = `
    <h3 style="margin-bottom: 1.5rem; color: var(--color-primary-dark);"><i class="fas fa-hourglass-start"></i> Brewing Timer</h3>
    
    <div id="timer-display" style="font-size: 4rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--color-text-main); margin-bottom: 1.5rem;">
      00:00
    </div>
    
    <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem;">
      <button class="btn btn-secondary" data-time="30">30s</button>
      <button class="btn btn-secondary" data-time="60">1m</button>
      <button class="btn btn-secondary" data-time="120">2m</button>
      <button class="btn btn-secondary" data-time="180">3m</button>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem;">
       <input type="number" id="custom-time" placeholder="Secs" style="width: 80px; margin: 0; text-align: center;">
       <button class="btn btn-secondary" id="set-custom">Set</button>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button class="btn" id="start-timer" style="width: 100px;">Start</button>
      <button class="btn btn-secondary" id="reset-timer">Reset</button>
    </div>
  `;

    // Calculator Section
    const calcCard = document.createElement('div');
    calcCard.className = 'glass-panel';
    calcCard.style.padding = '2rem';
    calcCard.innerHTML = `
    <h3 style="margin-bottom: 1.5rem; color: var(--color-primary-dark);"><i class="fas fa-calculator"></i> Ratio Calculator</h3>
    
    <div style="margin-bottom: 1.5rem;">
      <label>Water Volume</label>
      <div style="display: flex; gap: 0.5rem;">
        <input type="number" id="calc-water" value="150" style="margin: 0;">
        <span style="align-self: center;">ml</span>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <label>Ratio (g/ml)</label>
      <select id="calc-ratio" style="margin: 0;">
        <option value="15">1:15 (Gong Fu)</option>
        <option value="20">1:20 (Strong)</option>
        <option value="50">1:50 (Western)</option>
        <option value="100">1:100 (Light)</option>
      </select>
    </div>

    <div style="background: var(--color-primary); color: white; padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
      <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">You need</div>
      <div style="font-size: 2.5rem; font-weight: 600;" id="calc-result">10.0g</div>
      <div style="font-size: 0.9rem; opacity: 0.9;">of tea leaves</div>
    </div>
  `;

    container.appendChild(timerCard);
    container.appendChild(calcCard);

    // Timer Logic
    let interval;
    let timeLeft = 0;
    const display = timerCard.querySelector('#timer-display');
    const startBtn = timerCard.querySelector('#start-timer');
    const updateDisplay = () => {
        const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const secs = (timeLeft % 60).toString().padStart(2, '0');
        display.textContent = `${mins}:${secs}`;
        document.title = timeLeft > 0 ? `(${mins}:${secs}) Tea Timer` : 'Tea Journal';
    };

    timerCard.querySelectorAll('[data-time]').forEach(btn => {
        btn.addEventListener('click', () => {
            stopTimer();
            timeLeft = parseInt(btn.dataset.time);
            updateDisplay();
        });
    });

    timerCard.querySelector('#set-custom').addEventListener('click', () => {
        const val = parseInt(timerCard.querySelector('#custom-time').value);
        if (val > 0) {
            stopTimer();
            timeLeft = val;
            updateDisplay();
        }
    });

    const stopTimer = () => {
        clearInterval(interval);
        interval = null;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('active');
    };

    startBtn.addEventListener('click', () => {
        if (interval) {
            stopTimer();
        } else {
            if (timeLeft === 0) return;
            startBtn.textContent = 'Pause';
            interval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    stopTimer();
                    // Play sound or alert
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple bell sound
                    audio.play().catch(e => console.log('Audio play failed', e));
                    alert('Tea is ready!');
                }
            }, 1000);
        }
    });

    timerCard.querySelector('#reset-timer').addEventListener('click', () => {
        stopTimer();
        timeLeft = 0;
        updateDisplay();
    });

    // Calculator Logic
    const calculate = () => {
        const water = parseFloat(calcCard.querySelector('#calc-water').value) || 0;
        const ratio = parseFloat(calcCard.querySelector('#calc-ratio').value) || 50;
        const result = water / ratio;
        calcCard.querySelector('#calc-result').textContent = `${result.toFixed(1)}g`;
    };

    calcCard.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', calculate);
    });

    // Initial calculation
    calculate();

    return container;
};
