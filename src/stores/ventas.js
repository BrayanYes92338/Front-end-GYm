import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";

export const useStoreVenta = defineStore('venta', () => {
    let loading = ref(false)
    let ventas = ref([]);
    const useUsuario = useUsuarioStore()

    const listarVentas = async () => {
        try {
            loading.value = true;
            const response = await axios.get("api/ventas",{
                headers:{
                    token: useUsuario.token
                }
              })
            ventas.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de ventas:", error);
            throw error;
        } finally {
            loading.value = false
        }
    }
    const ListarVentasActivo = async ()=>{
        try {
            loading.value = true;
            const response = await axios.get("api/ventas/activos",{
                headers:{
                    token: useUsuario.token
                }
              })
            ventas.value = response.data;
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de ventas:", error);
            throw error;
        } finally {
            loading.value = false
        }

    }
    const ListarVentasInactivo = async ()=>{
        try{
            loading.value = true;
            const res = await axios.get("api/ventas/inactivos", {
                headers:{
                    token: useUsuario.token
                }
            })
            ventas.value = res.data
            return res
        }catch(error){
            console.error("Error al obtener la lista de ventas Inactivos:", error);
            throw error;
        }finally{
            loading.value = false
        }
    }
    const postVenta = async (data) => {
        try {
            loading.value = true;
            const r = await axios.post("api/ventas", data,{
                headers:{
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
    const putVenta = async (id, data) => {
        try {
            loading.value = true
            const r = await axios.put(`api/ventas/${id}`, data,{
                headers:{
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
    const putActivarVenta = async (id) => {
        try {
            loading.value= true
            const r= await axios.put(`api/ventas/activar/${id}`,{},{
                headers:{
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
    const putDesactivarVenta = async (id) => {
        try {
            loading.value = true
            const r = await axios.put(`api/ventas/desactivar/${id}`,{},{
                headers:{
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


    return { listarVentas,ListarVentasActivo,ListarVentasInactivo, postVenta, putVenta, putActivarVenta, putDesactivarVenta, loading, ventas }
},
{
    persist:true,
},
);