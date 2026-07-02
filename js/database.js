const DATABASE_URL = 'https://script.google.com/macros/s/AKfycby6ijLv0hGmlY561Mn5_4R5XCRTbUsw7JMg5BiqFA3CdMLSfyheFkw2aO4rjHNvFxodAA/exec';

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
