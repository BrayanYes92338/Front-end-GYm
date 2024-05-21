<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Usuario" : "Editar Editar" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idsede" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona la Sede del Trabajador">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="Direccion del Usuario" type="text"/>
                    <q-input outlined v-model="horario" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="Horario de Entrada" type="time"/>
                    <q-input outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="Ciudad" type="text"/>
                    <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="Telefono" type="tel" required pattern="[0-9]+"
                        maxlength="10"/>
                    <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="Correo" type="email"/>
                    <q-input outlined v-model="password" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="Contraseña" type="password"/>

                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1"  color="red" class="text-white"
                            :loading="useUsuario.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1"  color="red" class="text-white"
                            :loading="useUsuario.loading">
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
            <q-table title="Usuarios" title-class="text-red text-weight-bolder text-h4"
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
import {useUsuarioStore} from '../stores/usuarios';
import { useStoreSede } from '../stores/sedes';

const useUsuario = useUsuarioStore();
const useSede = useStoreSede();

let rows = ref([])
let idsede = ref("")
let nombre = ref("")
let direccion = ref("")
let horario = ref("")
let ciudad = ref("")
let telefono = ref("")
let correo = ref("")
let password = ref("")
let id = ref("")
let accion = ref(1)
let alert = ref(false)

function abrir(){
    accion.value = 1;
    alert.value = true;

}

function cerrar(){
    alert.value = false;
}

const columns =ref([
    {
        name: 'idsede',
        required: true,
        label: 'ID Sede',
        align: 'center',
        field: 'idsede',
        sortable: true
    }, 
     {
        name: 'nombre',
        required: true,
        label: 'Nombre Usuario',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Direccion Usuario',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'codigo',
        required: true,
        label: 'Codigo Usuario',
        align: 'center',
        field: 'codigo',
        sortable: true
    },
    {
        name: 'horario',
        required: true,
        label: 'Horario Entrada',
        align: 'center',
        field: 'horario',
        sortable: true
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: 'ciudad',
        sortable: true
    },
    {
        name: 'rol',
        required: true,
        label: 'Rol Usuario',
        align: 'center',
        field: 'rol',
        sortable: true
    },
    {
        name: 'telefono',
        required: true,
        label: 'Telefono',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'correo',
        required: true,
        label: 'Correo',
        align: 'center',
        field: 'correo',
        sortable: true
    },
    {
        name: 'createAt',
        required: true,
        label: 'Fecha de Ingreso',
        align: 'center',
        field: 'createAt',
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

let sedes = []
let dates ={}
const options = ref(sedes)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = sedes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });////////////
};

async function listarUsuarios (){
    const r = await useUsuario.listarUsuarios();
    rows.value = r.data.usuarios.reverse()
    console.log(r.data.usuarios);

}

async function listarSedes (){
    const data = await useSede.listarSedes();
    data.data.sede.forEach(item=>{
        dates={
            label: item.codigo,
            value: item._id
        }
        sedes.push(dates)
    })
    console.log(sedes);
}


onMounted(() => {
    listarUsuarios()
    listarSedes()
   
})



</script>