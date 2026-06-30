// ============================================================
// database.js - Camada de persistência global via Google Apps Script
// ============================================================

const DATABASE_URL = 'https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec';

// ============================================================
// Helpers internos (não expostos diretamente em window)
// ============================================================

/**
 * Normaliza a resposta do Google Apps Script para um array seguro.
 * O Apps Script pode enviar: { data: [...] }, { result: [...] }, [...] ou um objeto.
 */
function normalizarArray(resposta) {
  if (resposta === null || resposta === undefined) {
    return [];
  }

  if (Array.isArray(resposta)) {
    return resposta;
  }

  if (typeof resposta === 'object') {
    if (Array.isArray(resposta.data)) {
      return resposta.data;
    }
    if (Array.isArray(resposta.result)) {
      return resposta.result;
    }
    if (Array.isArray(resposta.rows)) {
      return resposta.rows;
    }
    if (Array.isArray(resposta.items)) {
      return resposta.items;
    }
  }

  return [];
}

/**
 * Realiza uma requisição GET para a URL base, tratando a resposta como JSON.
 */
async function fetchJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
  }

  const texto = await response.text();
  if (!texto || !texto.trim()) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch (erro) {
    console.warn('Resposta não é JSON válido:', texto);
    return null;
  }
}

// ============================================================
// Clientes
// ============================================================

async function salvarCliente(dados) {
  if (!dados || typeof dados !== 'object') {
    throw new Error('Os dados do cliente devem ser um objeto válido.');
  }

  const payload = {
    acao: 'salvarCliente',
    ...dados
  };

  try {
    await fetch(DATABASE_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Como no-cors oculta a resposta, consideramos sucesso se não houver erro de rede.
    return { sucesso: true, mensagem: 'Cliente enviado com sucesso.' };
  } catch (erro) {
    console.error('Erro ao salvar cliente:', erro);
    throw new Error('Falha ao salvar cliente: ' + erro.message);
  }
}

async function buscarClientes() {
  try {
    const url = `${DATABASE_URL}?acao=buscarClientes`;
    const resposta = await fetchJson(url);
    return normalizarArray(resposta);
  } catch (erro) {
    console.error('Erro ao buscar clientes:', erro);
    return [];
  }
}

async function getClienteById(id) {
  if (id === undefined || id === null || id === '') {
    return null;
  }

  try {
    const clientes = await buscarClientes();
    const idBusca = String(id).trim().toLowerCase();

    return clientes.find(function (cliente) {
      if (!cliente || typeof cliente !== 'object') return false;
      const idCliente = cliente.id !== undefined && cliente.id !== null ? String(cliente.id).trim().toLowerCase() : '';
      return idCliente === idBusca;
    }) || null;
  } catch (erro) {
    console.error('Erro ao buscar cliente por ID:', erro);
    return null;
  }
}

// ============================================================
// Atendimentos
// ============================================================

async function salvarAtendimento(dados) {
  if (!dados || typeof dados !== 'object') {
    throw new Error('Os dados do atendimento devem ser um objeto válido.');
  }

  const payload = {
    acao: 'salvarAtendimento',
    ...dados
  };

  try {
    await fetch(DATABASE_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return { sucesso: true, mensagem: 'Atendimento enviado com sucesso.' };
  } catch (erro) {
    console.error('Erro ao salvar atendimento:', erro);
    throw new Error('Falha ao salvar atendimento: ' + erro.message);
  }
}

async function buscarAtendimentos() {
  try {
    const url = `${DATABASE_URL}?acao=buscarAtendimentos`;
    const resposta = await fetchJson(url);
    return normalizarArray(resposta);
  } catch (erro) {
    console.error('Erro ao buscar atendimentos:', erro);
    return [];
  }
}

async function getAtendimentosByClienteId(clienteId) {
  if (clienteId === undefined || clienteId === null || clienteId === '') {
    return [];
  }

  try {
    const atendimentos = await buscarAtendimentos();
    const idBusca = String(clienteId).trim().toLowerCase();

    return atendimentos.filter(function (atendimento) {
      if (!atendimento || typeof atendimento !== 'object') return false;
      const idCliente = atendimento.clienteId !== undefined && atendimento.clienteId !== null
        ? String(atendimento.clienteId).trim().toLowerCase()
        : '';
      return idCliente === idBusca;
    });
  } catch (erro) {
    console.error('Erro ao buscar atendimentos por clienteId:', erro);
    return [];
  }
}

// ============================================================
// Exposição global das funções para qualquer HTML
// ============================================================
window.salvarCliente = salvarCliente;
window.buscarClientes = buscarClientes;
window.getClienteById = getClienteById;
window.salvarAtendimento = salvarAtendimento;
window.buscarAtendimentos = buscarAtendimentos;
window.getAtendimentosByClienteId = getAtendimentosByClienteId;
