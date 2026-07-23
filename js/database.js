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
