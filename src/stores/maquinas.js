import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";



export const useStoreMaquina = defineStore("maquina", () => {
    let loading = ref(false);
    let maquinas = ref([]);
    const useUsuario = useUsuarioStore()

    const listarMaquinas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/maquinas", {
                headers: {
                    token: useUsuario.token
                }
            });
            maquinas.value = response.data;
            return response;
        } catch (error) {
            console.log("Error al obtener la lista de maquinas:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const listarMaquinasActivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/maquinas/activos", {
                headers: {
                    token: useUsuario.token
                }
            })
            maquinas.value = response.data;
            return response;
        } catch {
            console.log("Error al obtener la lista de maquinas Activas:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    const listarMaquinasInactivos = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/maquinas/inactivos", {
                headers: {
                    token: useUsuario.token
                }
            })
            maquinas.value = response.data;
            return response;
        } catch {
            console.log("Error al obtener la lista de maquinas Inactivos:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    const postMaquina = async (data) => {
        try {
            loading.value = true;
            const r = await axios.post("api/maquinas", data, {
                headers: {
                    token: useUsuario.token
                }
            });
            Notify.create({
                type: "positive",
                message: "Registro exitoso",
            });
            return r;
        } catch (error) {
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const putMaquina = async (id, data) => {
        try {
            loading.value = true
            const r = await axios.put(`api/maquinas/${id}`, data, {
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

    const putActivarMaquina = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`api/maquinas/activar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            })
            return r

        } catch (error) {
            loading.value = true
            console.log(error)
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });

        } finally {
            loading.value = false

        }
    }
    const putDesactivarMaquina = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`api/maquinas/desactivar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            })
            return r

        } catch (error) {
            loading.value = true
            console.log(error)
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });

        } finally {
            loading.value = false
        }
    }

    return { listarMaquinas,listarMaquinasActivos, listarMaquinasInactivos, postMaquina, putActivarMaquina, putMaquina, putDesactivarMaquina, loading, maquinas };
},
    {
        persist: true,
    },
);
