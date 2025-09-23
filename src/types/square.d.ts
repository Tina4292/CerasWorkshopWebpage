// Square Web SDK type definitions
export interface SquarePayments {
  card(): Promise<SquareCard>;
}

export interface SquareCard {
  attach(selector: string): Promise<void>;
  tokenize(): Promise<TokenResult>;
  destroy(): void;
}

export interface TokenResult {
  status: 'OK' | 'INVALID' | 'ERROR';
  token?: string;
  errors?: Array<{
    field?: string;
    message: string;
    type: string;
  }>;
}

export interface SquareSDK {
  payments(applicationId: string, locationId?: string): SquarePayments;
}

declare global {
  interface Window {
    Square?: SquareSDK;
  }
}

export {};