import { authapi } from "../lib/axios";

const BASE = "/api/notifications";

/**
 * Fetch paginated notifications for the logged-in user.
 * @param {{ page?, limit?, type?, is_read? }} params
 */
export const getNotificationsAPI = async (params = {}) => {
  const res = await authapi.get(BASE, { params });
  return res.data; // { notifications, pagination }
};

/**
 * Get just the unread count (used by the bell badge).
 */
export const getUnreadCountAPI = async () => {
  const res = await authapi.get(`${BASE}/unread-count`);
  return res.data; // { unreadCount }
};

/**
 * Mark a single notification as read.
 * @param {string} id
 */
export const markAsReadAPI = async (id) => {
  const res = await authapi.patch(`${BASE}/${id}/read`);
  return res.data;
};

/**
 * Mark ALL notifications as read.
 */
export const markAllReadAPI = async () => {
  const res = await authapi.patch(`${BASE}/read-all`);
  return res.data;
};

/**
 * Delete a single notification.
 * @param {string} id
 */
export const deleteNotificationAPI = async (id) => {
  const res = await authapi.delete(`${BASE}/${id}`);
  return res.data;
};

/**
 * Delete ALL notifications for the current user.
 */
export const deleteAllNotificationsAPI = async () => {
  const res = await authapi.delete(BASE);
  return res.data;
};
