const API_URL = 'https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec';
let currentApiUrl = API_URL;

function setApiUrl(url) {
  return new Promise((resolve) => {
    currentApiUrl = url;
    resolve(currentApiUrl);
  });
}

function getApiUrl() {
  return new Promise((resolve) => {
    resolve(currentApiUrl);
  });
}

function apiCall(action, data) {
  const isGet = !data || (typeof data === 'object' && Object.keys(data).length === 0);
  const url = isGet
    ? `${currentApiUrl}?action=${encodeURIComponent(action)}`
    : currentApiUrl;
  const options = isGet
    ? {}
    : {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data })
      };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    });
}

function getLocalStorageArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function syncClientes() {
  return new Promise((resolve) => {
    apiCall('listarClientes')
      .then((r) => resolve(Array.isArray(r.data) ? r.data : []))
      .catch(() => resolve(getLocalStorageArray('equilibriumClientes')));
  });
}

function syncAtendimentos() {
  return new Promise((resolve) => {
    apiCall('listarAtendimentos')
      .then((r) => resolve(Array.isArray(r.data) ? r.data : []))
      .catch(() => resolve(getLocalStorageArray('equilibriumAtendimentos')));
  });
}

function salvarCliente(dados) {
  return new Promise((resolve) => {
    const id = dados.id || 'CLI-' + Date.now();
    const dadosComId = { ...dados, id };

    apiCall('salvarCliente', dadosComId)
      .then(() => resolve({ success: true, id }))
      .catch(() => {
        const clientes = getLocalStorageArray('equilibriumClientes');
        clientes.push(dadosComId);
        localStorage.setItem('equilibriumClientes', JSON.stringify(clientes));
        resolve({ success: true, id });
      });
  });
}

function salvarAtendimento(dados) {
  return new Promise((resolve) => {
    let id = dados.id;
    if (!id) {
      const atendimentos = getLocalStorageArray('equilibriumAtendimentos');
      let max = 0;
      atendimentos.forEach((a) => {
        if (a.id && typeof a.id === 'string') {
          const match = a.id.match(/^ATD-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > max) max = num;
          }
        }
      });
      id = 'ATD-' + String(max + 1).padStart(4, '0');
    }
    const dadosComId = { ...dados, id };

    apiCall('salvarAtendimento', dadosComId)
      .then(() => resolve({ success: true, id }))
      .catch(() => {
        const atendimentos = getLocalStorageArray('equilibriumAtendimentos');
        atendimentos.push(dadosComId);
        localStorage.setItem('equilibriumAtendimentos', JSON.stringify(atendimentos));
        resolve({ success: true, id });
      });
  });
}

function editarCliente(id, dados) {
  return new Promise((resolve) => {
    apiCall('atualizarCliente', { ...dados, id })
      .then((r) => resolve(r))
      .catch(() => {
        const clientes = getLocalStorageArray('equilibriumClientes');
        const index = clientes.findIndex((c) => c.id === id);
        if (index !== -1) {
          clientes[index] = { ...clientes[index], ...dados, id };
          localStorage.setItem('equilibriumClientes', JSON.stringify(clientes));
        }
        resolve({ success: true, id });
      });
  });
}

function editarAtendimento(id, dados) {
  return new Promise((resolve) => {
    apiCall('atualizarAtendimento', { ...dados, id })
      .then((r) => resolve(r))
      .catch(() => {
        const atendimentos = getLocalStorageArray('equilibriumAtendimentos');
        const index = atendimentos.findIndex((a) => a.id === id);
        if (index !== -1) {
          atendimentos[index] = { ...atendimentos[index], ...dados, id };
          localStorage.setItem('equilibriumAtendimentos', JSON.stringify(atendimentos));
        }
        resolve({ success: true, id });
      });
  });
}

function excluirAtendimento(id) {
  return new Promise((resolve) => {
    const atendimentos = getLocalStorageArray('equilibriumAtendimentos');
    const filtrados = atendimentos.filter((a) => a.id !== id);
    localStorage.setItem('equilibriumAtendimentos', JSON.stringify(filtrados));
    resolve({ success: true, id });
  });
}

window.Database = {
  syncClientes, syncAtendimentos, salvarCliente, salvarAtendimento,
  editarCliente, editarAtendimento, excluirAtendimento,
  setApiUrl, getApiUrl
};
