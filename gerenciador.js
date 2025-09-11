const rs = require("readline-sync"); 

// Dados iniciais
let estudantes = [ 
  {nome: "Cael", idade: 19, notas: [2,10,7]}, 
  {nome: "Luiza",idade: 23, notas: [10, 8, 8]}, 
  {nome: "Amora", idade: 10, notas: [2, 3, 5]}
];


//funções 
function mostrarEstudantes() { 
  let nomes = estudantes.map(estudante => estudante.nome);
  console.log(nomes); 
}

function calcularmediaIndividual (estudante){ 
  let soma = estudante.notas.reduce((total, nota) => total + nota, 0); 
  let media = soma / estudante.notas.length;
  return media;
}

function calculamediaTurma(estudantes){ 
  let medias = estudantes.map(estudante => calcularmediaIndividual(estudante));
  let soma = medias.reduce((total, media) => total + media, 0); 
  return soma / estudantes.length;
}

function melhorEstudante(estudantes) {
  if (estudantes.length === 0) return null;

  let top = estudantes[0];
  let maior = calcularmediaIndividual(top);

  for (let i = 1; i < estudantes.length; i++) {
    const m = calcularmediaIndividual(estudantes[i]);
    if (m > maior) {
      maior = m;
      top = estudantes[i];
    }
  }
  return { estudante: top, media: maior }; // <--- aqui o segredo
}



function aprovados(estudantes) { return estudantes.filter(e => calcularmediaIndividual(e) >= 7);}
function recuperacao(estudantes){ return estudantes.filter(e => {const m =calcularmediaIndividual(e); return m >= 5 && m < 7; });}
function reprovados(estudantes){ return estudantes.filter(e => calcularmediaIndividual(e) < 5); }

function validarNome(busca){ 
  if(typeof busca !== "string" || busca.trim() === ""){ 
    throw new Error("Nome de busca inválido: informe um texto não vazio.");
  }
} 
function buscarEstudantes(estudantes, nomeBuscado){ validarNome(nomeBuscado); 
  const alvo = nomeBuscado.toLowerCase(); 
  return estudantes.filter(e => e.nome.toLowerCase().includes(alvo));
}

//entradas e validações 

function lerNome() { 
  const nome = rs.question("Nome: ".trim());
  if(!nome) throw new Error("Nome invalido."); 
  return nome; 
}
function lerIdade(){ 
  const idade = Number(rs.question("Idade: ").trim()); 
  if(!Number.isFinite(idade) || idade <= 0) throw new Error("Idade invalida."); 
  return idade; 
}
function lerNotas() { 
  const entrada =rs.question("Notas (3 numeros 0-10, separadas por espaço): ".trim()); 
  const notas = entrada.split(/\s+/).map(Number);
  const ok = notas.length === 3 && notas.every(n => Number.isFinite(n) && n >= 0 && n<= 10); 
  if (!ok) throw new Error("Notas invalidas. "); 
  return notas; 
}

//AÇÕES MENU 

function acCadastrar() { 
  try { 
    const nome = lerNome(); 
    const idade = lerIdade(); 
    const notas = lerNotas(); 
    estudantes.push({nome, idade, notas}); 
    console.log("Cadastrado com sucesso. \n"); 
  } catch (e) {console.log("Error:", e.message, "\n"); }
}

function acListar(){ 
  if(estudantes.length === 0) return console.log("Sem estudantes. \n"); 
  estudantes.forEach((e, i) => { 
    console.log(`${i+1}. ${e.nome} (${e.idade}) - notas: [${e.notas.join(", ")}]`); 
  });
  console.log(); 
}

function acBuscar() { 
  const termo =rs.question("Buscar por nome(parcial): ").trim(); 
  const lista = buscarEstudantes(estudantes, termo); 
  if(lista.length === 0) console.log("Nenhum encontrado. \n"); 
  else console.log("Encontrados: ", lista.map(e => e.nome).join(", "), "\n");
}

function acMedias(){ 
  estudantes.forEach(e => { 
    console.log(`${e.nome}: ${calcularmediaIndividual(e).toFixed(2)}`);
  }); 
  console.log("Media da turma: ", calculamediaTurma(estudantes).toFixed(2), "\n");
}

function acTop1() {
  const r = melhorEstudante(estudantes);
  if (!r) {
    console.log("Nenhum estudante cadastrado.\n");
    return;
  }
   console.log("=====================");
  console.log(`Melhor aluno: ${r.estudante.nome}`);
  console.log(`Média: ${r.media.toFixed(2)}`);
  console.log("===================== \n");
}


function acRelatorios(){ 
  console.log("Aprovados: ", aprovados(estudantes).map(e => e.nome).join(", ") || "_");
    console.log("Recuperação: ", recuperacao(estudantes).map(e => e.nome).join(", ") || "_"); 
  console.log("Reprovados: ", reprovados(estudantes).map(e => e.nome).join(", ") || "_"); 
 console.log(); 
}


//menu 

function menu() { 
  while(true){ 
    console.log("=== GERENCIADOR DE ESTUDANTES === ");
    console.log("1. Cadastrar estudantes"); 
    console.log("2. Listar estudantes"); 
    console.log("3. Buscar por nome"); 
    console.log("4. Medias( individual + turma)"); 
    console.log("5. Melhor estudante"); 
    console.log("6. Relatorios"); //aprov/recup/reprov
    console.log("0. Sair");
    const op = rs.question("Opcao: ".trim());
    console.log(); 
    switch(op){ 
      case "1": acCadastrar(); break; 
      case "2": acListar(); break; 
      case "3": acBuscar(); break; 
      case "4": acMedias(); break; 
      case "5": acTop1(); break;
      case "6": acRelatorios(); break; 
      case "0": console.log("Encerrando..."); return; 
      default: console.log("Opcao invalida. \n");  
    }
  }
}

menu();  