import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";


export const useStoreProducto = defineStore('producto', () => {
    let loading = ref(false);
    let productos = ref([]);
    const useUsuario = useUsuarioStore()


    const listarProductos = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/productos', {
                headers: {
                    token: useUsuario.token
                }
            });
            productos.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de sedes:", error);
            throw error;
        } finally {
            loading.value = false
        }
    }
    const listarProductoActivo = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/productos/activos', {
                headers: {
                    token: useUsuario.token
                }
            });
            productos.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de sedes:", error);
            throw error;

        } finally { 
            loading.value = false
        }
    }
    const listarProductoInactivo = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/productos/inactivos', {
                headers: {
                    token: useUsuario.token
                }
            });
            productos.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de sedes:", error);
            throw error;

        } finally {
            loading.value = false
        }
    }
    const postProducto = async (data) => {
        try {
            loading.value = true;
            const r = await axios.post('api/productos', data, {
                headers: {
                    token: useUsuario.token
                }
            });
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const putProducto = async (id, data) => {
        try {
            loading.value = true;
            const r = await axios.put(`api/productos/${id}`, data, {
                headers: {
                    token: useUsuario.token
                }
            });
            return r
        } catch (error) {
            loading.value = true
            console.log(error);
        } finally {
            loading.value = false
        }
    }
    const activarProducto = async (id) => {
        try {
            loading.value = true;
            const r = await axios.put(`api/productos/activar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            });
            return r

        } catch (error) {
            loading.value = true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    }
    const desactivarProducto = async (id) => {
        try {
            loading.value = true;
            const r = await axios.put(`api/productos/desactivar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            });
            return r

        } catch (error) {
            loading.value = true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    }


    return { listarProductos,listarProductoActivo,listarProductoInactivo, postProducto, putProducto, activarProducto, desactivarProducto, loading, productos }
},
    {
        persist: true,
    },
);