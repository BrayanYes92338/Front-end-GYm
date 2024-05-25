<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Cliente</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Cliente" : "Editar Cliente" }}
            </div>
          </q-card-section>
          <q-input outlined v-model="nombre" label="Ingrese el nombre del Cliente" class="q-my-md q-mx-md" type="text" />
          <q-input outlined v-model="fechaNacimiento" label="Ingrese el Cumple del Cliente" class="q-my-md q-mx-md"
            type="date" />
          <q-input outlined v-model="edad" label="Ingrese la edad del Cliente" class="q-my-md q-mx-md" type="tel" />
          <q-select outlined v-model="documento"
            :options="['Tarjeta Identidad', 'Cedula Ciudadania', 'Cédula Extranjera', ' Permiso por Protección Temporal']"
            label="Seleccione Tipo Documento" class="q-my-md q-mx-md" />
          <q-input outlined v-model="direccion" label="Ingrese la direccion del Cliente" class="q-my-md q-mx-md"
            type="text" />
          <q-input outlined v-model="telefono" label="Ingrese el Telefono del Cliente" class="q-my-md q-mx-md"
            type="tel" />
          <q-select outlined v-model="idPlan" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione un Plan">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="foto" label="Ingrese la foto del Cliente" class="q-my-md q-mx-md" type="text" />
          <q-input outlined v-model="objetivo" label="Ingrese el objetivo del Cliente" class="q-my-md q-mx-md"
            type="text" />
          <q-input outlined v-model="observaciones" label="Ingrese las observacionesdel Cliente" class="q-my-md q-mx-md"
            type="text" />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarCliente()" color="red" class="text-white"
              :loading="useCliente.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionCliente()" color="red" class="text-white"
              :loading="useCliente.loading">
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
      <q-table title="Clientes" title-class="text-red text-weight-bolder text-h4"
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
              <q-btn color="primary" @click="traerCliente(props.row)" ><i class="fas fa-pencil-alt"></i></q-btn>
              <!-- botons de activado y desactivado -->
              <q-btn v-if="props.row.estado == 1" @click="deshabilitarCliente(props.row)"  color="negative"><i class="fas fa-times"></i></q-btn>
              <q-btn v-else color="positive" @click="habilitarCliente(props.row)" ><i class="fas fa-check"></i></q-btn>
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
import { useStoreCliente } from '../stores/clientes'
import { useStorePlan } from '../stores/planes'

let rows = ref([])
let alert = ref(false);
let accion = ref(1);
let id = ref('')
let nombre = ref("")
let fechaNacimiento = ref("")
let edad = ref("")
let documento = ref("")
let direccion = ref("")
let telefono = ref("")
let idPlan = ref("")
let foto = ref("")
let objetivo = ref("")
let observaciones = ref("")

const useCliente = useStoreCliente()
const usePlan = useStorePlan()

function abrir() {
  accion.value = 1
  alert.value = true;


}

function cerrar() {
  alert.value = false;
}

