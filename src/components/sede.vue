<template>
    <div> <!--v-if="useUsuario.token"-->
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Sedes</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarSedes()">Listar Sedes</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarSedesActivo()">Listar Sedes Activas</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarSedesInactivas()">Listar Sedes Inactivas</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Sede" : "Editar Sede" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" label="Nombre de la Sede" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="dirrecion" label="Dirrecion de la Sede" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="horario" label="Horario de la sede" class="q-my-md q-mx-md" type="time" />
                    <q-input outlined v-model="ciudad" label="Ciudad de la Sede" class="q-my-md q-mx-md" type="text" />
                    <q-input @keydown.space.prevent outlined v-model="telefono" type="tel" label="Telefono" required pattern="[0-9]+"
                        maxlength="10" class="q-my-md q-mx-md" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validar()" color="red" class="text-white"
                            :loading="useSede.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validaredicion()" color="red" class="text-white"
                            :loading="useSede.loading">
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
            <q-table title="Sedes" title-class="text-red text-weight-bolder text-h4"
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
                <q-btn color="primary" @click="traerInfo(props.row)" >
                    <q-tooltip>
                        Editar
                    </q-tooltip>
                    <i
                        class="fas fa-pencil-alt"></i></q-btn>
                <!-- botons de activado y desactivado -->
                <q-btn v-if="props.row.estado == 1" @click="desabilitarSedes(props.row)" color="negative">
                    <q-tooltip>
                        Inacticar
                    </q-tooltip>
                    <i
                        class="fas fa-times"></i></q-btn>
                <q-btn v-else @click="habilitarSedes(props.row)" color="positive">
                    <q-tooltip>
                        Acticar
                    </q-tooltip>
                    <i
                        class="fas fa-check"></i></q-btn>
            </div>
        </q-td>
    </template>
            </q-table>
        </div>


    </div>
    <!-- <div v-if="useUsuario.token === ''">
        <p>Hola</p>
    </div> -->
</template>



<script setup>

import { ref, onMounted } from 'vue';
import { useStoreSede } from '../stores/sedes';
import { useQuasar, Notify } from 'quasar';
import { useUsuarioStore } from '../stores/usuarios';

const  useUsuario = useUsuarioStore()
const useSede = useStoreSede();


let rows = ref([]);
let nombre = ref('');
let dirrecion = ref('');
let codigo = ref('');
let horario = ref('');
let ciudad = ref('');
let error = ref('');
let telefono = ref('')
let alert = ref(false);
let accion = ref(1);
let id = ref('');



async function listarSedes() {
    const r = await useSede.listarSedes()
    console.log(r.data.sede);
    rows.value = r.data.sede.reverse()
}

async function listarSedesActivo(){
    const r= await useSede.listarSedesActivo()
    rows.value = r.data.sede.reverse()
    console.log(r.data.sede);
}

async function listarSedesInactivas(){
    const r= await useSede.listarSedesInactivo()
    rows.value = r.data.sede.reverse()
    console.log(r.data.sede);
}

function traerInfo(sede) {
    accion.value = 2;
    alert.value = true;
    nombre.value = sede.nombre;
    dirrecion.value = sede.dirrecion;
    horario.value = sede.horario;
    ciudad.value = sede.ciudad;
    telefono.value = sede.telefono;
    id.value = sede._id;

}

function validaredicion(){
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un nombre");
    } else if (dirrecion.value == "" || dirrecion.value.trim().length === 0) {
        Notify.create("Se debe agregar una dirrecion");
    }  else if (horario.value == "") {
        Notify.create("Se debe agregar hora de la sede");
    } else if (ciudad.value == "" || ciudad.value.trim().length === 0) {
        Notify.create("Se debe agregar la ciudad de la Sede");
    } else if (telefono.value == "") {
        Notify.create("Se debe agregar un telefono");
    } else if (isNaN(telefono.value) == true) {
        Notify.create("El campo de telefono debe agregar solo numeros");
    } else if (telefono.value.length < 8) {
        Notify.create("Se debe agregar al menos 8 numeros");
    } else {
        editarSedes();
        limpiarsede();
        cerrar();
        Notify.create({
            type: "positive",
            message: "Sede editada exitosamente",
        });

    }

}

