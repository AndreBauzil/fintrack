import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// DATE CORRECTION:
// Receives "2025-12-01" and returns "01/12/2025" 
export function formatDateDisplay(dateString: string) {
  if (!dateString) return "--/--/----"
  const parts = dateString.split('-')
  if (parts.length >= 3) {
    const year = parts[0]
    const month = parts[1]
    const day = parts[2].substring(0, 2) 
    return `${day}/${month}/${year}`
  }
  return dateString
}

export async function getExchangeRate(currency: string): Promise<number> {
  if (currency === 'BRL') return 1;
  
  // Busca a cotação (Ex: USD-BRL)
  const res = await fetch(`https://economia.awesomeapi.com.br/last/${currency}-BRL`, {
    next: { revalidate: 60 } // Cache por 60 segundos
  });
  
  if (!res.ok) throw new Error("Falha ao obter cotação");
  
  const data = await res.json();
  const pairKey = `${currency}BRL`; // A API retorna chaves como USDBRL
  return parseFloat(data[pairKey].bid);
}