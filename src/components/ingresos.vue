<template>
    <div>
        <div class="q-pa-md">
        <q-table title="Ingresos" :rows="rows" :columns="columns" row-key="name">
            <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
                <q-btn flat dense round>📝</q-btn>
                <q-btn flat dense round icon="delete" @click="eliminarUsuario(props.row)" />
            </q-td>
            </template>
        </q-table>
        </div>
        <button @click="listarIngresos()">Agregar Ingreso</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {useIngresoStore} from '../stores/ingresos.js'

let useIngreso = useIngresoStore()
let rows = ref([]);
let colums= ref ([
{
        name: 'name',
        required: true,
        label: 'idSede',
        align: 'center',
        field: 'name',
        sortable: true
    },
    {
        name: 'name',
        required: true,
        label: 'idCliente',
        align: 'center',
        field: 'name',
        sortable: true  
    },
    {
        name: 'name',
        required: true,
        label: 'fecha',
        align: 'center',
        field: 'name',
        sortable: true  
    },
    {
        name: 'name',
        required: true,
        label: 'codigo',
        align: 'center',
        field: 'name',
        sortable: true   
    },
    {
        name: 'name',
        required: true,
        label: 'Opciones',
        align: 'center',
        field: 'name',
        sortable: true  
    }

])

let r = null;

let listarIngresos = async()=>{
    r= await useIngreso.getIngresos()
    rows.value = r
    console.log(r);
}

</script>