import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";

export const useUsuarioStore = defineStore("usuarios", () => {
    let token = ref("")
    let loading = ref(false)
    let usuarios = ref([]);
    let user = ref({})
    


    const listarUsuarios = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/usuarios", {
                headers: {
                    token: token.value
                }
            })
            usuarios.value = res.data;
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de usuarios', error);
            throw error;

        } finally {
            loading.value = false
        }
    }

    const listarUsuariosActivos = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/usuarios/activos", {
                headers: {
                    token: token.value
                }
            })
            usuarios.value = res.data;
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de usuarios activos', error);
            throw error;

        } finally {
            loading.value = false
        }
    }
    const listarUsuariosInactivos = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/usuarios/inactivos", {
                headers: {
                    token: token.value
                }
            })
            usuarios.value = res.data;
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de usuarios inactivos', error);
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
            return res;
        } catch (error) {
            console.log(error);
            if(error.response.status === 401){
                Notify.create({
                    message: "Usuario Inactivo",
                    position: "top",
                    color: 'red',
                    timeout: 4000
                })
            }else{
                Notify.create({
                    message: "El correo o la cotraseña son incorrectas",
                    position: "top",
                    color: 'red',
                    timeout: 4000
                })
            }
            return error;
        }
    }

    let usuarioGetEmail = async (correo) => {
        try{
            let res = await axios.get(`api/usuarios/correo/${correo}`)
                return res;
            
        }catch (error) {
            console.log(error);
            return error;
        }
    }

    let enviarEmail = async (correo) => {
        try{
            console.log(correo);
            let res = await axios.post("api/usuarios/recuperar", {
                correo: correo
            })
            return res
        }catch (error){
            return error
        }
    }

    let usuarioPutPassword = async (correo,password) => {
        try {
            let res = await axios.put("api/usuarios/actualizarpass",{
                correo: correo,
                password: password
            })
            return res 
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return { listarUsuarios,listarUsuariosActivos,listarUsuariosInactivos, postUsuarios, putActivarUsuario, putUsuario, putdesactivarUsuario, login, usuarioGetEmail, enviarEmail,usuarioPutPassword , token, loading, usuarios, user };
},
    {
        persist: true,
    },
);