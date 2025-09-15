import fs from "fs";
import rs from "readline-sync";
const caminho = "./estudantes.json";

let estudantes = []; 
let proximoId = 1;

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
  return { estudante: top, media: maior };
}

function aprovados(estudantes) { return estudantes.filter(e => calcularmediaIndividual(e) >= 7);}
function recuperacao(estudantes){ return estudantes.filter(e => {const m =calcularmediaIndividual(e); return m >= 5 && m < 7; });}
function reprovados(estudantes){ return estudantes.filter(e => calcularmediaIndividual(e) < 5); }

function validarNome(busca){ 
  if(typeof busca !== "string" || busca.trim() === ""){ 
    throw new Error("Nome de busca inválido: informe um texto não vazio.");
  }
} 

function buscarEstudantes(estudantes, nomeBuscado){ 
  validarNome(nomeBuscado); 
  const alvo = nomeBuscado.toLowerCase(); 
  return estudantes.filter(e => e.nome.toLowerCase().includes(alvo));
}

function buscarPorId(id){
  return estudantes.find(e => e.id === id);
}

function gerarId(){
  return proximoId++;
}

function inicializarIds(){
  if(estudantes.length > 0){
    proximoId = Math.max(...estudantes.map(e => e.id || 0)) + 1;
  }
}

//validações extras
function validarEmail(email){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!email || !regex.test(email.trim())){
    throw new Error("Email inválido.");
  }
  return email.trim();
}

//entradas e validações 
function lerNome() { 
  const nome = rs.question("Nome: ").trim();
  if(!nome) throw new Error("Nome invalido."); 
  return nome; 
}

function lerIdade(){ 
  const idade = Number(rs.question("Idade: ").trim()); 
  if(!Number.isFinite(idade) || idade <= 0) throw new Error("Idade invalida."); 
  return idade; 
}

function lerEmail(){
  const email = rs.question("Email: ").trim();
  return validarEmail(email);
}

function lerNotas() { 
  const entrada =rs.question("Notas (3 numeros 0-10, separadas por espaço): ").trim(); 
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
    const email = lerEmail(); 
    const notas = lerNotas(); 
    const id = gerarId();
    estudantes.push({id, nome, idade, email, notas}); 
    console.log(`Cadastrado com sucesso! ID: ${id}\n`); 
  } catch (e) {console.log("Error:", e.message, "\n"); }
  salvarDados(); 
}

function acListar(){ 
  if(estudantes.length === 0) return console.log("Sem estudantes. \n"); 
  estudantes.forEach((e, i) => { 
    const media = calcularmediaIndividual(e);
    console.log(`${i+1}. ID: ${e.id} | ${e.nome} (${e.idade}) - ${e.email}`); 
    console.log(`   Notas: [${e.notas.join(", ")}] - Media: ${media.toFixed(2)}`);
  });
  console.log(); 
}

function acBuscar() { 
  const termo =rs.question("Buscar por nome(parcial): ").trim(); 
  const lista = buscarEstudantes(estudantes, termo); 
  if(lista.length === 0) console.log("Nenhum encontrado. \n"); 
  else {
    console.log(`Encontrados ${lista.length}:`);
    lista.forEach(e => console.log(`- ID: ${e.id} | ${e.nome}`));
    console.log();
  }
}

function acBuscarId(){
  const id = Number(rs.question("ID do estudante: ").trim());
  const estudante = buscarPorId(id);
  if(!estudante) return console.log("Estudante não encontrado.\n");
  
  const media = calcularmediaIndividual(estudante);
  console.log(`\nEncontrado:`);
  console.log(`ID: ${estudante.id} | ${estudante.nome} (${estudante.idade})`);
  console.log(`Email: ${estudante.email}`);
  console.log(`Notas: [${estudante.notas.join(", ")}] - Media: ${media.toFixed(2)}\n`);
}

function acMedias(){ 
  if(estudantes.length === 0) return console.log("Sem estudantes.\n");
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
  if(estudantes.length === 0) return console.log("Sem estudantes.\n");
  
  const apr = aprovados(estudantes);
  const rec = recuperacao(estudantes);
  const rep = reprovados(estudantes);
  
  console.log(`Aprovados (${apr.length}): `, apr.map(e => e.nome).join(", ") || "_");
  console.log(`Recuperação (${rec.length}): `, rec.map(e => e.nome).join(", ") || "_"); 
  console.log(`Reprovados (${rep.length}): `, rep.map(e => e.nome).join(", ") || "_"); 
  console.log(); 
}

