import { createRouter, createWebHashHistory } from "vue-router"
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
import { useUsuarioStore } from '../stores/usuarios';
import Menu from "../components/menu.vue"
import Actualizar from "../components/actualizar.vue"
import notfound from "../components/notfound.vue"


const auth = (to, from, next) => {
    if (checkAuth()) {
        const userUsuario = useUsuarioStore()
        const rol = userUsuario.user.rol
        console.log(rol);
        if (!to.meta.rol.includes(rol)) {
            return next({ name: 'login' })
        }
        next()
    } else {
        return next({ name: 'login' })
    }
}

const checkAuth = () => {
    const useUsuario = useUsuarioStore()
    const token = useUsuario.token
    console.log(token);
    if (!token) return false
    return true
};

const routes = [

    {
        path: "/",name:"login", component: Login
    },
    {
        path: "/:pathMatch(.)", // esto es para el 404
        name: "NotFound",
        component: notfound,
      },
            {
        path: "/home", component: Home, children: [
            { path: "/menu", component: Menu },
            { path: "/sede", component: Sede},
            { path: "/clientes", component: clientes },
            { path: "/maquina", component: Maquina },
            { path: "/mantenimiento", component: Mantenimiento },
            { path: "/ingresos", component: Ingresos },
            { path: "/planes", component: Planes },
            { path: "/productos", component: Productos },
            { path: "/ventas", component: Ventas },
            { path: "/pagos", component: Pagos },
            { path: "/usuario", component: Usuario },
            { path: "/actualizar", component: Actualizar},
        ]
    },


];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})