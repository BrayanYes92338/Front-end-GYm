import {createRouter, createWebHashHistory} from "vue-router"
import Login from '../components/login.vue'
import Usuario from "../components/usuarios.vue"
import Home from '../components/home.vue'
import Sede from '../components/sede.vue'
import clientes from "../components/clientes.vue"
import Maquina from "../components/maquina.vue"
import Mantenimiento from "../components/mantenimiento.vue"
import Ingresos from '../components/ingresos.vue'
import Planes from '../components/planes.vue'
import Productos from '../components/productos.vue'
import Ventas from '../components/ventas.vue'
import Pagos from '../components/pagos.vue'

const routes = [

    { path: "/", component: Login },
    { path: "/home", component: Home },
    { path: "/sede", component: Sede },
    { path: "/clientes", component: clientes },
    { path: "/maquina", component: Maquina },
    { path: "/mantenimiento", component: Mantenimiento },
    {path: "/ingresos", component:Ingresos },
    {path: "/planes", component:Planes },
    {path: "/productos", component:Productos },
    {path: "/ventas", component:Ventas },
    {path: "/pagos", component:Pagos },
    { path: "/usuario", component: Usuario }

    
];

export const  router = createRouter({
    history:createWebHashHistory(),
    routes
})