<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Cliente</q-btn>
      <q-btn color="green" class="q-my-md q-ml-md" @click="listarClientes()">Listar Ingresos</q-btn>
      <q-btn color="green" class="q-my-md q-ml-md" @click="listarClientesActivos()" >Listar Clientes Activos</q-btn>
      <q-btn color="green" class="q-my-md q-ml-md" @click="listarClientesInactivos()" >Listar Clientes Inactivos</q-btn>
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
            type="date" :max="today" />
            <q-field filled :dense="false" disable class="q-my-md q-mx-md">
              <template v-slot:control >
                <div>{{ calculateAge }}</div>
              </template>
            </q-field>
          <q-input outlined v-model="documento" label="Ingrese el Documento del Cliente" class="q-my-md q-mx-md"
            type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-input outlined v-model="direccion" label="Ingrese la direccion del Cliente" class="q-my-md q-mx-md"
            type="text" />
          <q-input outlined v-model="telefono" label="Ingrese el Telefono del Cliente" class="q-my-md q-mx-md" type="tel"
            required pattern="[0-9]+" maxlength="10" />
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
          <q-input outlined v-model="foto" v-if="editt === true" disable label="Ingrese la foto del Cliente" class="q-my-md q-mx-md" type="text" />
          <q-input outlined v-model="foto" v-if="editt === false" label="Ingrese la foto del Cliente" class="q-my-md q-mx-md" type="text" />
          <q-input autogrow outlined v-model="objetivo" label="Ingrese el objetivo del Cliente" class="q-my-md q-mx-md"
            type="text" />
          <q-input autogrow outlined v-model="observaciones" label="Ingrese las observacionesdel Cliente" class="q-my-md q-mx-md"
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

    <div>
      <q-dialog v-model="seguimientoModel" persistent full-width>
        <q-card class="">
          <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
            <div class="text-h6 text-white">
              Seguimientos de {{ nombreSeg }} 
            </div>
          </q-card-section>
          <q-table v-if="seguimiento.length > 0" table-header-class="text-black font-weight-bold" :rows="seguimiento" :columns="columnSeguimiento" row-key="name" >
            <template v-slot:body-cell-imcc="props">
              <q-td :props="props">
                <div v-if="parseFloat(props.row.imc) < 18.5" class="text-blue">{{ parseFloat(props.row.imc).toFixed(2) }} Bajo Peso</div>
                <div v-if="parseFloat(props.row.imc) > 18.6 && parseFloat(props.row.imc) < 24.9" class="text-green">{{ parseFloat(props.row.imc).toFixed(2) }} Normal</div>
                <div v-if="parseFloat(props.row.imc) > 25 && parseFloat(props.row.imc) < 29.9" class="text-yellow">{{ parseFloat(props.row.imc).toFixed(2) }} Sobre Peso</div>
                <div v-if="parseFloat(props.row.imc) > 30 && parseFloat(props.row.imc) < 34.9" class="text-amber">{{ parseFloat(props.row.imc).toFixed(2) }} Obesidad 1</div>
                <div v-if="parseFloat(props.row.imc) > 35 && parseFloat(props.row.imc) < 39.9" class="text-orange">{{ parseFloat(props.row.imc).toFixed(2) }} Obesidad 2</div>
                <div v-if="parseFloat(props.row.imc) >=40 " class="text-red">{{ parseFloat(props.row.imc).toFixed(2) }} Obesidad 3</div>
              </q-td>
            </template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn color="primary" @click="traerSeg(props.row)"><i class="fas fa-pencil-alt"></i>
                <q-tooltip>
                  Editar
                </q-tooltip>
              </q-btn>
              </q-td>
            </template>
          </q-table>
          <h4 v-else>El usuario {{ nombreSeg }} no cuenta con seguimientos</h4>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="black" outline @click="seguimientoModel = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-dialog v-model="modalInfoSeg" persistent>
        <q-card style="width: 800px;">
          <q-card-section horizontal style="background-color: #a1312d; margin-bottom: 20px">
            <q-card-section>
              <div class="text-h6 text-white">
                Seguimientos de {{ nombreSeg }} 
              </div>
            </q-card-section>
            <q-card-section class="text-rigth col-5">
              <q-avatar size="50px">
                <img :src="imgCliente">
              </q-avatar>
            </q-card-section>
          </q-card-section>
            <q-input outlined v-model="peso" label="Ingrese el peso del Cliente" class="q-my-md q-mx-md" type="number" />
            <q-input outlined v-model="estatura" label="Ingrese la altura del Cliente" class="q-my-md q-mx-md" type="number" />
            <q-field filled :dense="false" disable class="q-my-md q-mx-md">
              <template v-slot:control >
                <!-- {{ (peso / (estatura * estatura)).toFixed(2) }} -->
                <div v-if="peso && estatura" class="self-center full-width no-outline">
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) < 18.5" class="text-blue" > 
                    {{ (peso / (estatura * estatura)).toFixed(2) }} Bajo peso 
                  </div>
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) > 18.5 && (peso / (estatura * estatura)).toFixed(2) < 24.9" class="text-green" > 
                    {{ (peso / (estatura * estatura)).toFixed(2) }} Normal
                  </div>
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) > 25 && (peso / (estatura * estatura)).toFixed(2) < 29.9" class="text-yellow" > 
                    {{ (peso / (estatura * estatura)).toFixed(2) }} Sobre Peso
                  </div>
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) > 30 && (peso / (estatura * estatura)).toFixed(2) < 34.9" class="text-amber" > 
                      {{ (peso / (estatura * estatura)).toFixed(2) }} Obesidad 1
                </div>
                <div v-if="(peso / (estatura * estatura)).toFixed(2) > 35 && (peso / (estatura * estatura)).toFixed(2) < 39.9" class="text-orange" > 
                      {{ (peso / (estatura * estatura)).toFixed(2) }} Obesidad 2
                </div>
                <div v-if="(peso / (estatura * estatura)).toFixed(2) >= 40" class="text-red" > 
                      {{ (peso / (estatura * estatura)).toFixed(2) }} Obesidad 3
                </div>
                </div>
              </template>
            </q-field>
            <!-- <q-input outlined v-model="imc" label="Ingrese la altura del Cliente" class="q-my-md q-mx-md" type="text" /> -->
            <q-input outlined v-model="brazo" label="Ingrese la medida de brazo del Cliente" class="q-my-md q-mx-md" type="tel" required pattern="[0-9]+" maxlength="10" />
            <q-input outlined v-model="pierna" label="Ingrese la medida de pierna del Cliente" class="q-my-md q-mx-md" type="text" />
            <q-input outlined v-model="cintura" label="Ingrese la medida de cintura del Cliente" class="q-my-md q-mx-md" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-card-actions align="right">
            <q-btn  @click="editarSeguimientoCliente()" color="red" class="text-white"
              :loading="useCliente.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="modalInfoSeg = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-dialog v-model="modalSegui" persistent>
        <q-card style="width: 800px;">
          <q-card-section horizontal style="background-color: #a1312d; margin-bottom: 20px">
            <q-card-section>
              <div class="text-h6 text-white">
                Seguimientos de {{ nombreSeg }} 
              </div>
            </q-card-section>
          </q-card-section>
            <q-input outlined v-model="peso" label="Ingrese el peso del Cliente" class="q-my-md q-mx-md" type="number" />
            <q-input outlined v-model="estatura" label="Ingrese la altura del Cliente" class="q-my-md q-mx-md" type="number" />
            <q-field filled :dense="false" disable class="q-my-md q-mx-md">
              <template v-slot:control >
                <!-- {{ (peso / (estatura * estatura)).toFixed(2) }} -->
                <div v-if="peso && estatura" class="self-center full-width no-outline">
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) < 18.5" class="text-blue" > 
                    {{ (peso / (estatura * estatura)).toFixed(2) }} Bajo peso 
                  </div>
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) > 18.5 && (peso / (estatura * estatura)).toFixed(2) < 24.9" class="text-green" > 
                    {{ (peso / (estatura * estatura)).toFixed(2) }} Normal
                  </div>
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) > 25 && (peso / (estatura * estatura)).toFixed(2) < 29.9" class="text-yellow" > 
                    {{ (peso / (estatura * estatura)).toFixed(2) }} Sobre Peso
                  </div>
                  <div v-if="(peso / (estatura * estatura)).toFixed(2) > 30 && (peso / (estatura * estatura)).toFixed(2) < 34.9" class="text-amber" > 
                      {{ (peso / (estatura * estatura)).toFixed(2) }} Obesidad 1
                </div>
                <div v-if="(peso / (estatura * estatura)).toFixed(2) > 35 && (peso / (estatura * estatura)).toFixed(2) < 39.9" class="text-orange" > 
                      {{ (peso / (estatura * estatura)).toFixed(2) }} Obesidad 2
                </div>
                <div v-if="(peso / (estatura * estatura)).toFixed(2) >= 40" class="text-red" > 
                      {{ (peso / (estatura * estatura)).toFixed(2) }} Obesidad 3
                </div>
                </div>
              </template>
            </q-field>
            <!-- <q-input outlined v-model="imc" label="Ingrese la altura del Cliente" class="q-my-md q-mx-md" type="text" /> -->
            <q-input outlined v-model="brazo" label="Ingrese la medida de brazo del Cliente" class="q-my-md q-mx-md" type="tel" required pattern="[0-9]+" maxlength="10" />
            <q-input outlined v-model="pierna" label="Ingrese la medida de pierna del Cliente" class="q-my-md q-mx-md" type="text" />
            <q-input outlined v-model="cintura" label="Ingrese la medida de cintura del Cliente" class="q-my-md q-mx-md" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-card-actions align="right">
            <q-btn  @click="editarSeg()" color="red" class="text-white"
              :loading="useCliente.loading">Editar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="modalSegui = false, editt.value = false" />
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
        <template v-slot:body-cell-objetivoo="props">
          <q-td :props="props">
            <VTooltip placement="bottom" v-model="showTooltip">
              <div @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                {{ props.row.objetivo.length > 10 ? props.row.objetivo.substring(0, 10) + '...' : props.row.objetivo }}
              </div>
              <template #popper>
                <div style="max-height: 200px; max-width: 200px; overflow-y: auto;" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                  {{ props.row.objetivo }}
                </div>
              </template>
            </VTooltip>
          </q-td>
        </template>
        <template v-slot:body-cell-observacioness="props">
          <q-td :props="props">
            <VTooltip placement="bottom" v-model="showTooltip">
              <div @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                {{ props.row.observaciones.length > 10 ? props.row.observaciones.substring(0, 10) + '...' : props.row.observaciones }}
              </div>
              <template #popper>
                <div style="max-height: 200px; max-width: 200px; overflow-y: auto;" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                  {{ props.row.observaciones }}
                </div>
              </template>
            </VTooltip>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap:15px; justify-content: center;">
              <!-- boton de editar -->
              <q-btn color="primary" @click="traerCliente(props.row)"><i class="fas fa-pencil-alt"></i>
                <q-tooltip>
                  Editar
                </q-tooltip>
              </q-btn>
              <!-- botons de activado y desactivado -->
              <q-btn v-if="props.row.estado == 1" @click="deshabilitarCliente(props.row)" color="negative">
                <q-tooltip>
                    Inactivar
                </q-tooltip>
                <i
                  class="fas fa-times"></i></q-btn>
              <q-btn v-else color="positive" @click="habilitarCliente(props.row)">
                <q-tooltip>
                    Activar
                </q-tooltip>
                <i class="fas fa-check">
              </i></q-btn>
              <!-- botones de seguimiento -->
              <q-btn color="teal" @click="traerSeguimiento(props.row)">
                <q-tooltip>
                    Ver Seguimientos
                </q-tooltip>
                <i class="fas fa-eye">
                </i>
              </q-btn>
              <q-btn color="pink" @click="traerData(props.row)">
                <q-tooltip>
                    Agregar Seguimientos
                </q-tooltip>
                <i class="fas fa-plus" ></i>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>



  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Notify } from 'quasar';
