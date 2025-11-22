import type { ObraType } from "../types/Obra";

const BASE_URL = "http://127.0.0.1:8000";

// -----------------------------------------------------------------
// 1. AUTENTICAÇÃO
// -----------------------------------------------------------------

export async function loginRequest(
  funcional: string,
  senha: string
): Promise<any> {
  try {
    const res = await fetch(BASE_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ funcional, senha }),
    });

    if (res.status === 401) {
      throw new Error("Credenciais inválidas. Funcional ou senha incorretos.");
    }

    if (!res.ok) {
      throw new Error(`Erro de servidor: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Erro no loginRequest:", error);
    throw error;
  }
}

export async function listObrasRequest(): Promise<ObraType[]> {
  try {
    const response = await fetch(`${BASE_URL}/obras`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao listar obras: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erro no listObrasRequest:", error);
    throw error;
  }
}
