import { API_BASE_URL } from "../constants/api";

export async function sendOdaMessage(text: string, userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/oda`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, userId }),
  });

  if (!response.ok) {
    throw new Error(`ODA API error: ${response.status}`);
  }

  return response.json();
}

export async function searchProducts(customer_id: string, query_text: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customer_id, query_text }),
  });

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status}`);
  }

  return response.json();
}

export async function recommendProducts(customer_id: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customer_id }),
  });

  if (!response.ok) {
    throw new Error(`Recommend API error: ${response.status}`);
  }

  return response.json();
}
