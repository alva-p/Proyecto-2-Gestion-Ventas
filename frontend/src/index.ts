import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // 👈 tu backend NestJS
  withCredentials: false, // o true si usás cookies / sesiones
});

export default API;
