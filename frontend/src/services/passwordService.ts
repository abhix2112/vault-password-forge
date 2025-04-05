// Base API URL for all password-related services
const API_BASE_URL = "http://192.168.1.101:3000";

export interface SecurityScore {
  overall: number;
  banking: number;
  social_media: number;
  email: number;
  strength_details: Record<string, boolean>;
}

interface PasswordResponse {
  password: string;
  security_score: SecurityScore;
}

interface PassphraseResponse {
  passphrase: string;
  security_score: SecurityScore;
}

interface BreachResponse {
  breached: boolean;
  message: string;
}

/**
 * Generate a secure password based on provided options
 */
export const generatePassword = async (
  length: number = 16,
  symbols: boolean = true,
  numbers: boolean = true
): Promise<PasswordResponse> => {
  try {
    const params = new URLSearchParams({
      length: length.toString(),
      symbols: symbols.toString(),
      numbers: numbers.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/generate?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating password:", error);
    throw error;
  }
};

/**
 * Generate a passphrase with specified number of words
 */
export const generatePassphrase = async (
  words: number = 4
): Promise<PassphraseResponse> => {
  try {
    const params = new URLSearchParams({
      words: words.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/passphrase?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating passphrase:", error);
    throw error;
  }
};

/**
 * Check if a password has been compromised in known data breaches
 */
export const checkPasswordBreach = async (
  password: string
): Promise<BreachResponse> => {
  try {
    const params = new URLSearchParams({
      password: password,
    });

    const response = await fetch(
      `${API_BASE_URL}/breach-check?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking password breach:", error);
    throw error;
  }
};

/**
 * Check security score of a password
 */
export const checkSecurity = async (
  password: string
): Promise<{ security_score: SecurityScore }> => {
  try {
    const params = new URLSearchParams({
      password: password,
    });

    const response = await fetch(
      `${API_BASE_URL}/security-check?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking security:", error);
    throw error;
  }
};

export const passwordService = {
  generatePassword,
  generatePassphrase,
  checkPasswordBreach,
  checkSecurity,
};
