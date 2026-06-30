// js/database.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec";

function normalizarResposta(resultado) {
  if (Array.isArray(resultado)) {
    return resultado;
  }

  if (resultado && typeof resultado === "object" && "data" in resultado) {
    return resultado.data;
  }

  return [];
}

async function buscarClientes() {
  try {
    console.log("[database] buscarClientes: iniciando requisição");

    const resposta = await fetch(`${SCRIPT_URL}?acao=buscarClientes`);
    console.log("[database] buscarClientes: status HTTP", resposta.status);

    const resultado = await resposta.json();
    console.log("[database] buscarClientes: resposta bruta", resultado);

    const dados = normalizarResposta(resultado);
    console.log("[database] buscarClientes: dados normalizados", dados);

    return dados;
  } catch (erro) {
    console.error("[database] buscarClientes: erro", erro);
    return [];
  }
}

async function buscarAtendimentos() {
  try {
    console.log("[database] buscarAtendimentos: iniciando requisição");

    const resposta = await fetch(`${SCRIPT_URL}?acao=buscarAtendimentos`);
    console.log("[database] buscarAtendimentos: status HTTP", resposta.status);

    const resultado = await resposta.json();
    console.log("[database] buscarAtendimentos: resposta bruta", resultado);

    const dados = normalizarResposta(resultado);
    console.log("[database] buscarAtendimentos: dados normalizados", dados);

    return dados;
  } catch (erro) {
    console.error("[database] buscarAtendimentos: erro", erro);
    return [];
  }
}
