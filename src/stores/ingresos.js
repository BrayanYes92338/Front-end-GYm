import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";

export const useIngresoStore = defineStore("ingreso", () => {
   let loading = ref(false);
   let ingresos = ref([])
    const useUsuario = useUsuarioStore();

    const listarIngresos = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get("api/ingresos",{
                headers:{
                    token: useUsuario.token
                }
            });
            ingresos.value = response.data;
            return response;
        }catch(error){
            console.error("Error al obtener la lista de ingresos", error);
            throw error;
        }finally{
            loading.value = false;
        }
    }

    const postIngreso = async (data)=>{
        try{
            loading.value = true;
            const response = await axios.post("api/ingresos",data,{
                headers:{
                    token: useUsuario.token
                }
            });

            return response;
        }catch(error){
            console.error("Error al registrar el ingreso", error);
            throw error;
        }finally{
            loading.value = false;
        }
    }

    const putIngreso = async (id, data)=>{
        try{
            loading.value = true;
            const response = await axios.put(`api/ingresos/${id}`,data,{
                headers:{
                    token: useUsuario.token
                }
            });
            return response;
        }catch(error){
            console.error("Error al actualizar el ingreso", error);
            throw error;
        }finally{
            loading.value = false;
        }
    }

    const putactivarIngreso = async (id)=>{
      try{
        loading.value = true
        const r = await axios.put(`api/ingresos/activar/${id}`,{},{
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
            message: error.response.data.errors[0].msg,
        
        })
      }finally{
        loading.value = false
      }
    }

    const putdesactivarIngreso = async (id)=>{
        try{
            loading.value = true;
            const response = await axios.put(`api/ingresos/desactivar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
            });
         
            return response;
        }catch(error){
            console.error("Error al desactivar el ingreso", error);
            throw error;
        }finally{
            loading.value = false;
        }
    }

    return { listarIngresos,postIngreso,putIngreso, putactivarIngreso, putdesactivarIngreso,loading,ingresos,};
},
{
    persist:true,
},
);