<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Planes</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarPlanesActivos()" >Listar Planes Activos</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarPlanesInactivos()">Listar Planes Inactivos</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Plan" : "Editar Plan" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="descripcion" label="Agrega una descripcion del plan" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="valor" type="tel" label="Valor del Plan" class="q-my-md q-mx-md" />
                    <q-input outlined v-model="dias" type="tel" label="Cantidad de Dias" class="q-my-md q-mx-md" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarPlanes()" color="red" class="text-white"
                            :loading="usePlan.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionPlanes()" color="red" class="text-white"
                            :loading="usePlan.loading">
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
            <q-table title="Planes" title-class="text-red text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerPlan(props.row)" ><i
                                    class="fas fa-pencil-alt"></i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1"  @click="deshabilitarPlanes(props.row)" color="negative"><i
                                    class="fas fa-times"></i></q-btn>
                            <q-btn v-else @click="habilitarPlanes(props.row)" color="positive"><i
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
import { useStorePlan } from '../stores/planes'

const usePlan = useStorePlan();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref('')
let descripcion = ref('')
let valor = ref('')
let dias = ref('')



const columns = ref([
    {
        name: 'codigo',
        required: true,
        label: 'Codigo Plan',
        align: 'center',
        field: 'codigo',
        sortable: true
    },
    {
        name: 'descripcion',
        required: true,
        label: 'Descripcion  Plan',
        align: 'center',
        field: 'descripcion',
        sortable: true,
        format: (val) => {
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
    },
    {
        name: 'valor',
        required: true,
        label: 'Valor del Plan',
        align: 'center',
        field: 'valor',
        sortable: true,
        format: (val) => {
            // Formatear el precio como pesos colombianos
            return val.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
    },
    {
        name: 'dias',
        required: true,
        label: 'Cantidad de Dias',
        align: 'center',
        field: 'dias',
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

function abrir() {
    alert.value = true;
    accion.value = 1
    limpiar()

}

async function listarPlanes() {
    const r = await usePlan.listarPlanes();
    console.log(r.data.planes);
    rows.value = r.data.planes.reverse()
}

async function listarPlanesActivos(){
    const r = await usePlan.listarPlanesActivos();
    rows.value = r.data.planes.reverse()
    console.log(r.data.planes);
}

async function listarPlanesInactivos(){
    const r = await usePlan.listarPlanesInactivos();
    rows.value = r.data.planes.reverse()
    console.log(r.data.planes);
}

function validarPlanes() {
    let validarnumeros = /^[0-9]+$/;

    if (descripcion.value == "") {
        Notify.create("Se debe agregar  descripcion del plan");
    } else if (valor.value == '') {
        Notify.create("Se debe agregar  valor del plan");
    } else if (dias.value == '') {
        Notify.create("Se debe agregar cantidad de dias del plan");
    } else if (!validarnumeros.test(valor.value)) {
        Notify.create("El valor del plan debe ser numerico");
    } else if (!validarnumeros.test(dias.value)) {
        Notify.create("La cantidad de dias del plan debe ser numerico");

    } else {
        agregarPlanes()
        Notify.create({
            type: "positive",
            message: "Plan agregado exitosamente",
        });
    }
}


async function habilitarPlanes(plan) {
    const res = await usePlan.putPlanesActivar(plan._id)
        .then((response) => {
            console.log(response);
            listarPlanes()
        })
        .catch((error) => {
            console.error('Error de Plan:', error);
            Notify.create("Ocurrió un error al verificar el código del Plan. Por favor inténtalo de nuevo.");
        })

}


async function deshabilitarPlanes(plan) {
    const res = await usePlan.putPlanesDesactivar(plan._id)
        .then((response) => {
            console.log(response);
            listarPlanes()
        })
        .catch((error) => {
            console.error('Error de Plan:', error);
            Notify.create("Ocurrió un error al verificar el código del Plan. Por favor inténtalo de nuevo.");
        })
}

async function agregarPlanes() {

    const r = await usePlan.postPlanes({
        descripcion: descripcion.value,
        valor: valor.value,
        dias: dias.value
    })
    console.log(r)
    cerrar()
    listarPlanes()
    limpiar()
}

function validarEdicionPlanes() {
    let validarnumeros = /^[0-9]+$/;

    if (descripcion.value == "") {
        Notify.create("Se debe agregar  descripcion del plan");
    } else if (valor.value == '') {
        Notify.create("Se debe agregar  valor del plan");
    } else if (dias.value == '') {
        Notify.create("Se debe agregar cantidad de dias del plan");
    } else if (!validarnumeros.test(valor.value)) {
        Notify.create("El valor del plan debe ser numerico");
    } else if (!validarnumeros.test(dias.value)) {
        Notify.create("La cantidad de dias del plan debe ser numerico");

    } else {
        editarPlanes()
        limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Plan editado exitosamente",
        });

    }
}

async function editarPlanes() {
    try {
        await usePlan.putPlanes(id.value, {
            descripcion: descripcion.value,
            valor: valor.value,
            dias: dias.value
        })
        listarPlanes()

    } catch (error) {
        console.error('Error de mantenimiento', error)
        Notify.create('Ocurrio un error al editar el plan')
    }
}

function cerrar() {
    alert.value = false;
}

function limpiar() {
    descripcion.value = ''
    valor.value = ''
    dias.value = ''

}

function traerPlan(plan) {
    accion.value = 2
    alert.value = true;
    id.value = plan._id
    descripcion.value = plan.descripcion
    valor.value = plan.valor
    dias.value = plan.dias

}


onMounted(() => {
    listarPlanes()
});

</script>

