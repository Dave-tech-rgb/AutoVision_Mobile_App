import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔧 Replace with your machine's local IP
export const API_BASE = 'http://192.168.1.38:8000/api';

// ─── Token Helpers ────────────────────────────────────────────────
export const getTokens = async () => {
  const access = await AsyncStorage.getItem('access_token');
  const refresh = await AsyncStorage.getItem('refresh_token');
  return { access, refresh };
};

export const saveTokens = async (access, refresh) => {
  await AsyncStorage.setItem('access_token', access);
  await AsyncStorage.setItem('refresh_token', refresh);
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
};

// ─── Core Fetch with Auto Refresh ────────────────────────────────
const authFetch = async (url, options = {}) => {
  const { access, refresh } = await getTokens();

  let response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access}`,
      ...options.headers,
    },
  });

  // Try to refresh if 401
  if (response.status === 401 && refresh) {
    const refreshRes = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      await saveTokens(data.access, refresh);
      // Retry original request
      response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access}`,
          ...options.headers,
        },
      });
    } else {
      await clearTokens();
      throw new Error('SESSION_EXPIRED');
    }
  }

  return response;
};

// ─── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    await saveTokens(data.access, data.refresh);
    return data;
  },

  logout: async () => {
    await clearTokens();
  },
};

// ─── Devices ──────────────────────────────────────────────────────
export const devicesAPI = {
  list: async () => {
    const res = await authFetch(`${API_BASE}/devices/`);
    if (!res.ok) throw new Error('Failed to fetch devices');
    return res.json();
  },

  create: async (payload) => {
    const res = await authFetch(`${API_BASE}/devices/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create device');
    return res.json();
  },

  update: async (id, payload) => {
    const res = await authFetch(`${API_BASE}/devices/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update device');
    return res.json();
  },

  delete: async (id) => {
    const res = await authFetch(`${API_BASE}/devices/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete device');
  },
};

// ─── Detection Logs ───────────────────────────────────────────────
export const detectionsAPI = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await authFetch(`${API_BASE}/detections/?${query}`);
    if (!res.ok) throw new Error('Failed to fetch detections');
    return res.json();
  },

  detect: async (base64Image) => {
    const res = await authFetch(`${API_BASE}/detect/`, {
      method: 'POST',
      body: JSON.stringify({ image: base64Image }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  },
};

// ─── Users ────────────────────────────────────────────────────────
export const usersAPI = {
  list: async () => {
    const res = await authFetch(`${API_BASE}/users/`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  create: async (payload) => {
    const res = await authFetch(`${API_BASE}/users/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  update: async (id, payload) => {
    const res = await authFetch(`${API_BASE}/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  delete: async (id) => {
    const res = await authFetch(`${API_BASE}/users/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete user');
  },
};

// ─── Dashboard Stats ──────────────────────────────────────────────
export const dashboardAPI = {
  stats: async () => {
    const [devices, detections] = await Promise.all([
      devicesAPI.list(),
      detectionsAPI.list({ page_size: 100 }),
    ]);

    const total = detections?.count ?? detections?.length ?? 0;
    const results = detections?.results ?? detections ?? [];
    const today = new Date().toISOString().split('T')[0];
    const todayCount = results.filter((d) =>
      d.detected_at?.startsWith(today)
    ).length;

    const activeDevices = (devices?.results ?? devices ?? []).filter(
      (d) => d.is_active
    ).length;

    return {
      totalDevices: (devices?.results ?? devices ?? []).length,
      activeDevices,
      totalDetections: total,
      todayDetections: todayCount,
      recentDetections: results.slice(0, 5),
    };
  },
};