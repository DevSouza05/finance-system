document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    const btnLogout = document.getElementById('btnLogout');

    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    // ✅ Registro
    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                return alert("⚠️ Preencha todos os campos!");
            }

            const users = getUsers();
            if (users.find(user => user.username === username)) {
                return alert("❌ Nome de usuário já existe!");
            }

            users.push({ username, password });
            saveUsers(users);

            alert("✅ Registrado com sucesso! Faça login agora 👉");
            window.location.href = "login.html";
        });
    }

    // ✅ Login
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                return alert("⚠️ Preencha todos os campos!");
            }

            const users = getUsers();
            const user = users.find(user => user.username === username && user.password === password);

            if (!user) {
                return alert("❌ Usuário ou senha inválidos!");
            }

            sessionStorage.setItem('loggedInUser', user.username);
            alert("✅ Login realizado com sucesso!");
            window.location.href = "index.html";
        });
    }

    // ✅ Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            sessionStorage.removeItem("loggedInUser");
            alert("👋 Você saiu da sua conta!");
            window.location.href = "login.html";
        });
    }

    // ✅ Proteção de páginas privadas
    const isProtectedPage = window.location.pathname.endsWith('index.html');
    if (isProtectedPage) {
        const loggedInUser = sessionStorage.getItem("loggedInUser");
        if (!loggedInUser) {
            alert("⚠️ Você precisa estar logado!");
            window.location.href = "login.html";
        }
    }
});