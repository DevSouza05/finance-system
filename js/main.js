"use strict";

document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const tbody = document.querySelector("tbody");
    const descItem = document.querySelector("#desc");
    const amount = document.querySelector("#amount");
    const type = document.querySelector("#type");
    const btnNew = document.querySelector("#btnNew");
    const monthSelect = document.querySelector("#monthSelect");

    const incomes = document.querySelector(".incomes");
    const expenses = document.querySelector(".expenses");
    const total = document.querySelector(".total");

    let data = await getFinanceData();

    async function getFinanceData() {
        const response = await fetch('/api/data', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            // If the token is invalid, redirect to login
            window.location.href = '/login.html';
            return {};
        }
    }

    async function setFinanceData() {
        await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }

    function getCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    function populateMonthSelect() {
        const months = Object.keys(data).sort().reverse();
        monthSelect.innerHTML = "";
        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
    }

    btnNew.onclick = async () => {
        if (descItem.value.trim() === "" || amount.value.trim() === "" || type.value === "") {
            return alert("Preencha todos os campos!");
        }

        const amountValue = parseFloat(amount.value);
        if (isNaN(amountValue) || amountValue <= 0) {
            return alert("O valor deve ser um número positivo.");
        }

        const currentMonth = getCurrentMonth();
        if (!data[currentMonth]) {
            data[currentMonth] = [];
        }

        data[currentMonth].push({
            desc: descItem.value,
            amount: amountValue.toFixed(2),
            type: type.value,
            paid: false,
        });

        await setFinanceData();
        populateMonthSelect();
        monthSelect.value = currentMonth;
        loadItens(currentMonth);

        descItem.value = "";
        amount.value = "";
    };

    async function deleteItem(month, index) {
        data[month].splice(index, 1);
        await setFinanceData();
        loadItens(month);
    }

    function updateItemStatus(month, index, isPaid) {
        data[month][index].paid = isPaid;
        setFinanceData();
    }

    function insertItem(item, month, index) {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.desc}</td>
            <td>R$ ${item.amount}</td>
            <td class="columnType">
                ${item.type === "Entrada"
                    ? '<i class="bx bxs-chevron-up-circle"></i>'
                    : '<i class="bx bxs-chevron-down-circle"></i>'}
            </td>
            <td><input type="checkbox" class="paid-checkbox" data-month="${month}" data-index="${index}" ${item.paid ? 'checked' : ''}></td>
            <td class="columnAction">
                <button class="deleteBtn" data-month="${month}" data-index="${index}">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector(".deleteBtn").addEventListener("click", function () {
            const month = this.getAttribute("data-month");
            const index = parseInt(this.getAttribute("data-index"));
            deleteItem(month, index);
        });

        tr.querySelector(".paid-checkbox").addEventListener("change", function () {
            const month = this.getAttribute("data-month");
            const index = parseInt(this.getAttribute("data-index"));
            updateItemStatus(month, index, this.checked);
        });
    }

    function loadItens(month) {
        const items = data[month] || [];
        tbody.innerHTML = "";
        items.forEach((item, index) => {
            insertItem(item, month, index);
        });

        getTotals(month);
    }

    function getTotals(month) {
        const items = data[month] || [];
        const amountIncomes = items.filter(item => item.type === "Entrada").map(item => parseFloat(item.amount));
        const amountExpenses = items.filter(item => item.type === "Saída").map(item => parseFloat(item.amount));

        const totalIncomes = amountIncomes.reduce((acc, cur) => acc + cur, 0).toFixed(2);
        const totalExpenses = amountExpenses.reduce((acc, cur) => acc + cur, 0).toFixed(2);
        const totalBalance = (parseFloat(totalIncomes) - parseFloat(totalExpenses)).toFixed(2);

        incomes.textContent = totalIncomes;
        expenses.textContent = totalExpenses;
        total.textContent = totalBalance;
    }

    monthSelect.onchange = () => {
        loadItens(monthSelect.value);
    };

    // Initial Load
    populateMonthSelect();
    const initialMonth = monthSelect.value || getCurrentMonth();
    monthSelect.value = initialMonth;
    loadItens(initialMonth);
});
