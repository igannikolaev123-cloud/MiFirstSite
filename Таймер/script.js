window.onload = function () {
    const currentTime = document.getElementById("currentTime");
    const setTimerButton = document.getElementById("setTimerButton");
    const countdown = document.getElementById("countdown");
    const timerModal = document.getElementById("timerModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const startButton = document.getElementById("startButton");
    const secondsInput = document.getElementById("secondsInput");
    const inputHint = document.getElementById("inputHint");

    let clockInterval = null;
    let countdownInterval = null;
    let secondsLeft = 0;

    // Показывает локальное время компьютера.
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        currentTime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Переводит количество секунд в формат ЧЧ:ММ:СС.
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function openModal() {
        if (!timerModal.classList.contains("is-open")) {
            timerModal.classList.add("is-open");
        }
        timerModal.setAttribute("aria-hidden", "false");
        inputHint.textContent = "Введите число от 0 до 9999";
        inputHint.style.color = "";
        secondsInput.value = "";

        // Небольшая задержка нужна, чтобы поле успело появиться на экране.
        setTimeout(function () {
            secondsInput.focus();
        }, 100);
    }

    function closeModal() {
        timerModal.classList.remove("is-open");
        timerModal.setAttribute("aria-hidden", "true");
    }

    function resetTimer() {
        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        secondsLeft = 0;
        countdown.hidden = true;
        countdown.textContent = "00:00:00";
        setTimerButton.hidden = false;
        setTimerButton.classList.remove("is-hidden");
        updateClock();
    }

    function finishTimer() {
        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        alert("Таймер завершён!");
        resetTimer();
    }

    function startTimer() {
        // Удаляем все символы, кроме цифр, и проверяем введённое значение.
        secondsInput.value = secondsInput.value.replace(/\D/g, "").slice(0, 4);

        if (secondsInput.value === "") {
            inputHint.textContent = "Введите число от 0 до 9999";
            inputHint.style.color = "#ff777d";
            secondsInput.focus();
            return;
        }

        const enteredSeconds = parseInt(secondsInput.value, 10);

        if (enteredSeconds < 0 || enteredSeconds > 9999 || Number.isNaN(enteredSeconds)) {
            inputHint.textContent = "Можно ввести только число от 0 до 9999";
            inputHint.style.color = "#ff777d";
            secondsInput.focus();
            return;
        }

        closeModal();
        secondsLeft = enteredSeconds;
        countdown.textContent = formatTime(secondsLeft);
        countdown.hidden = false;
        setTimerButton.hidden = true;
        setTimerButton.classList.add("is-hidden");

        if (secondsLeft === 0) {
            finishTimer();
            return;
        }

        countdownInterval = setInterval(function () {
            secondsLeft--;
            countdown.textContent = formatTime(secondsLeft);

            if (secondsLeft <= 0) {
                finishTimer();
            }
        }, 1000);
    }

    // В поле можно вводить только цифры.
    secondsInput.addEventListener("input", function () {
        const oldValue = secondsInput.value;
        secondsInput.value = oldValue.replace(/\D/g, "").slice(0, 4);

        if (secondsInput.value !== oldValue) {
            inputHint.textContent = "Допускаются только цифры от 0 до 9999";
            inputHint.style.color = "#ffcc66";
        } else {
            inputHint.textContent = "Введите число от 0 до 9999";
            inputHint.style.color = "";
        }
    });

    setTimerButton.addEventListener("click", openModal);
    closeModalButton.addEventListener("click", closeModal);
    startButton.addEventListener("click", startTimer);

    // Закрытие окна нажатием на затемнённую область.
    timerModal.addEventListener("click", function (event) {
        if (event.target === timerModal) {
            closeModal();
        }
    });

    // Клавиша Escape закрывает модальное окно.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && timerModal.classList.contains("is-open")) {
            closeModal();
        }
    });

    updateClock();
    clockInterval = setInterval(updateClock, 1000);
};