async function editarSedes() {
    try {
        await useSede.putSede(id.value, {
            nombre: nombre.value,
            dirrecion: dirrecion.value,
            horario: horario.value,
            ciudad: ciudad.value,
            telefono: telefono.value
        });

        
        listarSedes();

    } catch (error) {
        console.error('Error al editar la sede:', error);
        Notify.create("Ocurrió un error al editar la sede. Por favor inténtalo de nuevo.");
    }
}

async function habilitarSedes(sede) {
    const res = await useSede.putactivarSede(sede._id)
        .then((response) => {
            console.log(response);
            listarSedes()
        })
        .catch((error) => {
            console.error('Error de sede:', error);
            Notify.create("Ocurrió un error al verificar el código de sede. Por favor inténtalo de nuevo.");
        })
}

async function desabilitarSedes(sede) {
    const res = await useSede.putdesactivarSede(sede._id)
        .then((response) => {
            console.log(response);
            listarSedes()
        })
        .catch((error) => {
            console.error('Error de sede:', error);
            Notify.create("Ocurrió un error al verificar el código de sede. Por favor inténtalo de nuevo.");
        })
}

 function validar() {
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un nombre");
    } else if (dirrecion.value == "" || dirrecion.value.trim().length === 0) {
        Notify.create("Se debe agregar una dirrecion");
    }  else if (horario.value == "") {
        Notify.create("Se debe agregar hora de la sede");
    } else if (ciudad.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar la ciudad de la Sede");
    } else if (telefono.value == "") {
        Notify.create("Se debe agregar un telefono");
    } else if (isNaN(telefono.value) == true) {
        Notify.create("El campo de telefono debe agregar solo numeros");
    } else if (telefono.value.length < 8) {
        Notify.create("Se debe agregar al menos 8 numeros");
    } else {
        agregarSedes();
        Notify.create({
            type: "positive",
            message: "Sede agregada exitosamente",
        });

    }
}

async function agregarSedes() {
    console.log(nombre.value.trim());
    const r = await useSede.postSede({
        nombre: nombre.value.trim(),
        dirrecion: dirrecion.value.trim(),
        horario: horario.value.trim(),
        ciudad: ciudad.value.trim(),
        telefono: telefono.value
    })
    console.log(r);
    listarSedes()
    cerrar()
    limpiarsede()
}



function abrir() {
    accion.value = 1
    alert.value = true;
    limpiarsede();

}

function cerrar() {
    alert.value = false;
}

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre Sede',
        align: 'center',
        field: 'nombre',
        sortable: true,
         format: (val) => {
            // Capitalizar la primera letra del responsable
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
    },
    {
        name: 'dirrecion',
        required: true,
        label: 'dirrecion de Sede',
        align: 'center',
        field: 'dirrecion',
        sortable: true,
        format: (val) => {
            // Capitalizar la primera letra del responsable
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
    },
    {
        name: 'codigo',
        required: true,
        label: 'Codigo Sede',
        align: 'center',
        field: 'codigo',
        sortable: true
    },
    {
        name: 'horario',
        required: true,
        label: 'Hora de Entrada',
        align: 'center',
        field: 'horario',
        sortable: true,
        
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: 'ciudad',
        sortable: true,
         format: (val) => {
            // Capitalizar la primera letra del responsable
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
    },
    {
        name: 'telefono',
        required: true,
        label: 'Telefono Sede',
        align: 'center',
        field: 'telefono',
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
    },

]
)

function limpiarsede() {
    nombre.value = '';
    dirrecion.value = '';
    horario.value = '';
    ciudad.value = '';
    telefono.value = '';
}

onMounted(() => {
    listarSedes()
})


</script>
