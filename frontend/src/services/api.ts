import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5100',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente Consultation
export interface ClienteResponse {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
  data_consulta: string;
}

export interface ConsultaClienteResponse {
  found: boolean;
  cliente: ClienteResponse;
}

export const consultarCliente = async (cpf: string, telefone: string): Promise<ConsultaClienteResponse> => {
  const params = new URLSearchParams();
  if (cpf) params.append('cpf', cpf);
  if (telefone) params.append('telefone', telefone);
  
  const response = await api.get(`/clientes/consultar?${params.toString()}`);
  return response.data;
};

// Quitação Calculator
export interface QuitacaoRequest {
  valorContrato: number;
  parcelasPagas: number;
  parcelasRestantes: number;
  jurosMensal: number;
  simularDesconto?: boolean;
}

export interface QuitacaoResponse {
  valorQuitacao: number;
  economiaObtida: number;
  detalhes: {
    valorOriginal: number;
    jurosEconomizados: number;
    descontoAplicado?: number;
  };
}

export const calcularQuitacao = async (data: QuitacaoRequest): Promise<QuitacaoResponse> => {
  const response = await api.post('/calculadora/quitacao', data);
  return response.data;
};

// Bank Consultation
export interface ConsultaBancoResponse {
  margemConsignavel: number;
  contratosAtivos: Array<{
    banco: string;
    valorParcela: number;
    parcelasRestantes: number;
  }>;
  possivelRefinanciamento: boolean;
}

export const consultarBanco = async (cpf: string): Promise<ConsultaBancoResponse> => {
  const response = await api.get(`/bancos/consulta/${cpf}`);
  return response.data;
};

// IA Analysis
export interface IAAnaliseRequest {
  texto: string;
}

export interface IAAnaliseResponse {
  abordagemSugerida: string;
  raciocinio: string;
  oportunidades: string[];
}

export const analisarIA = async (data: IAAnaliseRequest): Promise<IAAnaliseResponse> => {
  const response = await api.post('/ia/analisar', data);
  return response.data;
};

export default api;
