/**
 * API utility for making requests with proper error handling
 * Prevents HTML responses from being parsed as JSON
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Safe fetch wrapper that handles errors and validates JSON responses
 */
export async function apiFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new ApiError(
        `Expected JSON response but got ${contentType || "unknown"}`,
        response.status
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || data.error || "API request failed",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors, JSON parse errors, etc.
    if (error instanceof Error) {
      throw new ApiError(error.message);
    }

    throw new ApiError("Unknown error occurred");
  }
}

/**
 * Wallet API endpoints
 */
export const walletApi = {
  async createWallet() {
    return apiFetch<{
      success: boolean;
      grudgeId: string;
      solanaAddress: string;
      publicKey: string;
      privateKey: string;
    }>("/api/wallet/create", {
      method: "POST",
    });
  },

  async getWallet(grudgeId: string) {
    return apiFetch<{
      success: boolean;
      grudgeId: string;
      solanaAddress: string;
    }>(`/api/wallet/${grudgeId}`);
  },
};

/**
 * Game API endpoints
 */
export const gameApi = {
  async getCharacters() {
    return apiFetch<{
      characters: Array<{
        id: string;
        name: string;
        faction: string;
      }>;
    }>("/api/game/characters");
  },

  async saveGameState(playerId: string, gameState: any) {
    return apiFetch<{
      success: boolean;
      playerId: string;
      saved: boolean;
    }>("/api/game/save", {
      method: "POST",
      body: JSON.stringify({ playerId, gameState }),
    });
  },
};

/**
 * Optional: Safely try to fetch data, return null on failure
 */
export async function safeFetch<T>(
  fetcher: () => Promise<T>
): Promise<T | null> {
  try {
    return await fetcher();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("API Error:", error.message, error.status);
    } else {
      console.error("Fetch failed:", error);
    }
    return null;
  }
}
