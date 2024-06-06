<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarUsuariosActivos()">Listar Usuario Activo</q-btn>    
             <q-btn color="green" class="q-my-md q-ml-md" @click="listarUsuariosInactivos()">Listar Usuario Inactivo</q-btn>
        </div>


 <!-- AGREGAR USUARIO -->
 <div>
    <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
            <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                <div class="text-h6 text-white">
                    Agregar Usuario
                </div>
            </q-card-section>
            <q-select outlined v-model="idsede" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                label="Selecciona la Sede del Trabajador">
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
            <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
            <q-input outlined v-model="horario" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Horario de Entrada" type="time" />
            <q-input outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Ciudad" type="text" />
            <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Telefono" type="tel" required pattern="[0-9]+" maxlength="10" />
            <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Correo" type="email" />
            <q-input outlined v-model="password" use-input hide-selected fill-input input-debounce="0"
                :type="isPwd ? 'password' : 'text'" class="q-my-md q-mx-md" label="Contraseña">
                <template v-slot:append>
                    <q-icon name="fas fa-eye" class="cursor-pointer" v-if="isPwd"
                        @click="togglePasswordVisibility" />
                    <q-icon name="fas fa-eye-slash" class="cursor-pointer" v-else
                        @click="togglePasswordVisibility" />
                </template>
            </q-input>
            <q-select outlined v-model="rol" :options="['ENTRENADOR', 'RECEPCIÓN']"
                label="Seleccione el Rol del Usuario" class="q-my-md q-mx-md" />
            <q-card-actions align="right">
                <q-btn @click="validarUsuario()" color="red" class="text-white" :loading="useUsuario.loading">
                    Agregar
                    <template v-slot:loading>
                        <q-spinner color="primary" size="1em" />
                    </template>
                </q-btn>
                <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</div>

 <!-- EDITAR USUARIO -->

 <div>
    <q-dialog v-model="alerta" persistent>
        <q-card class="" style="width: 700px">
            <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                <div class="text-h6 text-white">
                    Editar Usuario
                </div>
            </q-card-section>
            <q-select outlined v-model="idsede" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                label="Selecciona la Sede del Trabajador">
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
            <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
            <q-input outlined v-model="horario" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Horario de Entrada" type="time" />
            <q-input outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Ciudad" type="text" />
            <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                class="q-my-md q-mx-md" label="Telefono" type="tel" required pattern="[0-9]+" maxlength="10" />   
            <q-card-actions align="right">
                <q-btn @click="validarEdicionUsuario()" color="red" class="text-white" :loading="useUsuario.loading">
                    Editar
                    <template v-slot:loading>
                        <q-spinner color="primary" size="1em" />
                    </template>
                </q-btn>
                <q-btn label="Cerrar" color="black" outline @click="cerrar2()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</div>


        

        <div style="display: flex; justify-content: center">
            <q-table title="Usuarios" title-class="text-red text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">
                <template v-slot:body-cell-idsede="props">
                    <q-td :props="props">
                        <p v-if="props.row.idsede != null">{{ props.row.idsede.nombre }}</p>
                        <p v-else>-----</p>
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
                            <q-btn color="primary" @click="traerUsuario(props.row)"><i
                                    class="fas fa-pencil-alt"></i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarUsuario(props.row)" color="negative"><i
                                    class="fas fa-times"></i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarUsuaro(props.row)"><i
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
import { useUsuarioStore } from '../stores/usuarios';
import { useStoreSede } from '../stores/sedes';
import { QIcon } from 'quasar';

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
let rol = ref("")
let id = ref("")
let accion = ref(1)
let alert = ref(false)
let isPwd = ref(true)
let alerta = ref(false)


function cerrar2(){
alerta.value = false

}

function abrir() {
    accion.value = 1;
    alert.value = true;
    limpiar()

}

const togglePasswordVisibility = () => {
    isPwd.value = !isPwd.value;
};

function cerrar() {
    alert.value = false;
}

