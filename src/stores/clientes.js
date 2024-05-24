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
            const response =axios.get("api/usuarios",{
                headers:{
                    token:useUsuario.token
                }
            })
            clientes.value = response.data;
            return response;
        }catch(error){

        }finally{

        }
    }

    return{}

})