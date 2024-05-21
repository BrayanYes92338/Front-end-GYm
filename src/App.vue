<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white colorheader">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <p class="rol-user">Rol Usuario</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered class="side-bar scrolling-sidebar">
      <header class=header>
        <img src="../img/user.jpg" alt="" class="perfil-prueba">
        <p class="name-user">Nombre Usuario</p>
      </header>
      <div class="menu">
        <div class="item"> <router-link class="item opciones" to="/home"><i class="fas fa-tachometer-alt"></i>
            Home</router-link>
        </div>
        <div class="item"> <router-link class="opciones" to="/usuario"><i class="fas fa-user"></i>Usuario</router-link>
        <div class="item"> <router-link class="opciones" to="/sede"><i
              class="fas fa-map-marker-alt"></i>Sede</router-link></div>
        </div>
        <div class="item"> <router-link class="opciones" to="/ingresos"><i
              class="fas fa-clipboard-check"></i>Ingresos</router-link></div>
      
        <div class="item">
          <a class="opciones sub" href="#" @click.prevent="toggleSubMenu('entrenador')">
            <i class="fas fa-dumbbell"></i>Entrenador
            <i v-if="subMenus.entrenador" class="fas fa-angle-down dropdown"></i>
            <i v-else class="fas fa-angle-right dropdown"></i>
          </a>
          <div class="sub-menu" v-show="subMenus.entrenador">
            <div class="sub-item"> <router-link class="opciones" to="/clientes"><i
                  class="fas fa-user"></i>Cliente</router-link></div>
          </div>
        </div>
        <div class="item">
          <a class="opciones sub" href="#" @click.prevent="toggleSubMenu('mercancia')">
            <i class="fas fa-box-open"></i>Mercancia
            <i v-if="subMenus.mercancia" class="fas fa-angle-down dropdown"></i>
            <i v-else class="fas fa-angle-right dropdown"></i>
          </a>
          <div class="sub-menu" v-show="subMenus.mercancia">
            <div class="sub-item"> <router-link class="opciones" to="/productos"><i
                  class="fas fa-shopping-basket"></i>Productos</router-link></div>
          </div>
          <div class="sub-menu" v-show="subMenus.mercancia">
            <div class="sub-item"> <router-link class="opciones" to="/ventas"><i
                  class="fas fa-money-bill-wave"></i>Ventas</router-link></div>
          </div>

        </div>
        <div class="item">
          <a class="opciones sub" href="#" @click.prevent="toggleSubMenu('suscripcion')">
            <i class="fas fa-tags"></i>Suscripción
            <i v-if="subMenus.suscripcion" class="fas fa-angle-down dropdown"></i>
            <i v-else class="fas fa-angle-right dropdown"></i>
          </a>
          <div class="sub-menu" v-show="subMenus.suscripcion">
          <div class="sub-item"> <router-link class="opciones" to="/planes"><i
              class="far fa-calendar-alt"></i>Planes</router-link></div>
          </div>
          <div class="sub-menu" v-show="subMenus.suscripcion">
            <div class="sub-item"> <router-link class="opciones" to="/pagos"><i
                  class="fas fa-dollar-sign"></i>Pagos</router-link></div>
          </div>

        </div>
        <div class="item">
          <a class="opciones" href="#" @click.prevent="toggleSubMenu('equipos')">
            <i class="fas fa-weight-hanging"></i>Equipos
            <i v-if="subMenus.equipos" class="fas fa-angle-down dropdown"></i>
            <i v-else class="fas fa-angle-right dropdown"></i>
          </a>
          <div class="sub-menu" v-show="subMenus.equipos">
            <div class="sub-item"> <router-link class="opciones" to="/maquina"><i
                  class="fas fa-biking"></i>Maquinas</router-link></div>
            <div class="sub-item"> <router-link class="opciones" to="/mantenimiento"><i
                  class="fas fa-wrench"></i>Mantenimientos</router-link></div>
          </div>
        </div>

      </div>
      <div class="btn-cerrar">
        <button class="cerrar-sesion"> <i class="fa fa-sign-out-alt "></i> Cerrar Sesion</button>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white colorfooter">
      <q-toolbar>
        <q-toolbar-title class="titulo-footer">
          <p>Copyright © 2024. Todos los derechos reservados.</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import './style.css';
import { useUsuarioStore } from './stores/usuarios';
let useUsuario = useUsuarioStore()


const leftDrawerOpen = ref(false)

const subMenus = ref({
  entrenador: false,
  equipos: false,
  mercancia: false,
  suscripcion: false
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const toggleSubMenu = (menu) => {
  subMenus.value[menu] = !subMenus.value[menu]
}

</script>
