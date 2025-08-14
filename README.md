# Sistema de Consulta

## 🎯 Visão Geral

O **Sistema de Consulta** é uma aplicação web projetada para permitir consultas rápidas e seguras de clientes, integrando diferentes serviços e APIs de bancos parceiros.  

### Objetivos:
- Consulta de clientes por CPF ou telefone.  
- Login seguro com níveis de acesso.  
- Acompanhamento de resultados em tempo real.  
- Integração com APIs de bancos parceiros (Safra, Pan, BMG, etc.).  
- Registro e histórico detalhado das consultas realizadas.  

---

## 🧰 Stack do Projeto

- **Front-end:** React + Bootstrap  
- **Back-end:** Python + Flask  
- **Banco de Dados:** SQLite (fase inicial) → PostgreSQL (futuro)  
- **Integrações futuras:** APIs de bancos, IA para análise de conversas  
- **Hospedagem:** Render, Railway ou AWS  

---

## 📂 Estrutura do Projeto

```text
consulta-clientes-v2/
│
├── backend/
│   ├── app/
│   │   ├── models/      # Modelos de dados e mapeamentos (ex: ORM, schemas)
│   │   ├── routes/      # Definição de endpoints e controladores
│   │   ├── services/    # Lógica de negócio e integração com APIs
│   │   ├── utils/       # Funções auxiliares e utilitários
|   |
│   │── venv/             # Ambiente virtual Python
│   ├── app.py           # Ponto de entrada da aplicação Flask
│   ├── config.py        # Configurações (banco, APIs, variáveis)
│   ├── requirements.txt # Lista de dependências do projeto
│
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas principais (Dashboard, Resultados)
│   │   ├── services/          # Comunicação com API Flask
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│
├── docs/
│   ├── README.md
│   └── arquitetura.md
│
├── .gitignore
└── README.md