function acEstatisticas(){
  if(estudantes.length === 0) return console.log("Sem estudantes.\n");
  
  const medias = estudantes.map(e => calcularmediaIndividual(e));
  const mediaTurma = calculamediaTurma(estudantes);
  const maior = Math.max(...medias);
  const menor = Math.min(...medias);
  const taxaAprov = (aprovados(estudantes).length / estudantes.length) * 100;
  
  console.log(`Total estudantes: ${estudantes.length}`);
  console.log(`Media turma: ${mediaTurma.toFixed(2)}`);
  console.log(`Maior media: ${maior.toFixed(2)}`);
  console.log(`Menor media: ${menor.toFixed(2)}`);
  console.log(`Taxa aprovação: ${taxaAprov.toFixed(1)}%\n`);
}

function acEditar() { 
  const id = Number(rs.question("ID do estudante para editar: ").trim());
  const alvo = buscarPorId(id);

  if(!alvo) return console.log("Estudante não encontrado. \n"); 
  
  console.log(`Editando: ${alvo.nome}`);
  
  //Campos opcionais
  const novoNome = rs.question(`Novo nome (${alvo.nome}): `).trim() || alvo.nome;
  const novaIdadeStr = rs.question(`Nova idade (${alvo.idade}): `).trim();
  const novaIdade = novaIdadeStr ? Number(novaIdadeStr) : alvo.idade;
  const novoEmail = rs.question(`Novo email (${alvo.email}): `).trim() || alvo.email;
  const novasNotasStr = rs.question(`Novas notas (${alvo.notas.join(" ")}): `).trim();
  const novasNotas = novasNotasStr ? novasNotasStr.split(/\s+/).map(Number) : alvo.notas;
  
  alvo.nome = novoNome;
  alvo.idade = novaIdade; 
  alvo.email = novoEmail;
  alvo.notas = novasNotas;
  
  salvarDados();
  console.log("Estudante atualizado. \n");
}
 
function acRemover(){ 
  const termo = rs.question("Digite o ID ou nome do estudante: ").trim();
  if (!termo) return console.log("Entrada vazia.\n");
  // tenta ID numérico
  let estudante =
    !isNaN(Number(termo)) ? buscarPorId(Number(termo)) : null;
  // se não achou por ID, tenta nome (primeiro que bater)
  if (!estudante) {
    const lista = buscarEstudantes(estudantes, termo);
    estudante = lista[0];  // pega o primeiro encontrado
  }
  if (!estudante) return console.log("Nenhum estudante encontrado.\n");
  const confirma = rs
    .question(`Remover "${estudante.nome}" (ID ${estudante.id})? (s/N): `)
    .toLowerCase();

  if (confirma === "s" || confirma === "sim") {
    estudantes = estudantes.filter(e => e.id !== estudante.id);
    salvarDados();
    console.log("Estudante removido.\n");
  } else {
    console.log("Cancelado.\n");
  }
}

function carregarDados(){ 
  if (fs.existsSync(caminho)){ 
    const raw =fs.readFileSync(caminho, "utf-8"); 
    estudantes = JSON.parse(raw);
    inicializarIds();
    console.log(`${estudantes.length} estudante(s) carregados.\n`);
  }
}

function salvarDados(){
  fs.writeFileSync(caminho, JSON.stringify(estudantes, null, 2)); 
} 

// menu  
function menu() { 
  while(true){ 
    console.log("=== GERENCIADOR DE ESTUDANTES === ");
    console.log("1. Cadastrar estudantes"); 
    console.log("2. Listar estudantes"); 
    console.log("3. Buscar (nome ou ID)"); 
    console.log("4. Medias( individual + turma)"); 
    console.log("5. Melhor estudante"); 
    console.log("6. Relatorios");   //aprov/recup/reprov
    console.log("7. Estatisticas gerais");
    console.log("8. Editar estudante (nome ou ID)"); 
    console.log("9. Remover estudante (nome ou ID)"); 
    console.log("0. Sair");
    const op = rs.question("Opcao: ").trim();
    console.log(); 
    switch(op){ 
      case "1": acCadastrar(); break; 
      case "2": acListar(); break; 
      case "3": acBuscar(); break; 
      case "4": acMedias(); break; 
      case "5": acTop1(); break;
      case "6": acRelatorios(); break;
      case "7": acEstatisticas(); break;
      case "8": acEditar(); break; 
      case "9": acRemover(); break; 
      case "0": console.log("Encerrando..."); return; 
      default: console.log("Opcao invalida. \n");  
    }
  }
}

carregarDados();
menu();