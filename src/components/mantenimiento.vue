<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Mantenimiento</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click=" ListarMantenimientosActivos()">Listar Mantenimiento
                Activo</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="ListarMantenimientosInactivos()">Listar Mantenimiento
                Inactivo</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="mostrar()" >Listar Mantenimiento Maquina</q-btn>

        </div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <input type="date" v-model="fechaInicio" class="q-my-md q-mx-md" />
            <input type="date" v-model="fechaFin" class="q-my-md q-mx-md" />
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarValorMantenimiento()" >Listar Valor Mantenimientos</q-btn>
        </div>
        <!-- Listar Mantenimiento Maquinas -->
        <div>
            <q-dialog v-model="alerta" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">Buscar Mantenimientos de Maquina</div>
                    </q-card-section>
                    <q-select outlined v-model="idMaquina" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona una Maquina">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">Sin resultados</q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="useMantenimiento.loading"
                            @click="ListarMantenimientoMaquina()">
                            Buscar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar2()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <!-- Agregar Mantenimientos -->
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Mantenimiento" : "Editar Mantenimiento" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idMaquina" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona una Maquina">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="descripcion" label="Ingrese descripcion del mantenimiento"
                        class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="responsable" label="Ingrese responsable del mantenimiento"
                        class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="precio" label="Ingrese precio del mantenimiento" class="q-my-md q-mx-md"
                        type="tel" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarMantenimiento()" color="red" class="text-white"
                            :loading="useMantenimiento.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionMantenimiento()" color="red" class="text-white"
                            :loading="useMantenimiento.loading">
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
            <q-table title="Mantenimientos" title-class="text-red text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerMantenimiento(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i
                                    class="fas fa-pencil-alt"></i></q-btn>
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarMantenimiento(props.row)"
                                color="negative">
                                <q-tooltip>
                                    Inactivar
                                </q-tooltip>
                                <i class="fas fa-times"></i></q-btn>
                            <q-btn v-else @click="habilitarMantenimiento(props.row)" color="positive">
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
        <h3 class="info">{{ valor }}</h3>

    </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useStoreMantenimiento } from '../stores/mantenimiento'
import { useStoreMaquina } from '../stores/maquinas';

const useMantenimiento = useStoreMantenimiento()
const useMaquina = useStoreMaquina()

let rows = ref([]);
let idMaquina = ref("")
let descripcion = ref("")
let responsable = ref("")
let precio = ref("")
let alert = ref(false);
let alerta = ref(false)
let accion = ref(1);
let id = ref('')
let fechaInicio = ref('')
let fechaFin = ref('')
let valor = ref('')

let prueba = ref('')

function abrir() {
    accion.value = 1
    alert.value = true;
    limpiar()
}

function mostrar(){
    alerta.value = true

}

function cerrar2(){
    alerta.value = false
}

function cerrar() {
    alert.value = false;
}