import { useStoreCliente } from '../stores/clientes'
import { useStorePlan } from '../stores/planes'

let showTooltip = ref(false)
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
let seguimientoModel = ref(false)
let seguimiento = ref([]);
let nombreSeg = ref("")
let modalInfoSeg = ref(false);
let modalSegui = ref(false);
let fechaSeg = ref("")
let peso = ref("")
let estatura = ref("")
let brazo = ref("")
let pierna = ref("")
let cintura = ref("")
let idSeg = ref("")
let today = new Date().toISOString().split('T')[0]
const birthDate = ref(null);
let imgCliente = ref("")
let idSegui = ref("")
let editt = ref(false)

let columnSeguimiento = ref([
{
    name: 'fecha',
    required: true,
    label: 'Fecha',
    align: 'center',
    field: 'fecha',
    sortable: true,
    format: (val) => {
      const fechaIngreso = new Date(val)
      return fechaIngreso.toLocaleDateString()
    }
  },
  {
    name: 'peso',
    required: true,
    label: 'Peso',
    align: 'center',
    field: 'peso',
    sortable: true,
    format: (val) => {
      // Capitalizar la primera letra del responsable
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  {
    name: 'estatura',
    required: true,
    label: 'Altura',
    align: 'center',
    field: 'estatura',
    sortable: true
  },
  {
    name: 'imcc',
    required: true,
    label: 'IMC',
    align: 'center',
    field: 'imcc',
    sortable: true,
  },
  {
    name: 'brazo',
    required: true,
    label: 'Medida Brazo',
    align: 'center',
    field: 'brazo',
    sortable: true,
  },
  {
    name: 'pierna',
    required: true,
    label: 'Medida Pierna',
    align: 'center',
    field: 'pierna',
    sortable: true,
  },
  {
    name: 'cintura',
    required: true,
    label: 'Medida Cintura',
    align: 'center',
    field: 'cintura',
    sortable: true,
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

const useCliente = useStoreCliente()
const usePlan = useStorePlan()

function abrir() {
  accion.value = 1
  alert.value = true;


}

function cerrar() {
  alert.value = false;
  limpiar()
  editt.value = false
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
      return fechaIngreso.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })}
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
    field: (row) => row.fechaIngreso.split("T")[0],
    sortable: true,
    format: (val) => {
      const fechaIngreso = new Date(val);
      return fechaIngreso.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  });
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
    label: 'Tipo Plan',
    align: 'center',
    field: (row) => row.idPlan.descripcion,
    sortable: true,
  },
  {
    name: 'objetivoo',
    required: true,
    label: 'Objetivo Cliente',
    align: 'center',
    field: 'objetivoo',
    sortable: true,
    format: (val) => {
      // Capitalizar la primera letra del responsable
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  {
    name: 'observacioness',
    required: true,
    label: 'Observaciones Cliente',
    align: 'center',
    field: 'observacioness',
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
      return fechaVencimiento.toLocaleDateString('en-GB', {
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
  },

])

function traerData (data) {
  modalInfoSeg.value = true
  nombreSeg.value = data.nombre
  imgCliente.value = data.foto
  console.log(data.foto);
  limpiarSeg()
}

function traerSeg (data) {
  modalSegui.value = true
  // nombreSeg.value = data.nombre
  // imgCliente.value = data.foto
  peso.value = data.peso
  estatura.value = data.estatura
  brazo.value = data.brazo
  pierna.value = data.pierna
  cintura.value = data.cintura
  idSegui.value = data._id
  console.log(data);
  limpiar()
}


const calculateAge = computed(() => {
  if (fechaNacimiento.value) {
    const birthday = new Date(fechaNacimiento.value);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }
  return '';
});

async function listarClientes() {
  const r = await useCliente.listarClientes()
  rows.value = r.data.clientes.reverse()
  console.log(r.data.clientes);
}

async function listarClientesActivos(){
  const r = await useCliente.listarClientesActivos()
  rows.value = r.data.Clientes.reverse()
  console.log(r.data.Clientes);

}

async function listarClientesInactivos(){
  const r = await useCliente.listarClientesInactivos()
  rows.value = r.data.Clientes.reverse()
  console.log(r.data.Clientes);
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
  const data = await usePlan.listarPlanesActivos()
  data.data.planes.forEach(item => {
    dates = {
      label: item.descripcion,
      value: item._id
    }
    planes.push(dates)
  })
  console.log(planes);
}

function validarCliente() {
  let validacionnumeros = /^[0-9]+$/;

  if (nombre.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar un nombre del Cliente");

  } else if (fechaNacimiento.value == "") {
    Notify.create("Se debe agregar la fecha de nacimiento del Cliente");

  } else if (calculateAge.value == "") {
    Notify.create("Se debe agregar la edad del Cliente");

  } else if (!validacionnumeros.test(calculateAge.value)) {
    Notify.create("La edad debe ser un numero");

  } else if (documento.value == "" || documento.value.trim().length === 0) {
    Notify.create("Se debe agregar el documento del Cliente");

  } else if (documento.value.length <= 7) {
    Notify.create("Se debe agregar al menos 7 numeros");
  } else if (!validacionnumeros.test(documento.value)) {
    Notify.create("El documento debe ser un numero");
  } else if (direccion.value == "" || direccion.value.trim().length === 0) {
    Notify.create("Se debe agregar la direccion del Cliente");

  } else if (telefono.value == "" || telefono.value.trim().length === 0) {
    Notify.create("Se debe agregar el telefono del Cliente");

  } else if (telefono.value.length < 10) {
    Notify.create("Se debe agregar al menos 10 numeros");
  } else if (!validacionnumeros.test(telefono.value)) {
    Notify.create("El telefono debe ser un numero");

  } else if (idPlan.value == "") {
    Notify.create("Se debe agregar el plan del Cliente");

  } else if (foto.value == "" || foto.value.trim().length === 0) {
    Notify.create("Se debe agregar la foto del Cliente");

  } else if (objetivo.value == "" || objetivo.value.trim().length === 0) {
    Notify.create("Se debe agregar el objetivo del Cliente");

  } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
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


function traerSeguimiento(cliente){
  seguimientoModel.value= true;
  idSeg.value = cliente._id
  nombreSeg.value = cliente.nombre
  seguimiento.value = cliente.seguimiento
}

function limpiarSeg() {
  peso.value = ""
  estatura.value = ""
  brazo.value = ""
  pierna.value =  ""
  cintura.value = ""
}

async function editarSeguimientoCliente() {
  try {
    console.log(peso.value);
    if(!peso.value || peso.value.trim().length === 0){
      Notify.create('Por favor ingrese un Peso')
    }else if(!estatura.value || estatura.value.trim().length === 0){
      Notify.create('Por favor ingrese una altura')
    }else if(!brazo.value || brazo.value.trim().length === 0){
      Notify.create('Por favor ingrese una medida de brazo')
    }else if(!pierna.value || pierna.value.trim().length === 0){
      Notify.create('Por favor ingrese una medida de pierna')
    }else if(!cintura.value || cintura.value.trim().length === 0){
      Notify.create('Por favor ingrese una medida de cintura')
    }else{
      let nuevoSeguimiento = {
        fecha: Date.now(),
        peso: peso.value,
        estatura: estatura.value,
        brazo: brazo.value,
        pierna: pierna.value,
        cintura: cintura.value,
        imc: `${peso.value / (estatura.value * estatura.value)}`
      }
      seguimiento.value.push(nuevoSeguimiento)
      modalInfoSeg.value = false
      await useCliente.putCliente(idSeg.value, {
        seguimiento: seguimiento.value
      })
      listarClientes()
      limpiarSeg()
    }
  } catch (error) {
    console.error('Error de cliente', error)
    Notify.create('Ocurrio un error al editar el cliente')
  }
}

async function agregarCliente() {
  const r = await useCliente.postClientes({
    nombre: nombre.value,
    fechaNacimiento: fechaNacimiento.value,
    edad: calculateAge.value,
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
  console.log(cliente._id);
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

function traerCliente(cliente) {
  accion.value = 2
  editt.value = true
  alert.value = true;
  id.value = cliente._id
  nombre.value = cliente.nombre
  fechaNacimiento.value = cliente.fechaNacimiento.split("T")[0]
  documento.value = cliente.documento
  direccion.value = cliente.direccion
  telefono.value = cliente.telefono
  idPlan.value = {
    label: cliente.idPlan.descripcion,
    value: cliente.idPlan._id
  }
  foto.value = cliente.foto
  objetivo.value = cliente.objetivo
  observaciones.value = cliente.observaciones
  
}

function validarEdicionCliente() {
  let validacionnumeros = /^[0-9]+$/;

  if (nombre.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar un nombre del Cliente");

  } else if (fechaNacimiento.value == "") {
    Notify.create("Se debe agregar la fecha de nacimiento del Cliente");

  } else if (calculateAge.value == "") {
    Notify.create("Se debe agregar la edad del Cliente");

  } else if (!validacionnumeros.test(calculateAge.value)) {
    Notify.create("La edad debe ser un numero");

  } else if (documento.value == "" || documento.value.trim().length === 0) {
    Notify.create("Se debe agregar el documento del Cliente");

  } else if (!validacionnumeros.test(documento.value)) {
    Notify.create("El documento debe ser un numero");
  } else if (direccion.value == "") {
    Notify.create("Se debe agregar la direccion del Cliente");

  } else if (telefono.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar el telefono del Cliente");

  } else if (!validacionnumeros.test(telefono.value)) {
    Notify.create("El telefono debe ser un numero");

  } else if (idPlan.value == "") {
    Notify.create("Se debe agregar el plan del Cliente");

  } else if (foto.value == "" || foto.value.trim().length === 0) {
    Notify.create("Se debe agregar la foto del Cliente");

  } else if (objetivo.value == "" || objetivo.value.trim().length === 0) {
    Notify.create("Se debe agregar el objetivo del Cliente");

  } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
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

async function editarSeg() {
  try {
    console.log(peso.value);
    if(!peso.value || peso.value.trim().length === 0){
      Notify.create('Por favor ingrese un Peso')
    }else if(!estatura.value || estatura.value.trim().length === 0){
      Notify.create('Por favor ingrese una altura')
    }else if(!brazo.value || brazo.value.trim().length === 0){
      Notify.create('Por favor ingrese una medida de brazo')
    }else if(!pierna.value || pierna.value.trim().length === 0){
      Notify.create('Por favor ingrese una medida de pierna')
    }else if(!cintura.value || cintura.value.trim().length === 0){
      Notify.create('Por favor ingrese una medida de cintura')
    }else{
      for (let i = 0; i < seguimiento.value.length; i++) {
        const info = seguimiento.value[i];
        if(info._id === idSegui.value){
        
        info.peso= peso.value,
        info.estatura= estatura.value,
        info.brazo= brazo.value,
        info.pierna= pierna.value,
        info.cintura= cintura.value,
        info.imc= `${peso.value / (estatura.value * estatura.value)}`
        console.log(info);
        break
        }
      }
      console.log(seguimiento.value);
      modalSegui.value = false
       await useCliente.putCliente(idSeg.value, {
         seguimiento: seguimiento.value
       })
      listarClientes()
      limpiarSeg()
    }
  } catch (error) {
    console.error('Error de cliente', error)
    Notify.create('Ocurrio un error al editar el cliente')
  }
}

async function editarcliente() {
  try {
    console.log(idPlan.value);
    await useCliente.putCliente(id.value, {
      nombre: nombre.value,
      fechaNacimiento: fechaNacimiento.value,
      edad: calculateAge.value,
      documento: documento.value,
      direccion: direccion.value,
      telefono: telefono.value,
      idPlan: idPlan.value.value,
      foto: foto.value,
      objetivo: objetivo.value,
      observaciones: observaciones.value
    })
    listarClientes()

  } catch (error) {
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
