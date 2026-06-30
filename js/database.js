const BASE_URL = "https://script.google.com/macros/s/AKfycbzsWzi-CTjdjG1eI-bfN5Kvy8qKQgQkzjvI6MmLgHY-xoPqhurk6_Zzo_EA5fGsje6E/exec";

async function apiCallWithMode(action, params = {}, method = "GET", mode = "cors") {
    console.log(`[database.js] apiCall iniciada: action=${action}, method=${method.toUpperCase()}, mode=${mode}`);

    const queryParams = new URLSearchParams();
    queryParams.append("action", action);

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = typeof params[key] === "object" ? JSON.stringify(params[key]) : params[key];
            queryParams.append(key, value);
        }
    }

    let url = BASE_URL;
    const options = {
        method: method.toUpperCase(),
        redirect: "follow",
        mode: mode
    };

    if (method.toUpperCase() === "GET") {
        url = `${BASE_URL}?${queryParams.toString()}`;
        console.log(`[database.js] GET URL: ${url}`);
    } else {
        options.headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        options.body = queryParams.toString();
        console.log(`[database.js] POST body: ${queryParams.toString()}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    options.signal = controller.signal;

    try {
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        console.log(`[database.js] Resposta recebida: status=${response.status}, mode=${mode}`);

        if (mode === "no-cors") {
            console.log("[database.js] Resposta opaca (no-cors). Não é possível validar o corpo.");
            return { success: true, message: "Requisição enviada no modo no-cors" };
        }

        const text = await response.text();
        console.log(`[database.js] Corpo da resposta: ${text.substring(0, 1000)}`);

        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.warn("[database.js] Resposta não é JSON válido:", parseError);
            data = { success: response.ok, text: text };
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}: ${JSON.stringify(data)}`);
        }

        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error(`[database.js] Erro na apiCall (mode=${mode}):`, error);
        throw error;
    }
}

async function apiCall(action, params = {}, method = "GET") {
    try {
        return await apiCallWithMode(action, params, method, "cors");
    } catch (corsError) {
        console.warn("[database.js] CORS falhou ou resposta bloqueada. Tentando fallback no-cors...", corsError);
        return await apiCallWithMode(action, params, method, "no-cors");
    }
}

function salvarCliente(cliente) {
    console.log("[database.js] salvarCliente chamado:", cliente);
    return apiCall("salvarCliente", cliente, "POST")
        .then((result) => {
            console.log("[database.js] salvarCliente concluído com sucesso:", result);
            return result;
        })
        .catch((error) => {
            console.error("[database.js] salvarCliente falhou:", error);
            throw error;
        });
}

function salvarAtendimento(atendimento) {
    console.log("[database.js] salvarAtendimento chamado:", atendimento);
    return apiCall("salvarAtendimento", atendimento, "POST")
        .then((result) => {
            console.log("[database.js] salvarAtendimento concluído com sucesso:", result);
            return result;
        })
        .catch((error) => {
            console.error("[database.js] salvarAtendimento falhou:", error);
            throw error;
        });
}

function buscarClientes() {
    console.log("[database.js] buscarClientes chamado");
    return apiCall("buscarClientes", {}, "GET");
}

function buscarAtendimentos() {
    console.log("[database.js] buscarAtendimentos chamado");
    return apiCall("buscarAtendimentos", {}, "GET");
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        apiCall,
        salvarCliente,
        salvarAtendimento,
        buscarClientes,
        buscarAtendimentos
    };
}
