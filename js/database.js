const DATABASE_URL = 'https://script.google.com/macros/s/AKfycby6ijLv0hGmlY561Mn5_4R5XCRTbUsw7JMg5BiqFA3CdMLSfyheFkw2aO4rjHNvFxodAA/exec';

async function salvarCliente(dados) {
  try {
    console.log("Enviando dados para:", DATABASE_URL);
    const response = await fetch(DATABASE_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'salvarCliente', ...dados })
    });
    console.log("Dados enviados com sucesso.");
    return { success: true };
  } catch (error) {
    console.error('Erro no motor de salvamento:', error);
    throw error;
  }
}

window.salvarCliente = salvarCliente;
