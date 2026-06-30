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
