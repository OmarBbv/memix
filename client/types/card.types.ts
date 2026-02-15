export interface Card {
  id: number;
  holderName: string;
  cardNumberMasked: string; // **** **** **** 1234
  last4: string;
  brand: string; // visa, mastercard, amex
  expMonth: number;
  expYear: number;
  color: string; // blue, black, purple, pink
  userId: number;
}

export interface CreateCardRequest {
  holderName: string;
  cardNumber: string; // Full number (will be masked on server)
  expMonth: number;
  expYear: number;
  cvv: string; // Not stored, just for validation if we were doing real payments
  color?: string;
}
