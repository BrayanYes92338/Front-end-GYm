import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useIngresoStore = defineStore("ingreso", () => {
    let getIngresos = async () => {
        try {
            let res = await axios.get("api/ingresos");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    return {
        getIngresos,
    };
},
{
    persist:true,
},
);