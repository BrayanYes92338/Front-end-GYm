import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";

export const useStoreCliente = defineStore('cliente', ()=>{
    let loading = ref(false);
    let clientes = ref([]);
    const useUsuario = useUsuarioStore();

    const listarClientes = async ()=>{
        try{
            loading.value = true;
            const response =axios.get("api/clientes",{
                headers:{
                    token:useUsuario.token
                }
            })
            clientes.value = response.data;
            return response;
        }catch(error){
            console.error('Error al obtener la lista la lista de Clientes', error);
            throw error;
        }finally{
            loading.value= false;
        }
    };
    const listarClientesActivos = async ()=>{
        try{
            loading.value = true;
            const response =axios.get("api/clientes/activos",{
                headers:{
                    token:useUsuario.token
                }
            })
            clientes.value = response.data;
            return response;
        }catch(error){
            console.error('Error al obtener la lista la lista de Clientes', error);
            throw error;
        }finally{
            loading.value= false;
        }
    }
    const listarClientesInactivos = async ()=>{
        try{
            loading.value = true;
            const response =axios.get("api/clientes/inactivos",{
                headers:{
                    token:useUsuario.token
                }
            })
            clientes.value = response.data;
            return response;
        }catch(error){
            console.error('Error al obtener la lista la lista de Clientes', error);
            throw error;
        }finally{
            loading.value= false;
        }
    }

    const postClientes = async (data) =>{
        try{
            loading.value= true
            const r = await axios.post("api/clientes", data,{
                headers:{
                    token: useUsuario.token
                }
            })
        return r
        }catch(error){
            loading.value = true
            console.log(error);

        }finally{
            loading.value = false

        }
    }
    const putCliente = async(id, data)=>{
        try{
            loading.value = true;
            const r = await axios.put(`api/clientes/${id}`, data,{
                headers:{
                    token: useUsuario.token
                }
            })
            return r
        }catch (error){
            loading.value = true;
            console.log(error);

        }finally{   
            loading.value = false
        }
    }
    const putactivarCliente = async (id)=>{
        try{
            loading.value = true
            const r = await axios.put(`api/clientes/activar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
            })
            return r
        }catch (error){
            loading.value = true
            console.log(error);
            Notify.create({
                type: "negative",
                message:error.response.data.errors[0].msg,
            })

        }finally{
            loading.value = false
        }
    }
    const putdesactivarCliente = async (id)=>{
        try{
            loading.value = true
            const r = await axios.put(`api/clientes/desactivar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
            })
            return r
        }catch (error){
            loading.value=true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        }finally{
            loading.value=false
        }
    }

    return{listarClientes,listarClientesActivos, listarClientesInactivos, postClientes,putCliente,putactivarCliente,putdesactivarCliente, loading, clientes}

},{
    persist:true,
})