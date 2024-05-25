<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Ingreso</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Ingreso" : "Editar Ingreso" }}
                        </div>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" color="red" class="text-white" :loading="useIngreso.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" color="red" class="text-white" :loading="useIngreso.loading">
                            Editar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div style="display: flex; justify-content: center">
            <q-table title="Ingresos" title-class="text-red text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">

                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn>✏️</q-btn>
                        <q-btn v-if="props.row.estado == 1">❌</q-btn>
                        <q-btn v-else>✅</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useIngresoStore } from '../stores/ingresos.js'
import { useStoreSede } from '../stores/sedes';
import { useStoreCliente } from '../stores/clientes'

const useIngreso = useIngresoStore()
const useSede = useStoreSede()
const useCliente = useStoreCliente()

let rows = ref([])
let alert = ref(false);
let accion = ref(1);
let id = ref('')
let idsede = ref('')
let idcliente = ref('')


function abrir() {
    accion.value = 1
    alert.value = true;
    limpiar()
}

function cerrar() {
    alert.value = false;
}

const columns = ref([
    {
        name: 'idsede',
        required: true,
        label: 'ID Sede',
        align: 'center',
        field: 'idsede',
        sortable: true
    },
    {
        name: 'idcliente',
        required: true,
        label: 'ID Cliente',
        align: 'center',
        field: 'idcliente',
        sortable: true
    },
    {
        name: 'fecha',
        required: true,
        label: 'Fecha del Mantenimiento',
        align: 'center',
        field: 'fecha',
        sortable: true,
        // prueba de lectura de fecha
        format: (val) => {
            const fecha = new Date(val);
            return fecha.toLocaleDateString();
        }
    },
    {
        name: 'codigo',
        required: true,
        label: 'Codigo',
        align: 'center',
        field: 'codigo',
        sortable: true
    },
    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'estado',
        sortable: true
    },
    {
        name: 'opciones',
        required: true,
        label: 'Opciones',
        align: 'center',
        field: 'opciones',
        sortable: true
    }
])

let sedes =[];
let datos = {}
const options = ref(sedes)

function filterFn(val,update,abort){
    update(()=>{
        const needle = val.toLowerCase()
       options.value = sedes.filter(v=>v.label.toLowerCase().indexOf(needle) > -1)
    })
}

async function listarIngresos()

function limpiar(){
    idsede.value = ''
    idcliente.value = ''

}


</script>