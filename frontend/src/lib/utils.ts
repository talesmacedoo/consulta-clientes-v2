import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validação de cpf
 * @param cpf - CPF 
 * @returns boolean indicando se o CPF é válido ou não
 */
export function validateCPF(cpf: string): boolean {
  // remove todos os caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

/**
 * Formata cpf para o formato XXX.XXX.XXX-XX
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Valida um número de telefone
 * @param phone - telefone
 * @returns boolean indicando se o telefone é válido ou não
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');

  
  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) return false;

  const ddd = cleanPhone.slice(0, 2);
  const number = cleanPhone.slice(2);

  // Ddd não pode começar com 0
  if (ddd.startsWith('0')) return false;

  if (cleanPhone.length === 11 && !number.startsWith('9')) return false;

  return true;
}

/**
 * formata um número de telefone para o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param value - telefone string
 * @returns Número de telefone formatado
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Formata data de YYYY-MM-DD para DD/MM/YYYY
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Não informada';
  
  // Se já estiver no formato DD/MM/YYYY, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  
  // Tenta converter de YYYY-MM-DD para DD/MM/YYYY
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  return dateStr;
}

/**
 * Calcula a idade com base em uma data de nascimento
 * @param birthDateStr - Data de nascimento em formato YYYY-MM-DD ou DD/MM/YYYY
 */
export function calculateAge(birthDateStr: string | null | undefined): number | null {
  if (!birthDateStr) return null;

  let birthDate: Date;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthDateStr)) {
    const [day, month, year] = birthDateStr.split('/').map(Number);
    birthDate = new Date(year, month - 1, day);
  } else {
    birthDate = new Date(birthDateStr);
  }

  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
