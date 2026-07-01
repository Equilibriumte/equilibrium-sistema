const EQUILIBRIUM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec';

async function salvarCliente(dados) {
  console.log('[Equilibrium DB] Iniciando salvarCliente...');
  console.log('[Equilibrium DB] Dados recebidos:', dados);

  const payload = {
    action: 'salvarCliente',
    ...dados
  };

  console.log('[Equilibrium DB] Payload a ser enviado:', payload);

  try {
    const response = await fetch(EQUILIBRIUM_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Equilibrium DB] Requisição POST enviada com sucesso.');
    console.log('[Equilibrium DB] Objeto de resposta (opaco devido ao no-cors):', response);
    return { sucesso: true, mensagem: 'Cliente enviado para processamento.' };
  } catch (erro) {
    console.error('[Equilibrium DB] Erro ao salvar cliente:', erro);
    throw erro;
  }
}

async function buscarClientes() {
  console.log('[Equilibrium DB] Iniciando buscarClientes...');
  const url = `${EQUILIBRIUM_SCRIPT_URL}?action=buscarClientes`;
  console.log('[Equilibrium DB] URL da requisição GET:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow'
    });

    console.log('[Equilibrium DB] Requisição GET concluída. Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Equilibrium DB] Clientes recebidos:', data);
    return data;
  } catch (erro) {
    console.error('[Equilibrium DB] Erro ao buscar clientes:', erro);
    throw erro;
  }
}

window.salvarCliente = salvarCliente;
window.buscarClientes = buscarClientes;

console.log('[Equilibrium DB] Módulo de banco de dados carregado e funções expostas no escopo global.');
