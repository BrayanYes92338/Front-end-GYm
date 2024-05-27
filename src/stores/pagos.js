import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";


export const useStorePago = defineStore("pago", ()=>{
    let loading = ref(false)
    let pagos= ref([])
    const useUsuario = useUsuarioStore()

    const listarPagos = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get('api/pagos', {
                headers:{
                    token: useUsuario.token
                }
            })
            pagos.value = response.data
            return response

        }catch(error){
            console.error("Error al obtener la lista de pagos:", error);
          throw error;
        }finally{
            loading.value = false;
        }
    }

    const postPago = async (data)=>{
        try{
            loading.value = true
            const r = await axios.post('api/pagos', data,{
                headers: {
                    token: useUsuario.token
                }
            })
            return r

        }catch(error){
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    const putPago = async(id, data)=>{
        try{
            loading.value = true
            const r = await axios.put(`api/pagos/${id}`,data,{
                headers:{
                    token: useUsuario.token
                }
            })
            return r

        }catch(error){
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    const putActivarPago = async(id)=>{
        try{
            loading.value=true
            const r = await axios.put(`api/pagos/activar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
            })
            return r
        }catch(error){
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    const putDesactivarPago = async(id)=>{
        try{
            loading.value=true
            const r = await axios.put(`api/pagos/desactivar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
            })
            return r
        }catch(error){
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }

    return{listarPagos,postPago,putPago,putActivarPago,putDesactivarPago,loading,pagos}

},{
    persist:true,
})