const URL_API = 'https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec';

function normalizarResposta(resultado) {
  if (resultado === null || resultado === undefined) {
    return [];
  }
  if (Array.isArray(resultado)) {
    return resultado;
  }
  if (typeof resultado === 'object' && resultado !== null) {
    return [resultado];
  }
  return [];
}

function salvarCliente(cliente) {
  return new Promise((resolve, reject) => {
    if (!cliente || typeof cliente !== 'object') {
      reject(new Error('Cliente inválido. Envie um objeto com os dados do cliente.'));
      return;
    }

    fetch(URL_API, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    })
      .then(() => {
        resolve({ sucesso: true, mensagem: 'Cliente enviado para salvamento.' });
      })
      .catch((erro) => {
        reject(new Error('Erro ao salvar cliente: ' + erro.message));
      });
  });
}

function buscarClientes() {
  return fetch(URL_API, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error('Erro HTTP: ' + resposta.status);
      }
      return resposta.json();
    })
    .then((dados) => {
      return normalizarResposta(dados);
    })
    .catch((erro) => {
      console.error('Erro ao buscar clientes:', erro);
      return [];
    });
}

window.salvarCliente = salvarCliente;
window.buscarClientes = buscarClientes;
// --- NOVAS FUNÇÕES PARA A FICHA DO CLIENTE ---

// Busca um cliente específico pelo ID na lista sincronizada
async function getClienteById(id) {
    try {
        const clientes = await buscarClientes();
        return clientes.find(c => String(c.id) === String(id));
    } catch (erro) {
        console.error("Erro ao buscar cliente por ID:", erro);
        return null;
    }
}

// Busca atendimentos de um cliente específico
async function getAtendimentosByClienteId(clienteId) {
    try {
        const atendimentos = await buscarAtendimentos();
        return atendimentos.filter(a => String(a.clienteId) === String(clienteId));
    } catch (erro) {
        console.error("Erro ao buscar atendimentos do cliente:", erro);
        return [];
    }
}

// Garante que as funções estejam disponíveis globalmente para o navegador
window.getClienteById = getClienteById;
window.getAtendimentosByClienteId = getAtendimentosByClienteId;
