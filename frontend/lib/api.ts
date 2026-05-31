import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: (refreshToken: string) => api.post("/auth/logout", { refreshToken }),
};

// Products
export const productsApi = {
  getAll: (params?: Record<string, string | number | undefined>) =>
    api.get("/products", { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: FormData | Record<string, unknown>) => api.post("/products", data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    // Content-Type не задаём — браузер сам выставит multipart/form-data с boundary
    return api.post<{ url: string }>("/products/upload", fd, {
      headers: { "Content-Type": undefined },
    });
  },
};

// Catalog
export const catalogApi = {
  getCategories: () => api.get("/categories"),
  getBrands: () => api.get("/brands"),
};

// Cart
export const cartApi = {
  get: () => api.get("/cart"),
  addItem: (productId: number, quantity: number) =>
    api.post("/cart/items", { productId, quantity }),
  updateItem: (id: number, quantity: number) =>
    api.patch(`/cart/items/${id}`, { quantity }),
  removeItem: (id: number) => api.delete(`/cart/items/${id}`),
};

// Orders
export const ordersApi = {
  create: (data: { address: string; phone: string }) => api.post("/orders", data),
  getMy: () => api.get("/orders/my"),
  getAll: (params?: Record<string, number>) => api.get("/orders", { params }),
  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// Admin
export const adminApi = {
  getUsers: (params?: Record<string, number>) =>
    api.get("/admin/users", { params }),
};
