export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const BASE_URL = "https://sacola-backend-test.onrender.com" as const;

export interface ApiResponse<T> {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string;
}

export interface AuthLoginResponse {
  message: string;
  otp?: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  user: unknown;
}
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  token?: string | null;
  body?: TBody;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  responseType?: AxiosRequestConfig["responseType"];
}

function buildUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function toQueryString(query?: RequestOptions["query"]) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || "Request failed";
    const enhancedError = new Error(message);
    
    // Preserve original error information
    (enhancedError as any).response = error?.response;
    (enhancedError as any).status = error?.response?.status;
    (enhancedError as any).statusText = error?.response?.statusText;
    (enhancedError as any).originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", token, body, query, headers, responseType } = options;
  const url = buildUrl(path) + toQueryString(query);
  
  // Debug logging for POST/PUT requests
  if ((method === "POST" || method === "PUT") && body) {
    console.log(`API ${method} ${path}:`, {
      url,
      body,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(headers || {}) }
    });
  }
  
  const res = await api.request<TResponse>({
    url,
    method,
    data: body,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(headers || {}) },
    responseType,
  });
  return res.data as TResponse;
}

// Auth endpoints
export const AuthApi = {
  register(body: {
    email: string;
    password: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) {
    return apiFetch<ApiResponse<unknown>>("/auth/register", { method: "POST", body });
  },
  login(body: { email: string; password: string }) {
    return apiFetch<ApiResponse<{ message: string; otp?: string }>>("/auth/login", {
      method: "POST",
      body,
    });
  },
  verifyOtp(body: { email: string; otp: string }) {
    return apiFetch<ApiResponse<VerifyOtpResponse>>("/auth/verify-otp", {
      method: "POST",
      body,
    });
  },
  logout(token: string) {
    return apiFetch<ApiResponse<unknown>>("/auth/logout", { method: "POST", token });
  },
  changePassword(token: string, body: { currentPassword: string; newPassword: string; confirmNewPassword: string }) {
    return apiFetch<ApiResponse<unknown>>("/auth/change-password", { method: "POST", token, body });
  },
  requestReset(body: { email: string }) {
    return apiFetch<ApiResponse<unknown>>("/auth/request-reset", { method: "POST", body });
  },
  forgotPassword(body: { email: string }) {
    return apiFetch<ApiResponse<unknown>>("/auth/forgot-password", { method: "POST", body });
  },
  resetPassword(body: { email: string; token: string; otp: string; newPassword: string; confirmNewPassword: string }) {
    return apiFetch<ApiResponse<unknown>>("/auth/reset-password", { method: "POST", body });
  },
  verifyResetToken(body: { email: string; token: string; otp: string }) {
    return apiFetch<ApiResponse<unknown>>("/auth/verify-reset-token", { method: "POST", body });
  },
  updatePasswordByEmail(email: string, body: { newPassword: string; confirmNewPassword: string }) {
    return apiFetch<ApiResponse<unknown>>("/auth/update-password", {
      method: "POST",
      body,
      query: { email },
    });
  },
  profile(token: string) {
    return apiFetch<ApiResponse<unknown>>("/auth/profile", { token });
  },
};

// User profile endpoints
export const UsersApi = {
  me(token: string) {
    return apiFetch<ApiResponse<unknown>>("/api/users/me", { token });
  },
  changeMyPassword(token: string, body: { currentPassword: string; newPassword: string; confirmNewPassword: string }) {
    return apiFetch<ApiResponse<unknown>>("/api/users/me/password", { method: "PUT", token, body });
  },
};

// Generic CRUD helper
function createCrud<TCreate extends object, TUpdate extends object, TEntity = any>(basePath: string) {
  return {
    create: (token: string, body: TCreate) =>
      apiFetch<ApiResponse<TEntity>>(basePath, { method: "POST", token, body }),
    list: (
      token: string,
      query?: Record<string, string | number | boolean | undefined>
    ) => apiFetch<ApiResponse<{ items?: TEntity[] } | TEntity[] | unknown>>(basePath, { token, query }),
    get: (token: string, id: string) => apiFetch<ApiResponse<TEntity>>(`${basePath}/${id}`, { token }),
    update: (token: string, id: string, body: TUpdate) =>
      apiFetch<ApiResponse<TEntity>>(`${basePath}/${id}`, { method: "PUT", token, body }),
    remove: (token: string, id: string) => apiFetch<ApiResponse<unknown>>(`${basePath}/${id}`, { method: "DELETE", token }),
  } as const;
}

// Reports
export const ReportsApi = {
  generate: (
    token: string,
    body: {
      projectCategory: "Conservation" | "Socio-Economic";
      projectType: string;
      reportType: "Annual" | "Monthly" | "Custom";
      dateRangeStart: string;
      dateRangeEnd: string;
    }
  ) => apiFetch<ApiResponse<unknown>>("/api/reports/generate", { method: "POST", token, body }),
  list: (token: string) => apiFetch<ApiResponse<unknown>>("/api/reports", { token }),
  get: (token: string, id: string) => apiFetch<ApiResponse<unknown>>(`/api/reports/${id}`, { token }),
  download: (token: string, id: string) => apiFetch<Blob>(`/api/reports/${id}/download`, { token, responseType: "blob" }),
};

// Conservation endpoints
export const ConservationApi = {
  bamboo: {
    ...createCrud<
      { distanceCovered: number; location: string; datePlanted: string; description?: string },
      { distanceCovered: number; location: string; datePlanted: string; description?: string }
    >("/api/conservation/bamboo"),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/bamboo/stats", { token }),
  },
  waterTanks: {
    ...createCrud<
      { tankType: string; location: string; numberOfTanks: number; dateDonated: string; description?: string; targetBeneficiaries: number; currentBeneficiaries: number },
      { tankType: string; location: string; numberOfTanks: number; dateDonated: string; description?: string; targetBeneficiaries: number; currentBeneficiaries: number }
    >("/api/conservation/water-tanks"),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/water-tanks/stats", { token }),
  },
  treePlanting: {
    ...createCrud<
      { treeType: string; location: string; numberOfTrees: number; datePlanted: string; description?: string; targetBeneficiaries: number; currentBeneficiaries: number },
      { treeType: string; location: string; numberOfTrees: number; datePlanted: string; description?: string; targetBeneficiaries: number; currentBeneficiaries: number }
    >("/api/conservation/tree-planting"),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/tree-planting/stats", { token }),
  },
  buffaloWall: {
    ...createCrud<
      { dateRepaired: string; cost: number },
      { dateRepaired: string; cost: number }
    >("/api/conservation/buffalo-wall"),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/buffalo-wall/stats", { token }),
  },
  euFundedProjects: {
    ...createCrud<
      { district: string; location: string; numberOfTrees: number; datePlanted: string; description?: string; targetBeneficiaries: number; currentBeneficiaries: number },
      { district: string; location: string; numberOfTrees: number; datePlanted: string; description?: string; targetBeneficiaries: number; currentBeneficiaries: number }
    >("/api/conservation/eu-projects"),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/eu-projects/stats", { token }),
  },
  projects: {
    ...createCrud<
      { name: string; description?: string; location: string; startDate?: string; endDate?: string; status?: string; budget?: number; contactPerson?: string; contactEmail?: string; contactPhone?: string; notes?: string },
      { name: string; description?: string; location: string; startDate?: string; endDate?: string; status?: string; budget?: number; contactPerson?: string; contactEmail?: string; contactPhone?: string; notes?: string }
    >("/api/conservation/projects"),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/projects/stats", { token }),
  },
  customProjects: {
    ...createCrud<
      { projectName: string; location: string; startingDate: string; description?: string; entries?: Array<{ name: string; number: number }> },
      { projectName: string; location: string; startingDate: string; description?: string; entries?: Array<{ name: string; number: number }> }
    >("/api/conservation/other"),
    addEntry: (token: string, id: string, body: { name: string; number: number }) =>
      apiFetch<ApiResponse<unknown>>(`/api/conservation/other/${id}/entries`, { method: "POST", token, body }),
    updateEntry: (token: string, id: string, entryId: string, body: { name: string; number: number }) =>
      apiFetch<ApiResponse<unknown>>(`/api/conservation/other/${id}/entries/${entryId}`, { method: "PUT", token, body }),
    deleteEntry: (token: string, id: string, entryId: string) =>
      apiFetch<ApiResponse<unknown>>(`/api/conservation/other/${id}/entries/${entryId}`, { method: "DELETE", token }),
    stats: (token: string) => apiFetch<ApiResponse<unknown>>("/api/conservation/other/stats", { token }),
  },
};

// Socio-Economic endpoints (common CRUD)
export const SocioEconomicApi = {
  educationInfrastructures: createCrud<
    { schoolName: string; location: string; infrastructureType: string; dateDonated: string; description?: string },
    { schoolName: string; location: string; infrastructureType: string; dateDonated: string; description?: string }
  >("/api/socio-economic/education/infrastructures"),
  educationMaterials: createCrud<
    { materialType: string; location: string; distributedMaterials: number; dateDonated: string; targetBeneficiaries: number; currentBeneficiaries: number; description?: string },
    { materialType: string; location: string; distributedMaterials: number; dateDonated: string; targetBeneficiaries: number; currentBeneficiaries: number; description?: string }
  >("/api/socio-economic/education/materials"),
  educationStudents: createCrud<
    { studentName: string; studentLocation: string; schoolName: string; schoolLocation: string; class: string; fundingYears: number; supportAmount: number; date: string; description?: string },
    { studentName: string; studentLocation: string; schoolName: string; schoolLocation: string; class: string; fundingYears: number; supportAmount: number; date: string; description?: string }
  >("/api/socio-economic/education/students"),
  itTraining: createCrud<
    { name: string; location: string; numPeople: number; materials?: string; trainingDuration?: number; date: string; description?: string },
    { name: string; location: string; numPeople: number; materials?: string; trainingDuration?: number; date: string; description?: string }
  >("/api/socio-economic/it-training"),
  healthCentres: createCrud<
    { healthCentreName: string; location: string; dateBuilt: string; description?: string },
    { healthCentreName: string; location: string; dateBuilt: string; description?: string }
  >("/api/socio-economic/health-centres"),
  sports: createCrud<
    { sportName: string; location: string; condition: string; dateBuilt: string; description?: string },
    { sportName: string; location: string; condition: string; dateBuilt: string; description?: string }
  >("/api/socio-economic/sports"),
  offices: createCrud<
    { officeName: string; location: string; dateBuilt: string; description?: string },
    { officeName: string; location: string; dateBuilt: string; description?: string }
  >("/api/socio-economic/offices"),
  housingMaterials: createCrud<
    { materialType: string; location: string; distributedMaterials: number; dateDonated: string; targetBeneficiaries: number; currentBeneficiaries: number; description?: string },
    { materialType: string; location: string; distributedMaterials: number; dateDonated: string; targetBeneficiaries: number; currentBeneficiaries: number; description?: string }
  >("/api/socio-economic/housing/materials"),
  housingToilets: createCrud<
    { toiletType: string; toiletsBuilt: number; location: string; dateDonated: string; targetBeneficiaries: number; currentBeneficiaries: number; description?: string },
    { toiletType: string; toiletsBuilt: number; location: string; dateDonated: string; targetBeneficiaries: number; currentBeneficiaries: number; description?: string }
  >("/api/socio-economic/housing/toilets"),
  housingHouses: createCrud<
    { houseCategory: string; houseOwner: string; location: string; dateBuilt: string; houseCondition: string; materials?: string; description?: string },
    { houseCategory: string; houseOwner: string; location: string; dateBuilt: string; houseCondition: string; materials?: string; description?: string }
  >("/api/socio-economic/housing/houses"),
  housingRepairs: createCrud<
    { houseOwner: string; location: string; dateRepaired: string; description?: string },
    { houseOwner: string; location: string; dateRepaired: string; description?: string }
  >("/api/socio-economic/housing/repairs"),
  housingVillages: createCrud<
    { villageName: string; location: string; totalHouses: number; dateBuilt: string; goodCondition?: number; badCondition?: number; badConditionDescription?: string; description?: string },
    { villageName: string; location: string; totalHouses: number; dateBuilt: string; goodCondition?: number; badCondition?: number; badConditionDescription?: string; description?: string }
  >("/api/socio-economic/housing/villages"),
  otherProjects: createCrud<
    { category: string; name: string; location: string; date: string; description?: string },
    { category: string; name: string; location: string; date: string; description?: string }
  >("/api/socio-economic/other"),
  waterPumps: createCrud<
    { pumpName: string; location: string; dateBuilt: string; pumpCondition: string; description?: string },
    { pumpName: string; location: string; dateBuilt: string; pumpCondition: string; description?: string }
  >("/api/socio-economic/water-pumps"),
  parking: createCrud<
    { parkingName: string; carsSupported: number; location: string; dateBuilt: string; description?: string },
    { parkingName: string; carsSupported: number; location: string; dateBuilt: string; description?: string }
  >("/api/socio-economic/parking"),
};
