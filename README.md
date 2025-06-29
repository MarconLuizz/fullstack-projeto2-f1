# 🏁 F1 Fullstack App

Projeto 2 da disciplina *Programação Web Fullstack* – UTFPR

Este projeto consiste no desenvolvimento de uma aplicação web fullstack baseada na temática de Fórmula 1. A aplicação permite *login de usuários, **busca* e *inserção* de temporadas, seguindo uma arquitetura em *três camadas*: Front-end com React.js, Back-end com Express.js e banco de dados MongoDB.

## 📚 Tecnologias Utilizadas

### Front-end (SPA)
- React.js
- React Context API
- Material UI (MUI)
- Axios
- React Router

### Back-end
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (hash de senhas)
- Helmet (segurança de headers)
- Express-validator (validação de inputs)
- Apicache (cache HTTP)
- Compression (compressão de respostas)
- Rate-limit (limite de requisições)
- Express-mongo-sanitize + xss-clean (prevenção de injeções)
- Morgan (logs de requisições)

## 🗂 Estrutura do Projeto


fullstack_project/
├── backend/
│   └── src/
│       ├── config/      → configuração do banco de dados
│       ├── models/      → definição do modelo Season
│       ├── routes/      → rotas (auth, seasons e middleware auth)
│       └── log.txt      → arquivo de log de autenticações e inserções
├── frontend/
│   └── src/             → componentes, contextos, páginas e lógica SPA


## ⚙ Funcionalidades

### 🔐 Login
- Usuário faz login com email e senha previamente cadastrados no banco.
- Token JWT é gerado e armazenado no navegador para autenticação em rotas protegidas.
- Senhas são armazenadas com hash Bcrypt.
- Rate limit aplicado para evitar força bruta.

### 🔎 Busca de temporadas (GET)
- Listagem e pesquisa com filtros por ano, campeão e equipe.
- Resultados são servidos com cache de 5 minutos via apicache.
- Rota protegida por autenticação.

### ➕ Inserção de temporada (POST)
- Permite adicionar novas temporadas ao banco.
- Valida campos obrigatórios e verifica duplicidade (ano).
- Limpa o cache automaticamente após inserção.

## 🔐 Segurança Implementada

- *JWT + Bcrypt*: autenticação segura e armazenamento de senha criptografado.
- *XSS e NoSQL Injection*: uso de express-validator, mongo-sanitize e xss-clean.
- *Rate-limit*: limite de 5 requisições de login por IP a cada 5 minutos.
- *Helmet*: proteção com headers seguros.
- *Logs*: cada login e inserção são registrados no log.txt.

## 🚀 Desempenho e Otimização

- *Cache HTTP*: com apicache para GETs.
- *Compressão*: de respostas via compression.
- *SPA otimizada*: frontend com npm run build e recursos minificados.

## 🔒 Requisitos da Proposta Atendidos

- ✅ Arquitetura 3 camadas (React, Express, MongoDB)
- ✅ Funcionalidades de Login, Busca e Inserção
- ✅ Autenticação obrigatória para ações protegidas
- ✅ Estrutura de pastas conforme a proposta
- ✅ Segurança: Criptografia, prevenção de injeções, rate limit, logs
- ✅ Cache e compressão no backend
- ✅ SPA funcional com React e navegação por rotas
---

## 📌 Como executar localmente

1. Clone este repositório:
bash
git clone https://github.com/seu-usuario/f1-fullstack.git


2. Instale dependências:
bash
cd backend
npm install

cd ../frontend
npm install


3. Configure o MongoDB no arquivo .env (backend):

MONGO_URI=mongodb://localhost:27017/f1db
JWT_SECRET=sua_chave_segura


4. Rode os servidores:
bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start


---

## 👨‍💻 Autores

*Luiz Marçon*  
[LinkedIn](https://linkedin.com/in/luiz-marçon)  
UTFPR – Tecnologia em Análise e Desenvolvimento de Sistemas

*Igor Martins*  
[LinkedIn](https://www.linkedin.com/in/igor-martins-127b2828b/)  
UTFPR – Tecnologia em Análise e Desenvolvimento de Sistemas
