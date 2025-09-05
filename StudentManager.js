//Sistema Gerenciador de Estudantes
//Estrutura principal para armazenar os dados
const readline = require("readline");

// array para armazenar os estudantes
let students = [];

//interface para entrada de dados via terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função para fazer pergunta e aguardar resposta
function pergunta(questao) {
  return new Promise((resolve) => {
    rl.question(questao, resolve);
  });
}

// função para validar nome (Não pode ser vazio)
function validarNome(nome) {
  return nome && nome.trim().length > 0;
}

// função para validar idade (deve ser um número positivo)
function validarIdade(idade) {
  const num = parseInt(idade);
  return !isNaN(num) && num > 0 && num < 150;
}
