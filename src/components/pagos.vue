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
                        class="q-my-md q-mx-md" :options="opciones" @filter="filterFn" label="Selecciona un Cliente">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="idPlan" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filtarPlanes" label="Selecciona un Plan">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" color="red" @click="validarPago()" class="text-white"
                            :loading="usePago.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" color="red" @click="editarPago()" class="text-white" :loading="usePago.loading">
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
                <template v-slot:body-cell-idCliente="props">
                    <q-td :props="props">
                        <p >{{ props.row.idCliente.nombre }}</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div style="display: flex; gap:15px; justify-content: center;">
                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerPlan(props.row)" >
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i
                                    class="fas fa-pencil-alt"></i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1"  @click=" deshabilitarPago(props.row)" color="negative">
                                <q-tooltip>
                                    Inactivar
                                </q-tooltip>
                                <i
                                    class="fas fa-times"></i></q-btn>
                            <q-btn v-else @click="habilitarPago(props.row)" color="positive">
                                <q-tooltip>
                                    Activar
                                </q-tooltip>
                                <i
                                    class="fas fa-check"></i></q-btn>
                        </div>
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
        label: 'Nombre Cliente',
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
            return fecha.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
            })
        }
    },
    {
        name: 'valor',
        required: true,
        label: 'Valor Plan',
        align: 'center',
        field: 'valor',
        sortable: true,
        format: (valor) => {
            // Formatear el precio como pesos colombianos
            return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
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



async function listarPagos() {
    const r = await usePago.listarPagos()
    rows.value = r.data.pagos.reverse()
    console.log(r.data.pagos)
}

let planes = []
let datesPlanes = {};
let clientes = []
let datesClientes = {};
let idpago = ref("")
const options = ref(planes)
const opciones = ref(clientes)

const listarClientes = async () => {
    const data = await useCliente.listarClientes();
    console.log(data);
    data.data.clientes.forEach(item => {
        datesClientes = {
            label: `${item?.nombre} (${item?.documento})`,
            value: item._id
        }
        clientes.push(datesClientes)
    })
}
const listarPlanes = async () => {
    const data = await usePlan.listarPlanesActivos();
    data.data.planes.forEach(item => {
        datesPlanes = {
            label: item.descripcion,
            value: item._id
        }
        planes.push(datesPlanes)
    })
}

function filterFn(val, update) {
    update(() => {
        const needle = val.toLowerCase();
        opciones.value = clientes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}

function filtarPlanes(val, update) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = planes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}


function validarPago() {
    if (idCliente.value == "") {
        Notify.create("Se debe agregar un cliente");
    } else if (idPlan.value == "") {
        Notify.create("Se debe agregar un Plan");
    } else {
        agregarpago()
        cerrar()
        Notify.create({
            message: 'Pago agregado correctamente',
            color: 'green',
            position: 'top'
        })
    }
}

async function agregarpago() {
    const r = await usePago.postPago({
        idCliente: idCliente.value.value,
        idPlan: idPlan.value.value

    })
    cerrar()
    listarPagos()
    console.log(r)
}

async function habilitarPago(pago){
    const res = await usePago.putActivarPago(pago._id)
    .then((response)=>{
        console.log(response)
        listarPagos()
    })

    .catch((error)=>{
        console.error(error)
        Notify.create("Ocurrio un error al verificar el Pago intentalo nuevamente")

    })

}

async function deshabilitarPago(pago){
    const res = await usePago.putDesactivarPago(pago._id)
    .then((response)=>{
        console.log(response)
        listarPagos()
    })

    .catch((error)=>{
        console.error(error)
        Notify.create("Ocurrio un error al verificar el Pago intentalo nuevamente")
})
}



function traerPlan(plan){
    console.log(plan);
    idpago.value = plan._id
    accion.value = 2
    alert.value = true
    idPlan.value = {
        label: plan.plan,
        value: plan._id
    }
    idCliente.value = {
        label: `${plan.idCliente?.nombre} (${plan.idCliente?.documento})`,
        value: plan.idCliente._id
    }
}


async function editarPago() {
    try {
        await usePago.putPago(idpago.value, {
            idCliente: idCliente.value.value,
            idPlan: idPlan.value.value
        })
        cerrar()
        listarPagos()
    } catch (error) {
        console.log(error);
    }
}




function limpiar() {
    idCliente.value = ''
    idPlan.value = ''
}

onMounted(() => {
    listarPagos()
    listarClientes()
    listarPlanes()
})

</script>