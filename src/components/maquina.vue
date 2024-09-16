<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Maquinas</q-btn>
      <q-btn color="green" class="q-my-md q-ml-md" @click="listarMaquinas()">Listar Maquinas</q-btn>
      <q-btn color="green" class="q-my-md q-ml-md" @click="listarMaquinasActivas()" >Listar Maquinas Activas</q-btn>
      <q-btn color="green" class="q-my-md q-ml-md" @click="listarMaquinasInactivas()" >Listar Maquinas Inactivas</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Maquina" : "Editar Maquina" }}
            </div>
          </q-card-section>

          <q-select outlined v-model="idsede" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona una sede">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="agregarMaquinas()" color="red" class="text-white"
              :loading="useMaquina.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validaredicion()" color="red" class="text-white"
              :loading="useMaquina.loading">
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
      <q-table title="Maquinas" title-class="text-red text-weight-bolder text-h4"
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
              <q-btn color="primary" @click="traerinfo(props.row)">
                <q-tooltip>
                    Editar
                </q-tooltip>
                <i class="fas fa-pencil-alt"></i></q-btn>
              <q-btn v-if="props.row.estado == 1" @click="deshabilitarsede(props.row)" color="negative">
                <q-tooltip>
                    Inactivo
                </q-tooltip>
                <i
                  class="fas fa-times"></i></q-btn>
              <q-btn v-else @click="habilitarmaquina(props.row)" color="positive">
                <q-tooltip>
                    Activar
                </q-tooltip>
                <i class="fas fa-check"></i></q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStoreMaquina } from '../stores/maquinas'
import { useStoreSede } from '../stores/sedes'//////
import { Notify } from 'quasar';

const useMaquina = useStoreMaquina()
const useSede = useStoreSede()///////


let rows = ref([]);
let idsede = ref('');
let alert = ref(false)
let accion = ref(1)
let id = ref('');

const columns = ref([
  {
    name: 'idsede',
    required: true,
    label: 'Nombre Sede',
    align: 'center',
    field: (row)=>row.idsede.nombre,
    sortable: true
  },
  {
    name: 'codigo',
    required: true,
    label: 'Codigo de la Maquina',
    align: 'center',
    field: 'codigo',
    sortable: true
  },
  {
    name: 'fechaIngreso',
    required: true,
    label: 'Fecha de Ingreso',
    align: 'center',
    field: 'fechaIngreso',
    sortable: true,
    format: (val) => {
      const fechaIngreso = new Date(val)
      return fechaIngreso.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
            })
    }
  },
  {
    name: 'fechaUltimoMantenimiento',
    required: true,
    label: 'Fecha de Ultimo Mantenimiento',
    align: 'center',
    field: 'fechaUltimoMantenimiento',
    sortable: true,
    format: (val) => {
      const fechaUltimoMantenimiento = new Date(val)
      return fechaUltimoMantenimiento.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
            })
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

// autocomplete of sedes
let sedes = [];
let dates = {};
const options = ref(sedes);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = sedes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  });////////////
};

async function listarMaquinas() {
  const r = await useMaquina.listarMaquinas()
  console.log(r.data.maquina);
  rows.value = r.data.maquina.reverse(); ////////////
}

async function listarMaquinasActivas(){
  const r = await useMaquina.listarMaquinasActivos()
  rows.value = r.data.maquinas.reverse();
  console.log(r.data.maquinas);
}

async function listarMaquinasInactivas(){
  const r = await useMaquina.listarMaquinasInactivos()
  rows.value = r.data.maquinas.reverse();
  console.log(r.data.maquinas);
}


async function listarSedes() {
  const data = await useSede.listarSedesActivo()
  data.data.sede.forEach(item => { // se puede lograr de esta forma directamente en el componente
    dates = {
      label: `${item?.nombre} (${item?.codigo})`,
      value: item._id
    };
    sedes.push(dates);
  });
  console.log(sedes);
}

async function agregarMaquinas() {
  const r = await useMaquina.postMaquina({
    idsede: idsede.value.value

  })
  console.log(r);
  cerrar()
  listarMaquinas()
  limpiarMaquina()

}

async function habilitarmaquina(maquina) {
  const res = await useMaquina.putActivarMaquina(maquina._id)
    .then((response) => {
      console.log(response);
      listarMaquinas()
    })

    .catch((error) => {
      console.error('Error de sede:', error);
      Notify.create("Ocurrió un error al verificar el código de la Maquina. Por favor inténtalo de nuevo.");
    })

}

async function deshabilitarsede(maquina) {
  const res = await useMaquina.putDesactivarMaquina(maquina._id)
    .then((response) => {
      console.log(response);
      listarMaquinas()
    })

    .catch((error) => {
      console.error('Error de sede:', error);
      Notify.create("Ocurrió un error al verificar el código de la Maquina. Por favor inténtalo de nuevo.");
    })

}
function validaredicion() {
  if (idsede.value == "") {
    Notify.create("Por favor selecciona una sede")
  } else {
    editarMaquinas()
    limpiarMaquina()
    cerrar()
    Notify.create({
      type: "positive",
      message: "Maquina editada exitosamente",
    });
  }

}

async function editarMaquinas() {
  try {
   await useMaquina.putMaquina(id.value, {
    idsede: idsede.value.value
   })
    listarMaquinas();
  } catch (error) {
    console.error('Error de maquina:', error);
    Notify.create("Ocurrió un error al verificar el código de la Maquina. Por favor inténtalo de nuevo.");

  }

}

function traerinfo(maquina) {
  id.value = maquina._id
  accion.value = 2
  alert.value = true
  idsede.value = {
    label: maquina.idsede.codigo,
    value: maquina.idsede._id
  }

}


function abrir() {
  accion.value = 1
  alert.value = true;
  limpiarMaquina()
}

function limpiarMaquina() {
  idsede.value = ""
}

function cerrar() {
  alert.value = false
}

onMounted(() => {
  listarMaquinas()
  listarSedes() /////////////////
})

</script>