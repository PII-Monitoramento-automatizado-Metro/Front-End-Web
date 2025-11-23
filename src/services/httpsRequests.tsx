import type { LogType } from "../types/log";
import type { ObraType } from "../types/Obra";
import type { UserResponse } from "../types/User";

const BASE_URL = "http://127.0.0.1:8000";

// --- HELPER TO GET CURRENT USER ---
const getFuncional = () =>
  localStorage.getItem("user_funcional") || "Visitante";

// -----------------------------------------------------------------
// 1. AUTHENTICATION
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

// -----------------------------------------------------------------
// 2. OBRAS (WORKS)
// -----------------------------------------------------------------

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

export async function getObraByIdRequest(id: string): Promise<ObraType> {
  try {
    const response = await fetch(`${BASE_URL}/obras/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes da obra");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no getObraByIdRequest:", error);
    throw error;
  }
}

export async function createObraRequest(obraData: {
  nome: string;
  linha: string;
  data_inicio: string;
  data_final: string;
  arquivos?: File[];
}) {
  try {
    const formData = new FormData();
    formData.append("nome", obraData.nome);
    formData.append("linha", obraData.linha);
    formData.append("data_inicio", obraData.data_inicio);
    formData.append("data_final", obraData.data_final);

    // SEND USER ID FOR LOGGING
    formData.append("funcional_usuario", getFuncional());

    if (obraData.arquivos && obraData.arquivos.length > 0) {
      obraData.arquivos.forEach((arquivo) => {
        formData.append("fotos", arquivo);
      });
    }

    const response = await fetch(`${BASE_URL}/obras`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar obra: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no createObraRequest:", error);
    throw error;
  }
}

export async function deleteObraRequest(id: string) {
  try {
    const funcional = getFuncional();
    // Send user via URL query param for DELETE requests
    const response = await fetch(
      `${BASE_URL}/obras/${id}?funcional_usuario=${funcional}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao excluir obra");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro no deleteObraRequest:", error);
    throw error;
  }
}

// -----------------------------------------------------------------
// 3. REGISTROS (RECORDS)
// -----------------------------------------------------------------

export async function addRegistroRequest(
  idObra: string,
  arquivos: File[],
  data: string
) {
  try {
    const formData = new FormData();
    formData.append("data", data);

    // SEND USER ID FOR LOGGING
    formData.append("funcional_usuario", getFuncional());

    arquivos.forEach((arquivo) => {
      formData.append("fotos", arquivo);
    });

    const response = await fetch(`${BASE_URL}/obras/${idObra}/registros`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erro ao adicionar registro");
    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

export async function deleteRegistroRequest(
  idObra: string,
  idRegistro: string
) {
  try {
    const funcional = getFuncional();
    // Send user via URL query param
    const response = await fetch(
      `${BASE_URL}/obras/${idObra}/registros/${idRegistro}?funcional_usuario=${funcional}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao excluir registro");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no deleteRegistroRequest:", error);
    throw error;
  }
}

// -----------------------------------------------------------------
// 4. USERS & LOGS
// -----------------------------------------------------------------

export async function getUserDataRequest(
  funcional: string
): Promise<UserResponse> {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${funcional}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no getUserDataRequest:", error);
    throw error;
  }
}

export async function listLogsRequest(): Promise<LogType[]> {
  try {
    const response = await fetch(`${BASE_URL}/logs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Erro ao buscar logs");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
