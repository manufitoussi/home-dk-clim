import Fetch, { RequestInit } from 'electron-fetch';
const fetch = (Fetch as any).default as typeof Fetch;

export const get = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'GET' });
};

export const post = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'POST' });
};

export const put = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'PUT' });
};

export const del = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'DELETE' });
};

export const patch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'PATCH' });
};

export const head = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'HEAD' });
};

export const options = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'OPTIONS' });
};

export const trace = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'TRACE' });
};

export const connect = async (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, method: 'CONNECT' });
};
