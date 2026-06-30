// js/database.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec";

// Esta função garante que o sistema sempre receba uma lista, mesmo que a planilha esteja vazia
function normalizarResposta(resultado) {
  if (Array.isArray(resultado)) {
    return resultado;
  }
  if (resultado && typeof resultado === "object" && "data" in resultado) {
    return resultado.data;
  }
  return [];
}

async function salvarCliente(cliente) {
  console.log("[database] salvarCliente: iniciando", cliente);
  try {
    const resposta = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necessário para o Google Script
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    // Como é no-cors, não lemos a resposta, apenas confirmamos o envio
    return { success: true };
  } catch (erro) {
    console.error("[database] Erro ao salvar:", erro);
    throw erro;
  }
}

async function buscarClientes() {
  try {
    const resposta = await fetch(`${SCRIPT_URL}?acao=buscarClientes`);
    const resultado = await resposta.json();
    return normalizarResposta(resultado);
  } catch (erro) {
    console.error("[database] Erro ao buscar:", erro);
    return [];
  }
}

// Torna as funções disponíveis para os outros arquivos
window.salvarCliente = salvarCliente;
window.buscarClientes = buscarClientes;
