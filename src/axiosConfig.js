import axios from 'axios';

// Configuração global do axios, como a URL base da API
const axiosInstance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
});

export default axiosInstance;