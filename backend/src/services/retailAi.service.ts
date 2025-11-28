import axios from "axios";

const RETAIL_AI_BASE_URL = "http://163.192.209.80:8080";

// ---- Tipos de datos que regresa la API de ----

export interface SearchRequest {
  customer_id: string;
  query_text: string;
}

export interface SearchResultItem {
  article_id: number;
  name: string;
  group: string;
  color: string;
  image_url: string;
  semantic_score: number;
  personal_score: number;
  final_score: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
}

export interface RecommendRequest {
  customer_id: string;
}

export interface RecommendResultItem {
  article_id: number;
  name: string;
  group: string;
  color: string;
  image_url: string;
  score: number;
}

export interface RecommendResponse {
  recommendations: RecommendResultItem[];
}

// ---- Funciones que consumen la API externa ----

export async function retailAiSearch(
  payload: SearchRequest
): Promise<SearchResponse> {
  const { data } = await axios.post<SearchResponse>(
    `${RETAIL_AI_BASE_URL}/search`,
    payload
  );
  return data;
}

export async function retailAiRecommend(
  payload: RecommendRequest
): Promise<RecommendResponse> {
  const { data } = await axios.post<RecommendResponse>(
    `${RETAIL_AI_BASE_URL}/recommend`,
    payload
  );
  return data;
}
