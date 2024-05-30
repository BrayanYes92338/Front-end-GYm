<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Venta</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarVentasActivas()" >Listar Ventas Activas</q-btn>
            <q-btn color="green" class="q-my-md q-ml-md" @click="listarVentasInactivas()">Listar Ventas Inactivas</q-btn>
        </div>

        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Venta" : "Editar Venta" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idProducto" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona un producto">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="valorUnitario" type="tel" class="q-my-md q-mx-md" label="Valor Unitario"
                        placeholder="Valor Unitario" />
                    <q-input outlined v-model="cantidad" type="tel" class="q-my-md q-mx-md" label="Cantidad"
                        placeholder="Ingrese la cantidad del producto" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarVentas()" color="red" class="text-white"
                            :loading="useVenta.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1"  @click="validarEdicionVenta()" color="red" class="text-white" :loading="useVenta.loading">
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
            <q-table title="Ventas" title-class="text-red text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerVentas(props.row)"><i class="fas fa-pencil-alt"></i></q-btn>
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitar(props.row)" color="negative"><i class="fas fa-times"></i></q-btn>
                            <q-btn v-else  @click="habilitarVentas(props.row)" color="positive"><i class="fas fa-check"></i></q-btn>
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
import { useStoreVenta } from '../stores/ventas';
import { useStoreProducto } from '../stores/productos';

const useVenta = useStoreVenta();
const useProducto = useStoreProducto();

let rows = ref([]);
let id = ref('')
let alert = ref(false)
let accion = ref('')
let idProducto = ref('')
let valorUnitario = ref('')
let cantidad = ref('')

function abrir() {
    accion.value = 1
    alert.value = true
}

function cerrar() {
    alert.value = false
}

const columns = ref([
{
        name: 'idProducto',
        required: true,
        label: 'Nombre Producto',
        align: 'center',
        field: (row)=>row.idProducto.nombre,
        sortable: true
    },
    {
        name: 'fechaVenta',
        required: true,
        label: 'Fecha de Venta',
        align: 'center',
        field: 'fechaVenta',
        sortable: true,
        format: (val) => {
            const fecha = new Date(val);
            return fecha.toLocaleDateString();
        }
    },
    {
        name: 'codigo',
        required: true,
        label: 'Codigo de Venta',
        align: 'center',
        field: 'codigo',
        sortable: true
    },
    {
        name: 'valorUnitario',
        required: true,
        label: 'Valor Unitario',
        align: 'center',
        field: 'valorUnitario',
        sortable: true,
        format: (val) => {
            return val.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
    },
    {
        name: 'cantidad',
        required: true,
        label: 'Cantidad de Productos',
        align: 'center',
        field: 'cantidad',
        sortable: true
    },
    {
        name: 'total',
        required: true,
        label: 'Total',
        align: 'center',
        field: 'total',
        sortable: true,
        format: (val) => {

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

let productos = [];
let dates = {}
const options = ref(productos)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase()
        options.value = productos.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}

async function listarVentas() {
    const r = await useVenta.listarVentas()
    rows.value = r.data.venta.reverse()
    console.log(r.data.venta);
}

async function listarVentasActivas(){
    const r = await useVenta.ListarVentasActivo()
    rows.value = r.data.ventas.reverse()
    console.log(r.data.ventas);

}
async function listarVentasInactivas(){
    const r = await useVenta.ListarVentasInactivo()
    rows.value = r.data.ventas.reverse()
    console.log(r.data.ventas);
}

async function listarProductos() {
    const data = await useProducto.listarProductos()
    data.data.producto.forEach(item => {
        dates = {
            label: item.codigo,
            value: item._id
        }
        productos.push(dates)
    })
    console.log(productos);
}

function validarVentas() {
    let validarNumeros = /^[0-9]+$/;
    if (idProducto.value == "") {
        Notify.create("Se debe agregar un ID del producto")
    } else if (valorUnitario.value == "") {
        Notify.create("Se debe agregar un valor unitario")
    } else if (cantidad.value == "") {
        Notify.create("Se debe agregar una cantidad")
    } else if (!validarNumeros.test(valorUnitario.value)) {
        Notify.create("El valor unitario debe ser un número")
    } else if (!validarNumeros.test(cantidad.value)) {
        Notify.create("La cantidad debe ser un número")
    } else {
        agregarVentas()
            limpiar()
            cerrar()
            Notify.create({
                type: "positive",
                message: "Venta agregada exitosamente",
            })
    }
}

async function agregarVentas() {
    const r = await useVenta.postVenta({
        idProducto: idProducto.value.value,
        valorUnitario: valorUnitario.value,
        cantidad: cantidad.value
    })
    listarVentas()
    cerrar()
    console.log(r);
}

async function habilitarVentas(venta){
const res = await useVenta.putActivarVenta(venta._id)
.then((response)=>{
    console.log(response);
    listarVentas()
})

.catch((error)=>{
    console.log('Error de Venta', error);
    Notify.create("Ocurrio un eror al verificar la venta") 
})
}

async function deshabilitar(venta){
    const res = await useVenta.putDesactivarVenta(venta._id)
    .then((response)=>{
        console.log(response);
        listarVentas()
    })
    
    .catch((error)=>{
        console.log('Error de Venta', error);
        Notify.create("Ocurrio un eror al verificar la venta") 
    })

}

function traerVentas(venta){
    id.value = venta._id
    valorUnitario.value = venta.valorUnitario
    cantidad.value = venta.cantidad
    accion.value = 2
    alert.value = true
    idProducto.value = {
    label:venta.idProducto.nombre,
    value: venta.idProducto._id
  }
}

function validarEdicionVenta(){
    let validarNumeros = /^[0-9]+$/;
    if (idProducto.value == "") {
        Notify.create("Se debe agregar un ID del producto")
    } else if (valorUnitario.value == "") {
        Notify.create("Se debe agregar un valor unitario")
    } else if (cantidad.value == "") {
        Notify.create("Se debe agregar una cantidad")
    } else if (!validarNumeros.test(valorUnitario.value)) {
        Notify.create("El valor unitario debe ser un número")
    } else if (!validarNumeros.test(cantidad.value)) {
        Notify.create("La cantidad debe ser un número")
    } else {
     editarVentas()
     cerrar()
        limpiar()

            Notify.create({
                type: "positive",
                message: "Venta editada exitosamente",
            })
    }

}

async function editarVentas(){
    try{
        await useVenta.putVenta(id.value,{
            idProducto: idProducto.value.value,
            valorUnitario: valorUnitario.value,
            cantidad: cantidad.value
        })
        listarVentas()

    }catch (error){
        console.log('Error al editar la venta', error);
        Notify.create("Ocurrio un error al editar la venta")
    }
}

function limpiar() {
    idProducto.value = ''
    valorUnitario.value = ''
    cantidad.value = ''

}

onMounted(() => {
    listarVentas()
    listarProductos()

})


</script>