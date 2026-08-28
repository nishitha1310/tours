const API_URL =  "https://tours-21bx.onrender.com/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  tours: () => request("/tours"),
  tour: id => request(`/tours/${id}`),
  register: body => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: body => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  booking: (body, token) => request("/bookings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  }),
  myBookings: token => request("/bookings/mine", {
    headers: { Authorization: `Bearer ${token}` }
  })
};