const columns = ref([
    {
        name: 'idsede',
        required: true,
        label: 'Nombre Sede',
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
        sortable: true,
        format: (val) => {
            const fechaIngreso = new Date(val)
            return fechaIngreso.toLocaleDateString()
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

let sedes = []
let dates = {}
const options = ref(sedes)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = sedes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });////////////
};

async function listarUsuarios() {
const r = await useUsuario.listarUsuarios()
rows.value = r.data.usuarios.reverse()
console.log(r.data.usuarios);

}

async function listarUsuariosActivos(){
  const r = await useUsuario.listarUsuariosActivos()
  rows.value = r.data.usuarios.reverse()
  console.log(r.data.usuarios);
}

async function listarUsuariosInactivos(){
  const r = await useUsuario.listarUsuariosInactivos()
  rows.value = r.data.usuarios.reverse()
  console.log(r.data.usuarios);
}


async function listarSedes() {
  const data = await useSede.listarSedes()
  data.data.sede.forEach(item => { 
    dates = {
      label: item.codigo,
      value: item._id
    };
    sedes.push(dates);
  });
  console.log(sedes);
}

function validarUsuario() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (idsede.value == "") {
        Notify.create("Se debe agregar un id de la Sede");
    } else if (nombre.value == "") {
        Notify.create("Se debe agregar un nombre de Usuario");
    } else if (direccion.value == "") {
        Notify.create("Se debe agregar una direccion de Usuario");
    } else if (horario.value == "") {
        Notify.create("Se debe agregar un horario de entrada");
    } else if (ciudad.value == "") {
        Notify.create("Se debe agregar una ciudad");
    } else if (telefono.value == "") {
        Notify.create("Se debe agregar un telefono");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe contener numeros");

    } else if (correo.value == "") {
        Notify.create("Se debe agregar un correo");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("Debe agregar un correo que sea valido");

    } else if (password.value == "") {
        Notify.create("Se debe agregar una contraseña");
    } else if (rol.value == "") {
        Notify.create("Se debe agregar un rol");
    } else {
        agregarUsuario()
        limpiar()
        Notify.create({
            type: "positive",
            message: "Usuario agregado exitosamente",
        });
    }
}


async function agregarUsuario() {
    const r = await useUsuario.postUsuarios({
        idsede: idsede.value.value,
        nombre: nombre.value,
        direccion: direccion.value,
        horario: horario.value,
        ciudad: ciudad.value,
        telefono: telefono.value,
        correo: correo.value,
        password: password.value,
        rol: rol.value
    })
    listarUsuarios()
    cerrar()
    console.log(r);
}

async function habilitarUsuaro(usuario) {
    const res = await useUsuario.putActivarUsuario(usuario._id)
        .then((response) => {
            console.log(response);
            listarUsuarios()
        })

        .catch((error) => {
            console.error('Error de Usuario', error);
            Notify.create('Error al habilitar el Usuario')
        })

}

async function deshabilitarUsuario(usuario) {
    const res = await useUsuario.putdesactivarUsuario(usuario._id)
        .then((response) => {
            console.log(response);
            listarUsuarios()
        })

        .catch((error) => {
            console.error('Error de Usuario', error);
            Notify.create('Error al deshabilitar el Usuario')
        })

}

function traerUsuario(usuario) {

    alerta.value = true
    idsede.value = {
        label: usuario.idsede.codigo,
        value: usuario.idsede._id
    }
    id.value = usuario._id
    nombre.value = usuario.nombre
    direccion.value = usuario.direccion
    horario.value = usuario.horario
    ciudad.value = usuario.ciudad
    telefono.value = usuario.telefono

}

function validarEdicionUsuario() {
    let validacionnumeros = /^[0-9]+$/;
   
    if (idsede.value == "") {
        Notify.create("Se debe agregar un id de la Sede");
    } else if (nombre.value == "") {
        Notify.create("Se debe agregar un nombre de Usuario");
    } else if (direccion.value == "") {
        Notify.create("Se debe agregar una direccion de Usuario");
    } else if (horario.value == "") {
        Notify.create("Se debe agregar un horario de entrada");
    } else if (ciudad.value == "") {
        Notify.create("Se debe agregar una ciudad");
    } else if (telefono.value == "") {
        Notify.create("Se debe agregar un telefono");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe contener numeros");
    } else {
        editarUsuario()
        limpiar()
        cerrar2()
        Notify.create({
            type: "positive",
            message: "Usuario editado exitosamente",
        });
    }

}

async function editarUsuario() {
    try {
        await useUsuario.putUsuario(id.value, {
            idsede: idsede.value.value,
            nombre: nombre.value,
            direccion: direccion.value,
            horario: horario.value,
            ciudad: ciudad.value,
            telefono: telefono.value,
        })
        listarUsuarios()

    } catch (error) {
        console.error('Error al editar el Usuario', error);
        Notify.create('Error al editar el Usuario')
    }
}

function limpiar() {
    idsede.value = ""
    nombre.value = ""
    direccion.value = ""
    horario.value = ""
    ciudad.value = ""
    telefono.value = ""
    correo.value = ""
    password.value = ""
    rol.value = ""

}

onMounted(() => {
    listarUsuarios()
    listarSedes()

})



</script>