const columns = ref([
    {
        name: 'idMaquina',
        required: true,
        label: 'Codigo Maquina',
        align: 'center',
        field: (row) => row.idMaquina.codigo,
        sortable: true
    },
    {
        name: 'fecha',
        required: true,
        label: 'Fecha del Mantenimiento',
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
        name: 'descripcion',
        required: true,
        label: 'Descripcion  Mantenimiento',
        align: 'center',
        field: 'descripcion',
        sortable: true,
        format: (val) => {
            // Capitalizar la primera letra del responsable
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
    },
    {
        name: 'responsable',
        required: true,
        label: 'Responsable  Mantenimiento',
        align: 'center',
        field: 'responsable',
        sortable: true,
        format: (val) => {
            // Capitalizar la primera letra del responsable
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
    },
    {
        name: 'precio',
        required: true,
        label: 'Precio del Mantenimiento',
        align: 'center',
        field: 'precio',
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

let maquinas = [];
let dates = {};
const options = ref(maquinas)


function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = maquinas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};


async function listarMantenimientos() {
    const r = await useMantenimiento.listarMantenimientos()
    rows.value = r.data.mantenimiento.reverse();
    console.log(r.data.mantenimiento);

}

async function ListarMantenimientosActivos() {
    const r = await useMantenimiento.listarMantenimientosActivos()
    rows.value = r.data.Mantenimientos.reverse();
    console.log(r.data.Mantenimientos);

}

async function ListarMantenimientosInactivos() {
    const r = await useMantenimiento.listarMantenimientosInactios()
    rows.value = r.data.Mantenimientos.reverse();
    console.log(r.data.Mantenimientos);
}

async function ListarMantenimientoMaquina() {
    try {
        console.log(idMaquina.value.value);
        const r = await useMantenimiento.listarMantenimientoMaquina(idMaquina.value.value)
        console.log(r);
        console.log(r.data);
        rows.value = r.data.reverse();
        Notify.create({
            message: "Busqueda Existosa",
            position: "top",
            color: 'green',
            timeout: 3000
            })
            cerrar2()
    } catch (error) {
        console.error("Error al realizar la busqueda");
    }
}

async function listarValorMantenimiento(){
    const r = await useMantenimiento.listarValorMantenimiento(fechaInicio.value, fechaFin.value)
    console.log(r);
    if(r.data.msg){
        valor.value = r.data.msg
        Notify.create({
     message: r.data.msg,
     position: "center",
     color: 'red',
     timeout: 4000
    })
    }else{
    valor.value = r.data
    }
    if(r.data.data){
        rows.value = r.data.data.reverse();
    }
}

async function listarMaquinas() {
    const data = await useMaquina.listarMaquinasActivos()
    data.data.maquinas.forEach(item => {
        dates = {
            label: `${item?.idsede.nombre} (${item?.codigo})`,
            value: item._id
        };
        maquinas.push(dates);
    });
    console.log(maquinas);

}

function validarMantenimiento() {
    let validacionnumeros = /^[0-9]+$/;

    if (idMaquina.value == "") {
        Notify.create("Se debe agregar nombre Maquina");
    } else if (descripcion == "" || descripcion.value.trim().length === 0) {
        Notify.create("Se debe agregar una descripcion del mantenimiento");
    } else if (responsable == "" || responsable.value.trim().length === 0) {
        Notify.create("Se debe agregar un responsable del mantenimiento");

    } else if (precio == "" || precio.value.trim().length === 0) {
        Notify.create("Se debe agregar un precio del mantenimiento");
    } else if (!validacionnumeros.test(precio.value)) {
        Notify.create("El precio debe ser un numero");
    } else {
        agregarMantenimientos()
        limpiar()
        Notify.create({
            type: "positive",
            message: "Mantenimiento agregado exitosamente",
        });
    }
}

function limpiar() {
    idMaquina.value = ""
    descripcion.value = ""
    responsable.value = ""
    precio.value = ""
}


async function agregarMantenimientos() {

    const r = await useMantenimiento.postMantenimiento({
        idMaquina: idMaquina.value.value,
        descripcion: descripcion.value,
        responsable: responsable.value,
        precio: precio.value
    });

    listarMantenimientos();
    cerrar();
    console.log(r);
}

function traerMantenimiento(mantenimiento) {
    accion.value = 2
    alert.value = true
    idMaquina.value = {
        label: mantenimiento.idMaquina.codigo,
        value: mantenimiento.idMaquina._id
    };
    id.value = mantenimiento._id;
    descripcion.value = mantenimiento.descripcion;
    responsable.value = mantenimiento.responsable;
    precio.value = mantenimiento.precio;
}

function validarEdicionMantenimiento() {
    let validacionnumeros = /^[0-9]+$/;

    if (idMaquina.value == "") {
        Notify.create("Se debe agregar un id de la Maquina");
    } else if (descripcion == "" || descripcion.value.trim().length === 0) {
        Notify.create("Se debe agregar una descripcion del mantenimiento");
    } else if (responsable == "" || responsable.value.trim().length === 0) {
        Notify.create("Se debe agregar un responsable del mantenimiento");

    } else if (precio == "") {
        Notify.create("Se debe agregar un precio del mantenimiento");
    } else if (!validacionnumeros.test(precio.value)) {
        Notify.create("El precio debe ser un numero");
    } else {
        editarMantenimientos()
        limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Mantenimiento editado exitosamente",
        });
    }

}

async function editarMantenimientos() {
    try {
        await useMantenimiento.putMantenimiento(id.value, {
            idMaquina: idMaquina.value.value,
            descripcion: descripcion.value,
            responsable: responsable.value,
            precio: precio.value
        });
        listarMantenimientos();

    } catch (error) {
        console.error('Error de mantenimiento', error)
        Notify.create('Ocurrio un error al editar el mantenimiento')
    }
}

async function habilitarMantenimiento(mantenimiento) {
    const res = await useMantenimiento.putActivarMantenimiento(mantenimiento._id)
        .then((response) => {
            console.log(response);
            listarMantenimientos()
        })
        .catch((error) => {
            console.log('Error de Mantenimiento', error);
            Notify.create("Ocurrio un error al verificar el mantenimiento")
        })
}

async function deshabilitarMantenimiento(mantenimiento) {
    const res = await useMantenimiento.putDesactivarMantenimiento(mantenimiento._id)
        .then((response) => {
            console.log(response);
            listarMantenimientos()
        })
        .catch((error) => {
            console.log('Error de Mantenimiento', error);
            Notify.create("Ocurrio un error al verificar el mantenimiento")
        })
}




onMounted(() => {
    listarMantenimientos()
    listarMaquinas()
})

</script>


<style>
.info{
    text-align: center;
    color: black;
    font-size: 30px;
    font-weight: bold;
}
</style>