const columns = ref([
  {
    name: 'nombre',
    required: true,
    label: 'Nombre Cliente',
    align: 'center',
    field: 'nombre',
    sortable: true,
    format: (val) => {
      // Capitalizar la primera letra del responsable
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  {
    name: 'fechaNacimiento',
    required: true,
    label: 'Fecha de Nacimiento',
    align: 'center',
    field: 'fechaNacimiento',
    sortable: true,
    format: (val) => {
      const fechaIngreso = new Date(val)
      return fechaIngreso.toLocaleDateString()
    }
  },
  {
    name: 'edad',
    required: true,
    label: 'Edad Cliente',
    align: 'center',
    field: 'edad',
    sortable: true,
  },
  {
    name: 'fechaIngreso',
    required: true,
    label: 'Fecha Ingreso',
    align: 'center',
    field: 'fechaIngreso',
    sortable: true,
    format: (val) => {
      const fechaIngreso = new Date(val)
      return fechaIngreso.toLocaleDateString()
    }
  },
  {
    name: 'documento',
    required: true,
    label: 'Documento Cliente',
    align: 'center',
    field: 'documento',
    sortable: true,
  },
  {
    name: 'direccion',
    required: true,
    label: 'Direccion Cliente',
    align: 'center',
    field: 'direccion',
    sortable: true,
    format: (val) => {
      // Capitalizar la primera letra del responsable
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  {
    name: 'telefono',
    required: true,
    label: 'Telefono Cliente',
    align: 'center',
    field: 'telefono',
    sortable: true,
  },
  {
    name: 'idPlan',
    required: true,
    label: 'ID Plan',
    align: 'center',
    field: 'idPlan',
    sortable: true,
  },
  {
    name: ' foto',
    required: true,
    label: 'Foto Cliente',
    align: 'center',
    field: 'foto',
    sortable: true,
  },
  {
    name: 'objetivo',
    required: true,
    label: 'Objetivo Cliente',
    align: 'center',
    field: 'objetivo',
    sortable: true,
    format: (val) => {
      // Capitalizar la primera letra del responsable
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  {
    name: 'observaciones',
    required: true,
    label: 'Observaciones Cliente',
    align: 'center',
    field: 'observaciones',
    sortable: true,
    format: (val) => {
      // Capitalizar la primera letra del responsable
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  {
    name: 'fechaVencimiento',
    required: true,
    label: 'Fecha de Vencimiento',
    align: 'center',
    field: 'fechaVencimiento',
    sortable: true,
    format: (val) => {
      const fechaVencimiento = new Date(val)
      return fechaVencimiento.toLocaleDateString()
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
  },

])

async function listarClientes() {
  const r = await useCliente.listarClientes()
  rows.value = r.data.clientes.reverse()
  console.log(r.data.clientes);
}

let planes = [];
let dates = {};
const options = ref(planes)

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = planes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}

async function listarPlanes() {
  const data = await usePlan.listarPlanes()
  data.data.planes.forEach(item => {
    dates = {
      label: item.codigo,
      value: item._id
    }
    planes.push(dates)
  })
  console.log(planes);
}

function validarCliente() {
  let validacionnumeros = /^[0-9]+$/;

  if (nombre.value == "") {
    Notify.create("Se debe agregar un nombre del Cliente");

  } else if (fechaNacimiento.value == "") {
    Notify.create("Se debe agregar la fecha de nacimiento del Cliente");

  } else if (edad.value == "") {
    Notify.create("Se debe agregar la edad del Cliente");

  } else if (!validacionnumeros.test(edad.value)) {
    Notify.create("La edad debe ser un numero");

  } else if (documento.value == "") {
    Notify.create("Se debe agregar el documento del Cliente");

  } else if (direccion.value == "") {
    Notify.create("Se debe agregar la direccion del Cliente");

  } else if (telefono.value == "") {
    Notify.create("Se debe agregar el telefono del Cliente");

  } else if (!validacionnumeros.test(telefono.value)) {
    Notify.create("El telefono debe ser un numero");

  } else if (idPlan.value == "") {
    Notify.create("Se debe agregar el plan del Cliente");

  } else if (foto.value == "") {
    Notify.create("Se debe agregar la foto del Cliente");

  } else if (objetivo.value == "") {
    Notify.create("Se debe agregar el objetivo del Cliente");

  } else if (observaciones.value == "") {
    Notify.create("Se debe agregar las observaciones del Cliente");

  } else {
    agregarCliente()
    limpiar()
    Notify.create({
      type: "positive",
      message: "Cliente agregado exitosamente",
    });
  }

}

async function agregarCliente() {
  const r = await useCliente.postClientes({
    nombre: nombre.value,
    fechaNacimiento: fechaNacimiento.value,
    edad: edad.value,
    documento: documento.value,
    direccion: direccion.value,
    telefono: telefono.value,
    idPlan: idPlan.value.value,
    foto: foto.value,
    objetivo: objetivo.value,
    observaciones: observaciones.value

  })
  listarClientes()
  cerrar()
  console.log(r);

}

async function habilitarCliente(cliente) {
  const res = await useCliente.putactivarCliente(cliente._id)
    .then((response) => {
      listarClientes()
      console.log(response);
    })

    .catch((error) => {
      console.log('Error de Cliente', error);
      Notify.create("Ocurrio un error al verificar el Cliente")
    })

}

async function deshabilitarCliente(cliente) {
  const res = await useCliente.putdesactivarCliente(cliente._id)
    .then((response) => {
      listarClientes()
      console.log(response);
    })

    .catch((error) => {
      console.log('Error de Cliente', error);
      Notify.create("Ocurrio un error al verificar el Cliente")
    })

}

function traerCliente(cliente){
  accion.value = 2
  alert.value = true;
  id.value = cliente._id
  nombre.value = cliente.nombre
  fechaNacimiento.value = cliente.fechaNacimiento
  edad.value = cliente.edad
  documento.value = cliente.documento
  direccion.value = cliente.direccion
  telefono.value = cliente.telefono
  idPlan.value = cliente.idPlan
  foto.value = cliente.foto
  objetivo.value = cliente.objetivo
  observaciones.value = cliente.observaciones

}

function validarEdicionCliente() {
  let validacionnumeros = /^[0-9]+$/;

  if (nombre.value == "") {
    Notify.create("Se debe agregar un nombre del Cliente");

  } else if (fechaNacimiento.value == "") {
    Notify.create("Se debe agregar la fecha de nacimiento del Cliente");

  } else if (edad.value == "") {
    Notify.create("Se debe agregar la edad del Cliente");

  } else if (!validacionnumeros.test(edad.value)) {
    Notify.create("La edad debe ser un numero");

  } else if (documento.value == "") {
    Notify.create("Se debe agregar el documento del Cliente");

  } else if (direccion.value == "") {
    Notify.create("Se debe agregar la direccion del Cliente");

  } else if (telefono.value == "") {
    Notify.create("Se debe agregar el telefono del Cliente");

  } else if (!validacionnumeros.test(telefono.value)) {
    Notify.create("El telefono debe ser un numero");

  } else if (idPlan.value == "") {
    Notify.create("Se debe agregar el plan del Cliente");

  } else if (foto.value == "") {
    Notify.create("Se debe agregar la foto del Cliente");

  } else if (objetivo.value == "") {
    Notify.create("Se debe agregar el objetivo del Cliente");

  } else if (observaciones.value == "") {
    Notify.create("Se debe agregar las observaciones del Cliente");

  } else {
    editarcliente()
    limpiar()
    cerrar()
    Notify.create({
      type: "positive",
      message: "Cliente agregado exitosamente",
    });
  }

}


async function editarcliente(){
  try{
    await useCliente.putCliente(id.value,{
      nombre: nombre.value,
      fechaNacimiento: fechaNacimiento.value,
      edad: edad.value,
      documento: documento.value,
      direccion: direccion.value,
      telefono: telefono.value,
      idPlan: idPlan.value.value,
      foto: foto.value,
      objetivo: objetivo.value,
      observaciones: observaciones.value
    })
    listarClientes()

  }catch (error){
    console.error('Error de cliente', error)
        Notify.create('Ocurrio un error al editar el cliente')
  }
}


function limpiar() {
  nombre.value = ""
  fechaNacimiento.value = ""
  edad.value = ""
  documento.value = ""
  direccion.value = ""
  telefono.value = ""
  idPlan.value = ""
  foto.value = ""
  objetivo.value = ""
  observaciones.value = ""
}

onMounted(() => {
  listarClientes()
  listarPlanes()
});

</script>
