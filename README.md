
# Sistema de Finanças Pessoais

Um sistema simples para gerenciar suas finanças pessoais, permitindo o controle de entradas e saídas de dinheiro.

## Funcionalidades

- Cadastro e Login de usuários.
- Adicionar e remover transações financeiras (entradas e saídas).
- Visualizar o balanço total.
- Armazenamento de dados em um banco de dados MySQL.

## Começando

Para começar a usar o projeto, siga as instruções abaixo.

### Pré-requisitos

- Node.js
- MySQL

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/finance-system.git
   ```
2. Instale as dependências do NPM:
   ```sh
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione as seguintes variáveis:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=sua_senha
     DB_NAME=finance
     JWT_SECRET=seu_segredo_jwt
     ```
4. Crie o banco de dados no MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS finance;
   ```

## Uso

1. Inicie o servidor:
   ```sh
   npm start
   ```
2. Abra o arquivo `login.html` em seu navegador.

## Fluxo da Aplicação

1.  **Cadastro:** O usuário cria uma conta fornecendo um nome de usuário e senha. As informações são salvas no banco de dados MySQL.
2.  **Login:** O usuário faz login com suas credenciais. O servidor verifica as informações no banco de dados e, se forem válidas, retorna um token JWT (JSON Web Token).
3.  **Autenticação:** O token JWT é armazenado no `localStorage` do navegador e é enviado em todas as requisições subsequentes para a API, garantindo que apenas usuários autenticados possam acessar os dados.
4.  **Página Principal:** Após o login, o usuário é redirecionado para a página principal (`index.html`), onde pode visualizar, adicionar e remover suas transações financeiras.
5.  **Gerenciamento de Dados:** Todas as transações são salvas e recuperadas do banco de dados MySQL, associadas ao usuário autenticado.

## Endpoints da API

- `POST /api/register`: Registra um novo usuário.
- `POST /api/login`: Autentica um usuário e retorna um token JWT.
- `GET /api/data`: Retorna os dados financeiros do usuário autenticado.
- `POST /api/data`: Salva os dados financeiros do usuário autenticado.
