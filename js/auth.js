document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    const btnLogout = document.getElementById('btnLogout');

    // ✅ Função para enviar requisições com erro tratado
    async function handleRequest(url, body, onSuccessMessage, redirectTo) {
        try {
            const { username, password } = body;
            if (!username || !password) {
                alert("⚠️ Preencha todos os campos!");
                return;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`❌ ${data.message || "Erro na operação"}`);
                return;
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log("✅ Token salvo:", data.token);
            }

            alert(onSuccessMessage);
            window.location.href = redirectTo;
        } catch (error) {
            console.error('❌ Erro no Fetch:', error);
            alert("Erro ao conectar com o servidor!");
        }
    }

    // ✅ Login
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            handleRequest(
                '/api/login',
                {
                    username: document.getElementById('username').value.trim(),
                    password: document.getElementById('password').value.trim()
                },
                "✅ Login realizado com sucesso!",
                "/index.html"
            );
        });
    }

    // ✅ Registro
    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            handleRequest(
                '/api/register',
                {
                    username: document.getElementById('username').value.trim(),
                    password: document.getElementById('password').value.trim()
                },
                "✅ Registrado com sucesso! Faça login agora 👉",
                "/login.html"
            );
        });
    }

    // ✅ Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("token");
            alert("👋 Você saiu da sua conta!");
            window.location.href = "/login.html";
        });
    }

    // ✅ Proteção de páginas privadas
    const protectedPages = ["/index.html", "/dashboard.html"];
    if (protectedPages.includes(window.location.pathname)) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("⚠️ Você precisa estar logado!");
            window.location.href = "/login.html";
        }
    }
});
