// src/types/Obra.ts

// 1. Definição do objeto de Foto
export interface FotoType {
  public_url: string; // O link acessível pelo navegador
  gs_uri?: string; // O link interno do Google (opcional)
  nome_original?: string; // Nome do arquivo (opcional)
}

// --- ADICIONE ISTO AQUI (ESTAVA FALTANDO) ---
export interface AnaliseType {
  descricao: string;
  porcentagem_conclusao: number;
}
// --------------------------------------------

// 2. Formato de um Registro (Álbum de fotos)
export interface RegistroType {
  id: string;
  data: string;
  // Aceita lista de strings (legado) OU lista de objetos FotoType (novo)
  fotos: (string | FotoType)[];
  analise?: AnaliseType; // Agora o TS sabe o que é isso
}

// 3. Formato da Obra Principal
export interface ObraType {
  id: string;
  nome: string;
  linha: string;
  progresso_atual: number;
  data_inicio: string;
  data_final: string;
  status_calculado?: "concluida" | "atrasada" | "em_progresso";
  registros?: RegistroType[];

  // Fotos de referência (Modelo BIM)
  fotos?: (string | FotoType)[];
}

// 4. Respostas de API
export interface CreateResponse {
  success: boolean;
  message: string;
  id: string;
}

// 5. Dados do Usuário
export interface UserData {
  _id: string;
  nome: string;
  funcional: string;
  [key: string]: any;
}
