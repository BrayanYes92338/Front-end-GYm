import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";


export const useStoreSede = defineStore("sede", () => {
    let loading = ref(false)
    let sedes = ref([]);
    const useUsuario = useUsuarioStore()

    const listarSedes = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/sedes", {
                headers: {
                    token: useUsuario.token
                }
            });
            sedes.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de sedes:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const listarSedesActivo = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/sedes/activos", {
                headers: {
                    token: useUsuario.token
                }
            })
            sedes.value = response.data
            return response

        } catch (error) {
            console.error("Error al obtener la lista de sedes activos:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    const listarSedesInactivo = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/sedes/inactivos", {
                headers: {
                    token: useUsuario.token
                }
            })
            sedes.value = response.data
            return response
        } catch (error) {
            console.error("Error al obtener la lista de sedes inactivos:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }


    const postSede = async (data) => {
        try {
            loading.value = true
            const r = await axios.post("api/sedes", data, {
                headers: {
                    token: useUsuario.token
                }
            })

            return r
        } catch (error) {
            loading.value = true
            console.log(error);

        } finally {
            loading.value = false
        }
    }
    const putSede = async (id, data) => {
        try {
            loading.value = true
            const r = await axios.put(`api/sedes/${id}`, data, {
                headers: {
                    token: useUsuario.token
                }
            })

            return r
        } catch (error) {
            loading.value = true
            console.log(error);

        } finally {
            loading.value = false
        }
    }
    const putactivarSede = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`api/sedes/activar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            })

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
    const putdesactivarSede = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`api/sedes/desactivar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            })

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

    return { listarSedesActivo, listarSedesInactivo, postSede, putSede, putactivarSede, putdesactivarSede, loading, listarSedes, sedes }


}, {
    persist: true,
})