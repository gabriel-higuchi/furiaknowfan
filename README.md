# 🎮 eSports Fan Data Collector

Este projeto é um site desenvolvido em **React** com o objetivo de coletar dados de fãs de eSports. Os usuários podem preencher um perfil com suas redes sociais e interesses, permitindo a criação de uma base de dados para comunidades, eventos ou iniciativas de marketing no cenário competitivo.

# Caso você não tenha o banco de dados ou o servidor rodando:  
pode acessar as outras telas adicionando /register, /login, /profile, /chat-analysis.  

## 🚀 Funcionalidades

- ✅ Formulário de perfil do usuário
- ✅ Campos para Twitter (X), Instagram, Steam e Discord
- ✅ Interface amigável e responsiva
- ✅ Preparado para integração com backend/API

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/) – Biblioteca principal para construção da interface
- [ESLint](https://eslint.org/) – Análise estática de código
- [TailwindCSS](https://tailwindcss.com/) – Estilizaçã
- [React Router](https://reactrouter.com/) – Roteamento entre páginas

## 📂 Estrutura do Projeto
src/  
├── components/  
│ └── ProfilePage.jsx  
├── App.jsx  
├── main.jsx  
└── ...  

## 🧑‍💻 Como Rodar o Projeto

1. Clone o repositório:


git clone https://github.com/gabriel-higuchi/furiaknowfan.git 
cd nome-do-repo  

2. Instale as dependencias:
npm install

3. Insira sua chave geminiAPI na linha:
no arquivo chat-analysis.jsx remova "SuaChaveAPI" pela sua chave.  
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=SuaChaveAPI  

5. Rode o servidor de desenvolvimento:
npm run dev

6. Crie um database (o utilizado foi o PostgreSQL usando o pgAdmin 4):  
crie as tabelas:  
CREATE TABLE IF NOT EXISTS fan_profiles (  
id SERIAL PRIMARY KEY,  
user_id INTEGER,  
cpf VARCHAR(14),  
birth_date DATE,  
phone VARCHAR(20),  
address_street VARCHAR(100),  
address_number VARCHAR(10),  
address_complement VARCHAR(50),  
address_zipcode VARCHAR(10),  
favorite_game VARCHAR(50),  
favorite_team VARCHAR(50),  
favorite_player VARCHAR(50),  
years_following INTEGER,  
events_attended TEXT,  
merch_purchases TEXT,  
twitter VARCHAR(50),  
instagram VARCHAR(50),  
steam VARCHAR(100),  
discord VARCHAR(50),  
document_path VARCHAR(255),  
created_at TIMESTAMP DEFAULT NOW()  
);  
  
Create table usuarios (  
id serial primary key;  
nome text,  
email text,  
senha text  
);   

5. Rode o backend:  
na pasta backend rode o index.js  
node ./index.js



## Tabelas necessárias para rodar o servidor local (/backend/index.js):
CREATE TABLE IF NOT EXISTS fan_profiles (  
        id SERIAL PRIMARY KEY,  
        user_id INTEGER,  
        cpf VARCHAR(14),  
        birth_date DATE,  
        phone VARCHAR(20),  
        address_street VARCHAR(100),  
        address_number VARCHAR(10),  
        address_complement VARCHAR(50),  
        address_zipcode VARCHAR(10),  
        favorite_game VARCHAR(50),  
        favorite_team VARCHAR(50),  
        favorite_player VARCHAR(50),  
        years_following INTEGER,  
        events_attended TEXT,  
        merch_purchases TEXT,  
        twitter VARCHAR(50),  
        instagram VARCHAR(50),  
        steam VARCHAR(100),  
        discord VARCHAR(50),  
        document_path VARCHAR(255),  
        created_at TIMESTAMP DEFAULT NOW()  
      );  

Create table usuarios (  
	id serial primary key;  
	nome text,  
	email text,  
	senha text  
);  

1. Crie um servidor no pgadmin




