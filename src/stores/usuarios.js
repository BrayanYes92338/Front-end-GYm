import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUsuarioStore = defineStore("usuarios", () => {
    let token = ref("")
    let loading = ref(false)
    let usuarios = ref([]);
    let user = ref({})
    


    const listarUsuarios = async () => {
        try {
            loading.value = true;
            console.log(token.value);
            const response = await axios.get("api/usuarios", {
                headers: {
                    token: token.value
                }
            });
            usuarios.value = response.data;
            return response;

        } catch (error) {
            console.error('Error al obtener la lista de usuarios', error);
            throw error;

        } finally {
            loading.value = false
        }
    }

    const postUsuarios = async (data) => {
        try {
            loading.value = true
            let res = await axios.post("api/usuarios", data, {
                headers: {
                    token: token.value
                }
            })
            return res;
        } catch (error) {
            loading.value = true
            console.log(error);
            return error;
        } finally {
            loading.value = false

        }
    }
    const putUsuario = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/${id}`, data, {
                headers: {
                    token: token.value
                }
            })
            return r;

        } catch (error) {
            loading.value = true;
            console.log(error);

        } finally {
            loading.value = false;

        }
    }

    const putActivarUsuario = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/activar/${id}`, {}, {
                headers: {
                    token: token.value
                }
            })
            return r;

        } catch (error) {
            loading.value = true;
            console.log(error);

        } finally {
            loading.value = false;

        }
    }
    const putdesactivarUsuario = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/desactivar/${id}`, {}, {
                headers: {
                    token: token.value
                }
            })
            return r;

        } catch (error) {
            loading.value = true;
            console.log(error);

        } finally {
            loading.value = false;

        }
    }


    let login = async (data) => {
        try {
            let res = await axios.post("api/usuarios/login", data)
            console.log(token.value);
            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    return { listarUsuarios, postUsuarios, putActivarUsuario, putUsuario, putdesactivarUsuario, login, token, loading, usuarios, user };
},
    {
        persist: true,
    },
);