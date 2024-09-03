// src/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Cambia esto según la IP o el dominio de tu servidor
    timeout: 10000,
});

export default api;
