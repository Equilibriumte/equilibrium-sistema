const DATABASE_URL = 'https://script.google.com/macros/s/AKfycbx-uKmdoSwoTelfZsl_Mjx0dCOE2uVdowAOyg9L0u23te_g7getcZAhKMtrRQ5f3pi0/exec';

async function salvarCliente(dados) {
  try {
    // Adicionamos a ação para o Google Script saber o que fazer
    const payload = { action: 'salvarCliente', ...dados };
    
    const response = await fetch(DATABASE_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro no motor de salvamento:', error);
    throw error;
  }
}

window.salvarCliente = salvarCliente;

// 
// AGENDA DE GRÁFICOS
// 
async function listarEventos() {
  const response = await fetch(DATABASE_URL + '?action=listar_eventos');
  const data = await response.json();
  return data;
}

async function editarEvento(dados) {
  const response = await fetch(DATABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'editar_evento_calendario', ...dados })
  });
  const data = await response.json();
  return data;
}

async function excluirEvento(dados) {
  const response = await fetch(DATABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'excluir_evento_calendario', ...dados })
  });
  const data = await response.json();
  return data;
}
window.listarEventos = listarEventos;
window.editarEvento = editarEvento;
window.excluirEvento = excluirEvento;
