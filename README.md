# 📚 Gerenciador de Estudantes – Node.js

Aplicação **CLI (Command Line Interface)** para gerenciar uma lista de estudantes: cadastrar, listar, buscar, editar e remover.  
Inclui cálculo de médias, relatórios e persistência de dados em arquivo JSON.

---

## 🛠 Tecnologias

- **Node.js** (ESM)
- [readline-sync](https://www.npmjs.com/package/readline-sync) – entrada interativa no terminal
- Módulo nativo **fs** – leitura e escrita de arquivos

---

## 📂 Estrutura de Pastas

.<br>
├─ estudantes.json # Base de dados persistente <br>
└─ gerenciador.js # Código principal do CLI

---

## 🚀 Instalação e Execução

```bash
# 1. Clone o repositório
git clone <URL_DO_REPO>
cd <nome-da-pasta>

# 2. Instale as dependências
npm install readline-sync

# 3. Execute
node gerenciador.js
```

# 🎯 Funcionalidades

- **Cadastro** de estudantes com nome, idade, e-mail e três notas.
- **Listagem** completa com médias individuais.
- **Busca** por nome (parcial) ou ID.
- **Edição** e **remoção** de registros por nome ou ID.
- **Relatórios**: aprovados, recuperação e reprovados.
- **Estatísticas**: média da turma, maior/menor média e taxa de aprovação.
- Persistência automática em `estudantes.json`.

## 🧩 Menu Principal

1. Cadastrar estudantes
2. Listar estudantes
3. Buscar (nome ou ID)
4. Médias (individual + turma)
5. Melhor estudante
6. Relatórios
7. Estatísticas gerais
8. Editar estudante (nome ou ID)
9. Remover estudante (nome ou ID)
10. Sair

## 💡 Observações

- O arquivo `estudantes.json` é criado automaticamente na primeira execução.
- Todas as entradas possuem **validação** para evitar dados inconsistentes.
