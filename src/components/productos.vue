<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Productos</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarProductos()">Listar Productos</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarProductoActivo()">Listar Productos Activos</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarProductoInactivo()">Listar Productos Inactivos</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Producto" : "Editar Producto" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" label="Agrega un nombre al producto" class="q-my-md q-mx-md"
                        type="text" />
                    <q-input outlined v-model="valor" label="Agrega un valor al producto" class="q-my-md q-mx-md"
                        type="tel" />
                    <q-input outlined v-model="cantidad" label="Agrega una cantidad al producto" class="q-my-md q-mx-md"
                        type="tel" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarProductos()" color="red" class="text-white"
                            :loading="useProducto.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" color="red" @click="validarEdicionProductos()" class="text-white" :loading="useProducto.loading">
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
            <q-table :filter="fil" title="Productos" title-class="text-red text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">

                <template v-slot:top-right>
                  <q-input color="black" v-model="fil" placeholder="Buscar">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                  </q-input>
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
                            <q-btn color="primary" @click="traerProducto(props.row)" >
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt"></i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarProductos(props.row)"
                                color="negative">
                                <q-tooltip>
                                    Inactivar
                                </q-tooltip>
                                <i class="fas fa-times"></i></q-btn>
                            <q-btn v-else @click="habilitarProductos(props.row)" color="positive">
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
import { useStoreProducto } from '../stores/productos';
const useProducto = useStoreProducto();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref('');
let nombre = ref('')
let valor = ref('')
let cantidad = ref('')
const fil = ref("")

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre del producto',
        align: 'center',
        field: 'nombre',
        sortable: true,
        format: (val) => {
            return val.charAt(0).toUpperCase() + val.slice(1);
        },
       
    },
    {
        name: 'codigo',
        required: true,
        label: 'Codigo Producto',
        align: 'center',
        field: 'codigo',
        sortable: true
    },
    {
        name: 'valor',
        required: true,
        label: 'Valor Producto',
        align: 'center',
        field: 'valor',
        sortable: true,
        format: (val) => {
            return val.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
    },
    {
        name: 'cantidad',
        required: true,
        label: 'Cantidad Producto',
        align: 'center',
        field: 'cantidad',
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

async function listarProductos() {
    const r = await useProducto.listarProductos();
    console.log(r.data.producto);
    rows.value = r.data.producto.reverse();
}

async function listarProductoActivo(){
    const r = await useProducto.listarProductoActivo();
    console.log(r.data.productos);
    rows.value = r.data.productos.reverse();

}

async function listarProductoInactivo(){
    const r = await useProducto.listarProductoInactivo();
    console.log(r.data.productos);
    rows.value = r.data.productos.reverse();

}

function validarProductos() {
    let validarnumeros = /^[0-9]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar agregar el nombre del producto");
    } else if (valor.value == "") {
        Notify.create("Se debe agregar agregar el valor del producto");
    } else if (!validarnumeros.test(valor.value)) {
        Notify.create("El valor del producto debe ser numerico");
    } else if (cantidad.value == "") {
        Notify.create("Se debe agregar agregar la cantidad del producto");
    } else if (!validarnumeros.test(cantidad.value)) {
        Notify.create("La cantidad del producto debe ser numerico");
    } else {
        agregarProductos()
        Notify.create({
            type: "positive",
            message: "Producto agregado exitosamente",
        });
    }
}

async function agregarProductos() {
    const r = await useProducto.postProducto({
        nombre: nombre.value,
        valor: valor.value,
        cantidad: cantidad.value

    })
    console.log(r);
    cerrar();
    limpiar();
    listarProductos()
}

async function habilitarProductos(producto) {
    const res = await useProducto.activarProducto(producto._id)
        .then((response) => {
            console.log(response);
            listarProductos();
        })

        .catch((error) => {
            console.error('Error de Producto:', error)
            Notify.create('Ocurrio un error al momento de verificarle codigo del producto')
        })
}

async function deshabilitarProductos(producto) {
    const res = await useProducto.desactivarProducto(producto._id)
        .then((response) => {
            console.log(response);
            listarProductos();
        })

        .catch((error) => {
            console.error('Error de Producto:', error)
            Notify.create('Ocurrio un error al momento de verificarle codigo del producto')
        })
}


function abrir() {
    alert.value = true;
    accion.value = 1;
}

function cerrar() {
    alert.value = false
}

function traerProducto(producto){
    alert.value= true;
    accion.value = 2;
    id.value = producto._id;
    nombre.value = producto.nombre;
    valor.value = producto.valor;
    cantidad.value = producto.cantidad;
}

function validarEdicionProductos(){
    let validarnumeros = /^[0-9]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar agregar el nombre del producto");
    } else if (valor.value == "" ) {
        Notify.create("Se debe agregar agregar el valor del producto");
    } else if (!validarnumeros.test(valor.value)) {
        Notify.create("El valor del producto debe ser numerico");
    } else if (cantidad.value == "") {
        Notify.create("Se debe agregar agregar la cantidad del producto");
    } else if (!validarnumeros.test(cantidad.value)) {
        Notify.create("La cantidad del producto debe ser numerico");
    } else {
        editarProductos()
        cerrar();
        limpiar();
        Notify.create({
            type: "positive",
            message: "Producto editado exitosamente",
        });
    }

}

async function editarProductos (){
    try{
        await useProducto.putProducto(id.value,{
            nombre: nombre.value,
            valor: valor.value,
            cantidad: cantidad.value
        })
        listarProductos()

    }catch(error){
        console.error('Error de Producto:', error)
        Notify.create('Ocurrio un error al momento de verificarle codigo del producto')
    }
}

function limpiar() {
    nombre.value = '';
    valor.value = '';
    cantidad.value = '';

}

onMounted(() => {
    listarProductos();
})

</script>

