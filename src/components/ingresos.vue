<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Ingreso</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarIngresoctivo()">Listar Ingreso Activo</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click=" listarIngresoinactivo()">Listar Ingreso Inactivo</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Ingreso" : "Editar Ingreso" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idsede" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona una Sede">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-select outlined v-model="idcliente" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtarCliente" label="Selecciona un Documento">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarIngreso()" color="red" class="text-white"
                            :loading="useIngreso.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionIngreso()" color="red" class="text-white"
                            :loading="useIngreso.loading">
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
                        <div style="display: flex; gap:15px; justify-content: center;">
                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerIngreso(props.row)"><i
                                    class="fas fa-pencil-alt"></i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarIngreso(props.row)" color="negative"><i
                                    class="fas fa-times"></i></q-btn>
                            <q-btn v-else @click="habilitarIngreso(props.row)" color="positive"><i
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
        label: 'Nombre Sede',
        align: 'center',
        field: (row) => row.idsede.nombre,
        sortable: true
    },
    {
        name: 'idcliente',
        required: true,
        label: 'Nombre Cliente',
        align: 'center',
        field: (row) => row.idcliente.nombre,
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

let sedes = [];
let clientes = [];
const options = ref(sedes)
const opciones = ref(clientes)


const filterFn = (val, update) => {
    const needle = val.toLowerCase();
    update(() => {
        options.value = sedes.value.filter(v => v.label.toLowerCase().includes(needle));
    });
};

const filtarCliente = (val, update) => {
    const needle = val.toLowerCase();
    update(() => {
        opciones.value = clientes.value.filter(v => v.label.toLowerCase().includes(needle));
    });
};



async function listarIngresos() {
    const r = await useIngreso.listarIngresos()
    rows.value = r.data.ingresos.reverse()
    console.log(r.data.ingresos);

}

async function listarIngresoctivo(){
    const r = await useIngreso.listarIngresosActivo()
    rows.value = r.data.ingresos.reverse()
    console.log(r.data.ingresos);

}

async function listarIngresoinactivo(){
    const r = await useIngreso.listarIngresosInactivo()
    rows.value = r.data.ingresos.reverse()
    console.log(r.data.ingresos);

}

const listarSedes = async () => {
    const data = await useSede.listarSedes();
    sedes.value = data.data.sede.map(item => ({
        label: item.codigo,
        value: item._id
    }));
    options.value = sedes.value;
    console.log('Sedes:', sedes.value);
};

const listarClientes = async () => {
    const data = await useCliente.listarClientes();
    clientes.value = data.data.clientes.map(item => ({
        label: item.documento,
        value: item._id
    }));
    opciones.value = clientes.value;
    console.log('Clientes:', clientes.value);
};

function validarIngreso() {
    if (idsede.value == "") {
        Notify.create("Se debe agregar un id de la Sede");
    } else if (idcliente.value == "") {
        Notify.create("Se debe agregar un id del Cliente");
    } else {
        agregaringreso()
        limpiar()
        Notify.create({
            type: "positive",
            message: "Ingreso agregado exitosamente",
        });
    }
}

async function agregaringreso() {
    const r = await useIngreso.postIngreso({
        idsede: idsede.value.value,
        idcliente: idcliente.value.value
    })
    listarIngresos()
    console.log(r);
    cerrar()
}


async function habilitarIngreso(ingreso) {
    const res = await useIngreso.putactivarIngreso(ingreso._id)
        .then((response) => {
            console.log(response);
            listarIngresos()
        })

        .catch((error) => {
            console.error('Error de sede:', error);
            Notify.create("Ocurrió un error al verificar el código del Ingreso. Por favor inténtalo de nuevo.");
        })
}

async function deshabilitarIngreso(ingreso) {
    const res = await useIngreso.putdesactivarIngreso(ingreso._id)
        .then((response) => {
            console.log(response);
            listarIngresos()
        })

        .catch((error) => {
            console.error('Error de sede:', error);
            Notify.create("Ocurrió un error al verificar el código del Ingreso. Por favor inténtalo de nuevo.");
        })
}

function traerIngreso(ingreso) {
    accion.value = 2
    alert.value = true
    idsede.value = {
        label:ingreso.idsede.nombre,
        value:ingreso.idsede._id
    }
    idcliente.value = {
        label:ingreso.idcliente.nombre,
        value:ingreso.idcliente._id
    }
    id.value = ingreso._id


}

function validarEdicionIngreso() {
    if (idsede.value == "") {
        Notify.create("Se debe agregar un id de la Sede");
    } else if (idcliente.value == "") {
        Notify.create("Se debe agregar un id del Cliente");
    } else {
        editarIngresos()
        limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Ingreso editado exitosamente",
        });
    }

}

async function editarIngresos() {
    try {
        await useIngreso.putIngreso(id.value, {
            idsede: idsede.value.value,
            idcliente: idcliente.value.value
        })
        listarIngresos()
    } catch (error) {
        console.error('Error de sede:', error);
        Notify.create("Ocurrió un error al verificar el código del Ingreso. Por favor inténtalo de nuevo.");

    }
}

function limpiar() {
    idsede.value = ''
    idcliente.value = ''

}


onMounted(() => {
    listarIngresos()
    listarSedes()
    listarClientes()
})
</script>