// js/database.js
// Compatível com Google Apps Script e scripts HTML sem type="module"

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec';

/**
 * Envia os dados de um cliente para o Google Apps Script.
 * Usa mode: "no-cors" para evitar erros de redirecionamento do Google.
 * Retorna uma Promise que resolve após o envio.
 */
function salvarCliente(cliente) {
  console.log('[database.js] Iniciando salvarCliente com dados:', cliente);

  return new Promise((resolve, reject) => {
    if (!cliente || typeof cliente !== 'object') {
      console.error('[database.js] Dados do cliente inválidos:', cliente);
      reject(new Error('Dados do cliente inválidos'));
      return;
    }

    const payload = JSON.stringify(cliente);
    console.log('[database.js] Payload preparado:', payload);

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })
      .then(() => {
        // Com mode: "no-cors" a resposta é opaque, então não é possível ler o conteúdo.
        console.log('[database.js] Requisição de envio concluída (no-cors). Dados provavelmente enviados.');
        resolve({ ok: true, enviado: true });
      })
      .catch((erro) => {
        console.error('[database.js] Erro durante o envio para o Google Apps Script:', erro);
        reject(erro);
      });
  });
}

/**
 * Busca a lista de clientes do Google Apps Script.
 * Retorna um Array vazio [] caso a resposta não seja um JSON válido ou esteja vazia.
 */
function buscarClientes() {
  console.log('[database.js] Iniciando buscarClientes em:', GOOGLE_SCRIPT_URL);

  return fetch(GOOGLE_SCRIPT_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then((resposta) => {
      console.log('[database.js] Resposta recebida. Status:', resposta.status, 'OK:', resposta.ok);

      if (!resposta.ok) {
        console.warn('[database.js] Resposta não OK. Retornando array vazio.');
        return [];
      }

      return resposta.text();
    })
    .then((texto) => {
      console.log('[database.js] Corpo bruto da resposta:', texto);

      if (!texto || texto.trim() === '') {
        console.warn('[database.js] Resposta vazia. Retornando array vazio.');
        return [];
      }

      try {
        const dados = JSON.parse(texto);
        console.log('[database.js] JSON parseado com sucesso:', dados);

        if (Array.isArray(dados)) {
          console.log('[database.js] Retornando array de clientes com', dados.length, 'itens.');
          return dados;
        }

        if (dados && Array.isArray(dados.clientes)) {
          console.log('[database.js] Retornando dados.clientes com', dados.clientes.length, 'itens.');
          return dados.clientes;
        }

        console.warn('[database.js] JSON não contém um array esperado. Retornando array vazio.');
        return [];
      } catch (erro) {
        console.error('[database.js] Erro ao parsear JSON:', erro);
        return [];
      }
    })
    .catch((erro) => {
      console.error('[database.js] Erro durante a busca de clientes:', erro);
      return [];
    });
}

// Torna as funções globais para que possam ser acessadas pelos scripts HTML
// mesmo sem o uso de type="module".
window.salvarCliente = salvarCliente;
window.buscarClientes = buscarClientes;

console.log('[database.js] Módulo carregado. Funções globais registradas: salvarCliente, buscarClientes');
