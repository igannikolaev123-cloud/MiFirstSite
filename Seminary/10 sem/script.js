// Массив операций загружается из файла data.json.
let transactions = [];

// Поле и направление сортировки.
let sortField = "date";
let sortDirection = "desc";

// Получаем элементы страницы.
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");
const resetButton = document.getElementById("resetButton");
const transactionsBody = document.getElementById("transactionsBody");
const statusMessage = document.getElementById("statusMessage");

const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const balanceTotal = document.getElementById("balanceTotal");
const operationsTotal = document.getElementById("operationsTotal");

// Форматируем сумму в рублях.
function formatMoney(value) {
    return new Intl.NumberFormat("ru-RU", {
        maximumFractionDigits: 0
    }).format(value) + " ₽";
}

// Преобразуем дату из YYYY-MM-DD в DD.MM.YYYY.
function formatDate(date) {
    const parts = date.split("-");
    return parts[2] + "." + parts[1] + "." + parts[0];
}

// Получаем название типа операции на русском языке.
function getTypeName(type) {
    return type === "income" ? "Доход" : "Расход";
}

// Заполняем список категорий значениями из JSON.
function fillCategories() {
    const categories = [...new Set(transactions.map(item => item.category))];
    categories.sort((a, b) => a.localeCompare(b, "ru"));

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Устанавливаем начальный диапазон дат по данным файла.
function setDateRange() {
    const dates = transactions.map(item => item.date).sort();
    dateFrom.min = dates[0];
    dateFrom.max = dates[dates.length - 1];
    dateTo.min = dates[0];
    dateTo.max = dates[dates.length - 1];
    dateFrom.value = dates[0];
    dateTo.value = dates[dates.length - 1];
}

// Возвращаем операции, которые подходят под выбранные фильтры.
function getFilteredTransactions() {
    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;
    const from = dateFrom.value;
    const to = dateTo.value;

    return transactions.filter(item => {
        const typeMatches = selectedType === "all" || item.type === selectedType;
        const categoryMatches = selectedCategory === "all" || item.category === selectedCategory;
        const fromMatches = from === "" || item.date >= from;
        const toMatches = to === "" || item.date <= to;

        return typeMatches && categoryMatches && fromMatches && toMatches;
    });
}

// Сортируем операции по выбранному столбцу.
function sortTransactions(items) {
    const sortedItems = [...items];

    sortedItems.sort((a, b) => {
        let first = a[sortField];
        let second = b[sortField];

        if (sortField === "amount") {
            first = Number(first);
            second = Number(second);
            return sortDirection === "asc" ? first - second : second - first;
        }

        if (sortField === "type") {
            first = getTypeName(first);
            second = getTypeName(second);
        }

        const result = String(first).localeCompare(String(second), "ru");
        return sortDirection === "asc" ? result : -result;
    });

    return sortedItems;
}

// Обновляем стрелки возле названий столбцов.
function updateSortButtons() {
    const buttons = document.querySelectorAll(".sort-button");

    buttons.forEach(button => {
        const field = button.dataset.sort;
        const names = {
            date: "Дата",
            type: "Тип",
            category: "Категория",
            description: "Описание",
            amount: "Сумма"
        };

        if (field === sortField) {
            button.textContent = names[field] + (sortDirection === "asc" ? " ▲" : " ▼");
        } else {
            button.textContent = names[field];
        }
    });
}

// Показываем операции в таблице.
function renderTable(items) {
    transactionsBody.replaceChildren();

    if (items.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "empty-row";
        cell.textContent = "По выбранным фильтрам операций не найдено";
        row.appendChild(cell);
        transactionsBody.appendChild(row);
        return;
    }

    items.forEach(item => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(item.date);

        const typeCell = document.createElement("td");
        typeCell.textContent = getTypeName(item.type);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = item.category;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.description;

        const amountCell = document.createElement("td");
        if (item.type === "income") {
            amountCell.textContent = "+ " + formatMoney(item.amount);
            amountCell.className = "amount-income";
        } else {
            amountCell.textContent = "− " + formatMoney(item.amount);
            amountCell.className = "amount-expense";
        }

        row.append(dateCell, typeCell, categoryCell, descriptionCell, amountCell);
        transactionsBody.appendChild(row);
    });
}

// Пересчитываем доходы, расходы и баланс для отображаемых операций.
function renderSummary(items) {
    let income = 0;
    let expenses = 0;

    items.forEach(item => {
        if (item.type === "income") {
            income += Number(item.amount);
        } else if (item.type === "expense") {
            expenses += Number(item.amount);
        }
    });

    const balance = income - expenses;

    incomeTotal.textContent = formatMoney(income);
    expenseTotal.textContent = formatMoney(expenses);
    balanceTotal.textContent = formatMoney(balance);
    balanceTotal.className = balance >= 0 ? "income-text" : "expense-text";
    operationsTotal.textContent = items.length;
}

// Обновляем таблицу, итоги и подписи сортировки.
function updatePage() {
    const filteredItems = getFilteredTransactions();
    const sortedItems = sortTransactions(filteredItems);

    renderTable(sortedItems);
    renderSummary(filteredItems);
    updateSortButtons();

    statusMessage.className = "status-message";
    statusMessage.textContent = "Показано операций: " + filteredItems.length + " из " + transactions.length;
}

// Загружаем JSON-файл при открытии страницы.
async function loadData() {
    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Не удалось загрузить data.json. Код ответа: " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("В файле data.json должен находиться массив операций.");
        }

        transactions = data;
        fillCategories();
        setDateRange();
        updatePage();
    } catch (error) {
        transactionsBody.innerHTML = "<tr><td class=\"empty-row\" colspan=\"5\">Не удалось загрузить данные</td></tr>";
        statusMessage.className = "status-message error";
        statusMessage.textContent = error.message + " Запустите сервер из папки проекта командой: python -m http.server 8000";
    }
}

// При изменении фильтров обновляем страницу.
typeFilter.addEventListener("change", updatePage);
categoryFilter.addEventListener("change", updatePage);
dateFrom.addEventListener("change", updatePage);
dateTo.addEventListener("change", updatePage);

// Кнопка сброса возвращает все фильтры к исходным значениям.
resetButton.addEventListener("click", () => {
    typeFilter.value = "all";
    categoryFilter.value = "all";
    setDateRange();
    updatePage();
});

// Нажатие на заголовок таблицы меняет поле или направление сортировки.
document.querySelectorAll(".sort-button").forEach(button => {
    button.addEventListener("click", () => {
        const selectedField = button.dataset.sort;

        if (sortField === selectedField) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortField = selectedField;
            sortDirection = "asc";
        }

        updatePage();
    });
});

loadData();
