// Este arquivo define o "formato" dos dados para o TypeScript

// 1. O formato de uma Obra (igual ao que o Backend espera/envia)
export interface RegistroType {
  id: string;
  data: string;
  fotos: string[]; // <-- AGORA É UM ARRAY DE STRINGS
}

export interface ObraType {
  id: string;
  nome: string;
  linha: string;
  progresso_atual: number;
  data_inicio: string;
  data_final: string;
  // Agora temos uma lista de registros em vez de fotos soltas
  registros?: RegistroType[];
  fotos?: string[]; // Mantemos por compatibilidade antiga, se quiser
}

// 2. O formato da resposta quando criamos uma obra
export interface CreateResponse {
  success: boolean;
  message: string;
  id: string;
}

// 3. O formato dos dados do usuário (usado no login)
export interface UserData {
  _id: string;
  nome: string;
  funcional: string;
  [key: string]: any; // Permite outros campos extras
}
