<template>  
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Pago</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Pago" : "Editar Pago" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idCliente" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione un Documento">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="idPlan" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtarPlanes" label="Selecciona un Plan">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1"  color="red" @click="validarPago()" class="text-white"
                            :loading="usePago.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1"  color="red" class="text-white"
                            :loading="usePago.loading">
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
            <q-table title="Pagos" title-class="text-red text-weight-bolder text-h4"
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
                        <q-btn >✏️</q-btn>
                        <q-btn v-if="props.row.estado == 1" >❌</q-btn>
                        <q-btn v-else >✅</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useStorePago } from '../stores/pagos';
import { useStoreCliente } from '../stores/clientes';
import { useStorePlan } from '../stores/planes'


const usePago = useStorePago();
const useCliente = useStoreCliente();
const usePlan = useStorePlan();

let alert = ref(false);
let accion = ref(1);
let id = ref('')
let rows = ref([]);
let idCliente = ref('')
let idPlan = ref('')

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
        name: 'idCliente',
        required: true,
        label: 'ID Cliente',
        align: 'center',
        field: 'idCliente',
        sortable: true
    }, 
    {
        name: 'plan',
        required: true,
        label: 'Plan Cliente',
        align: 'center',
        field: 'plan',
        sortable: true
    }, 
    {
        name: 'fecha',
        required: true,
        label: 'Fecha',
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
        name: 'valor',
        required: true,
        label: 'Valor Plan',
        align: 'center',
        field: 'valor',
        sortable: true,
        format: (val) => {
            // Formatear el precio como pesos colombianos
            return val.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
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

let clientes =[];
let planes = [];
const options = ref(clientes)
const opciones = ref(planes)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = clientes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};

const filtarPlanes = (val, update, abort) => {
    update(() => {
        const needle = val.toLowerCase();
        opciones.value = planes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};

async function listarPagos(){
    const r = await usePago.listarPagos()
    rows.value = r.data.pagos.reverse()
    console.log(r.data.pagos)
}

async function listarClientes(){
    const r = await useCliente.listarClientes()
    clientes = r.data.clientes.map((cliente) => {
        return {
            value: cliente._id,
            label: cliente.documento
        }
    })
    options.value = clientes
    console.log(clientes)

}

const listarPlanes = async ()=>{
    const r = await usePlan.listarPlanes()
    planes = r.data.planes.map((plan) => {
        return {
            label: plan.codigo,
            value: plan.descripcion
        }
    })
    opciones.value = planes
    console.log(planes)

}


function validarPago(){
    if(idCliente.value == ""){
        Notify.create("Se debe agregar un id del cliente");
    }else{
        agregarPago()
        limpiar()
        Notify.create({
            type: "positive",
            message: "Pago agregado exitosamente",
        });
    }
}

async function agregarPago(){
    const r = await usePago.postPago({
        idCliente: idCliente.value.value
    })
    cerrar()
    listarPagos()
    console.log(r)

}

function limpiar(){
    idCliente.value = ''
}

onMounted(() => {
    listarPagos()
    listarClientes()
    listarPlanes()
})

</script>