const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () =>
{
   if (typeof window !== 'undefined')
   {
      return localStorage.getItem('token');
   }
   return null;
};

const setToken = (token) =>
{
   if (typeof window !== 'undefined')
   {
      localStorage.setItem('token', token);
   }
};

const logoutUser = () =>
{
   if (typeof window !== 'undefined')
   {
      localStorage.removeItem('token');
   }
};

const headers = (auth = false) =>
{
   const baseHeaders =
   {
      'Content-Type': 'application/json'
   };

   if (auth)
   {
      const token = getToken();

      if (token)
      {
         baseHeaders.Authorization = `Bearer ${token}`;
      }
   }

   return baseHeaders;
};

const handleResponse = async (res) =>
{
   const data = await res.json();

   if (!res.ok)
   {
      throw new Error(data.message || 'Something went wrong');
   }

   return data;
};

export const loginUser = async (email, password) =>
{
   const res = await fetch(`${BASE_URL}/auth/login`,
   {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password })
   });

   return handleResponse(res);
};

export const registerUser = async (name, email, password) =>
{
   const res = await fetch(`${BASE_URL}/auth/register`,
   {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name, email, password })
   });

   return handleResponse(res);
};

export const getSummary = async () =>
{
   const res = await fetch(`${BASE_URL}/summary`,
   {
      headers: headers(true)
   });

   return handleResponse(res);
};

export const createRecord = async (data) =>
{
   const res = await fetch(`${BASE_URL}/records`,
   {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data)
   });

   return handleResponse(res);
};

export const getRecords = async (params = {}) =>
{
   const query = new URLSearchParams(params).toString();

   const res = await fetch(`${BASE_URL}/records${query ? `?${query}` : ''}`,
   {
      headers: headers(true)
   });

   return handleResponse(res);
};

export const updateRecord = async (id, data) =>
{
   const res = await fetch(`${BASE_URL}/records/${id}`,
   {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data)
   });

   return handleResponse(res);
};

export const deleteRecord = async (id) =>
{
   const res = await fetch(`${BASE_URL}/records/${id}`,
   {
      method: 'DELETE',
      headers: headers(true)
   });

   return handleResponse(res);
};

export const getUsers = async () =>
{
   const res = await fetch(`${BASE_URL}/users`,
   {
      headers: headers(true)
   });

   return handleResponse(res);
};

export const updateUserRole = async (id, role) =>
{
   const res = await fetch(`${BASE_URL}/users/${id}/role`,
   {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ role })
   });

   return handleResponse(res);
};

export const updateUserStatus = async (id, isActive) =>
{
   const res = await fetch(`${BASE_URL}/users/${id}/status`,
   {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ isActive })
   });

   return handleResponse(res);
};

export const deleteUser = async (id) =>
{
   const res = await fetch(`${BASE_URL}/users/${id}`,
   {
      method: 'DELETE',
      headers: headers(true)
   });

   return handleResponse(res);
};

export const getMyProfile = async () =>
{
   const res = await fetch(`${BASE_URL}/users/me`,
   {
      headers: headers(true)
   });

   return handleResponse(res);
};

export const updateMyProfile = async (data) =>
{
   const res = await fetch(`${BASE_URL}/users/me`,
   {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data)
   });

   return handleResponse(res);
};

export const changePassword = async (data) =>
{
   const res = await fetch(`${BASE_URL}/users/me/password`,
   {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data)
   });

   return handleResponse(res);
};

export const deleteMyAccount = async () =>
{
   const res = await fetch(`${BASE_URL}/users/me`,
   {
      method: 'DELETE',
      headers: headers(true)
   });

   return handleResponse(res);
};

export
{
   setToken,
   logoutUser
};

