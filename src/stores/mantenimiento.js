import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";


export const useStoreMantenimiento = defineStore("mantenimiento", () =>{
    let loading = ref(false)
    let mantenimientos = ref([]);
    const useUsuario = useUsuarioStore()
 
    const listarMantenimientos = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get("api/mantenimientos",{
                headers:{
                    token: useUsuario.token
                }
              })
            mantenimientos.value = response.data;
            return response;
        }catch(error){
            console.error("Error al obtener la lista de mantenimientos:", error);
            throw error;
        }finally{
            loading.value = false;
        }
    }

const listarMantenimientosActivos = async ()=>{

    try{
        loading.value = true;
        const response = await axios.get("api/mantenimientos/activos",{
            headers:{
                token: useUsuario.token
            }
        })
        mantenimientos.value = response.data;
        return response;

    }catch(erro){
        console.error("Error al obtener la lista de mantenimientos activos:", erro);
        throw erro;
    }finally{
        loading.value = false;
    }

}

const listarMantenimientosInactios = async ()=>{
    try{
        loading.value = true;
        const response = await axios.get("api/mantenimientos/inactivos",{
            headers:{
                token: useUsuario.token
            }
        })
        mantenimientos.value = response.data;
        return response;
    }catch(error){
        console.error("Error al obtener la lista de mantenimientos Inactivos:", error);
        throw error;
    }finally{
        loading.value = false;
    }
}

const listarValorMantenimiento = async (fechaI,fechaF)=>{
    try{
        loading.value = true;
        const response = await axios.post("api/mantenimientos/valorf",{
            fechaInicio: fechaI,
            fechaFin: fechaF
        },{
            headers:{
                token: useUsuario.token
            }
        })
        mantenimientos.value = response.data;
        return response;

    }catch(error){
        console.error("Error al obtener el valor de mantenimientos:", error);
        throw error;
    }finally{
        loading.value = false;  
    }
}
const listarMantenimientoMaquina = async (id) => {
    try {
      loading.value = true;
      const response = await axios.get(`/api/mantenimientos/mantenimientoM/${id}`, {
        headers: {
          token: useUsuario.token
        }
      });
      mantenimientos.value = response.data;
      return response;
    } catch (error) {
      console.error("Error al obtener la lista de mantenimientos por maquina:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };


    const postMantenimiento = async (data)=>{
        try{
            loading.value = true
            const r= await axios.post("api/mantenimientos", data,{
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
            });

        }finally{
            loading.value = false
        }
    }
   const  putMantenimiento = async (id,data)=>{
        try{
            loading.value=true
            const r = await axios.put(`api/mantenimientos/${id}`, data,{
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
    const putActivarMantenimiento= async (id)=>{
        try{
            loading.value= true;
            const r = await axios.put(`api/mantenimientos/activar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
              })
            return r;

        }catch(error){
            loading.value = true
            console.log(error)
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });

        }finally{
            loading.value = false
        }


    }
    const putDesactivarMantenimiento= async (id)=>{
        try{
            loading.value = true
            const r = await axios.put(`api/mantenimientos/desactivar/${id}`,{},{
                headers:{
                    token: useUsuario.token
                }
              })
            return r

        }catch(error){
            loading.value = true
            console.log(error)
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });

        }finally{
            loading.value = false
        }

    }
    return {listarMantenimientos,listarMantenimientosActivos,listarMantenimientosInactios,listarValorMantenimiento,listarMantenimientoMaquina, postMantenimiento,putMantenimiento,putActivarMantenimiento ,putDesactivarMantenimiento, loading, mantenimientos}
},
{
    persist:true,
},
);