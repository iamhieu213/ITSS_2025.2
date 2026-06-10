const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  getClassroom: () => request("/classroom"),
  getStudents: (params) => request(`/students${toQuery(params)}`),
  getStudent: (id) => request(`/students/${id}`),
  updateStudent: (id, payload) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  getTeams: () => request("/teams"),
  createTeam: (payload) => request("/teams", { method: "POST", body: JSON.stringify(payload) }),
  getJoinRequests: (params) => request(`/teams/join-requests${toQuery(params)}`),
  createJoinRequest: (teamId, payload) =>
    request(`/teams/${teamId}/join-requests`, { method: "POST", body: JSON.stringify(payload) }),
  updateJoinRequestStatus: (requestId, status) =>
    request(`/teams/join-requests/${requestId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteJoinRequest: (requestId) =>
    request(`/teams/join-requests/${requestId}`, { method: "DELETE" }),
  getProfile: (studentId) => request(`/profile/me${studentId ? toQuery({ studentId }) : ""}`)
};
