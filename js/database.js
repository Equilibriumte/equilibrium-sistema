const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec";

async function salvarCliente(dados) {
  const payload = {
    action: "salvarCliente",
    dados: dados
  };

  console.log("[database] Enviando salvarCliente:", payload);

  try {
    const resposta = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("[database] salvarCliente enviado com sucesso.", resposta);
    return resposta;
  } catch (erro) {
    console.error("[database] Erro ao enviar salvarCliente:", erro);
    throw erro;
  }
}

window.salvarCliente = salvarCliente;
