import axios from "axios";

const ODA_BASE_URL = process.env.ODA_BASE_URL ?? "http://163.192.209.80:8080";

type Nullable<T> = T | null | undefined;

export interface OdaSearchRequest {
  customer_id: string;
  query_text: string;
}

export interface OdaSearchResult {
  article_id: number;
  name?: string;
  group?: string;
  color?: string;
  type?: string;
  detail?: string;
  details?: string;
  description?: string;
  description_vector?: string;
  image_url?: Nullable<string>;
  semantic_score?: number;
  personal_score?: number;
  final_score?: number;
}

export interface OdaSearchResponse {
  results: OdaSearchResult[];
}

export interface OdaRecommendRequest {
  customer_id: string;
}

export interface OdaRecommendResult {
  article_id: number;
  name?: string;
  group?: string;
  color?: string;
  type?: string;
  image_url?: Nullable<string>;
  score?: number;
}

export interface OdaRecommendResponse {
  recommendations: OdaRecommendResult[];
}

export async function odaSearch(
  payload: OdaSearchRequest
): Promise<OdaSearchResponse> {
  const { data } = await axios.post<OdaSearchResponse>(
    `${ODA_BASE_URL}/search`,
    payload
  );
  return data;
}

export async function odaRecommend(
  payload: OdaRecommendRequest
): Promise<OdaRecommendResponse> {
  const { data } = await axios.post<OdaRecommendResponse>(
    `${ODA_BASE_URL}/recommend`,
    payload
  );
  return data;
}
