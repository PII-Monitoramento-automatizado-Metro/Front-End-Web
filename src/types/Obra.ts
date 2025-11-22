// Este arquivo define o "formato" dos dados para o TypeScript

// 1. O formato de uma Obra (igual ao que o Backend espera/envia)
export interface ObraType {
  id?: string; // O ID é opcional na criação, mas vem na listagem
  nome: string;
  linha: string;
  progresso_atual: number;
  data_inicio: string; // Datas como string (ex: "2024-01-01")
  data_final: string;
  fotos: string[]; // Lista de URLs de fotos
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
