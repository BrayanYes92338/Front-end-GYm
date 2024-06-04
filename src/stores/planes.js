import { defineStore } from "pinia";
import axios from "axios";
import { Notify, QCardActions } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuarios";

export const useStorePlan = defineStore("plan",()=>{
let loading = ref(false)
let planes = ref([])
const useUsuario = useUsuarioStore()

const listarPlanes = async () => {
    try {
      loading.value = true;
      const response = await axios.get("api/planes",{
        headers:{
            token: useUsuario.token
        }
      });
      planes.value = response.data; 
      return response;
    } catch (error) {
      console.error("Error al obtener la lista de planes:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  
}
const listarPlanesActivos = async ()=>{
    try{
        loading.value = true;
        const response = await axios.get('api/planes/activos',{
            headers: {
                token: useUsuario.token
            }
        })
        planes.value = response.data;
        return response;

    }catch (error){
        console.error('Error al obtener la lista de planes activos:', error);
        throw error;
    }finally{
        loading.value = false;
    }
}
const listarPlanesInactivos = async() =>{
    try{
       loading.value = true;
       const response = await axios.get('api/planes/inactivos',{
              headers: {
                token: useUsuario.token
              }
       })
       planes.value = response.data;
         return response;
    
    }catch (error){
        console.error('Error al obtener la lista de planes inactivos:', error);
        throw error;
    }finally{
        loading.value = false;
    }

}
const postPlanes = async (data)=>{
    try{
        loading.value = true;
        const r= await axios.post('api/planes', data,{
            headers:{
                token: useUsuario.token
            }
          })
        return r
    }catch(error){
        loading.value= true;
        console.log(error);

    }finally{
        loading.value= false

    }
}
const putPlanes = async (id, data)=>{
    try{
        loading.value = true;
        const r= await axios.put(`api/planes/${id}`, data,{
            headers:{
                token: useUsuario.token
            }
          })
        return r
    }catch (error){
        loading.value= true;
        console.log(error);

    }finally {
        loading.value= false
    }
}

const putPlanesActivar = async(id)=>{
    try{
    loading.value = true;
    const r= await axios.put(`api/planes/activar/${id}`,{},{
        headers:{
            token: useUsuario.token
        }
      })
    return r
    }catch(error){
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

const putPlanesDesactivar = async(id)=>{
    try{
    loading.value = true;
    const r= await axios.put(`api/planes/desactivar/${id}`,{},{
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

  return { listarPlanes,listarPlanesActivos,listarPlanesInactivos, postPlanes,putPlanes ,putPlanesActivar,putPlanesDesactivar,loading, planes}
},
{
    persist:true,
},
);