<template>
    <q-layout view="hHh lpR fFf">

<q-header class="bg-primary text-white colorheader">
  <q-toolbar>
    <q-btn v-if="useUsuario.token" dense flat round icon="menu" @click="toggleLeftDrawer" />
    <q-toolbar-title>
      <p class="rol-user">{{ usuario.rol }}</p>
    </q-toolbar-title>
  </q-toolbar>
</q-header>

<q-drawer v-if="useUsuario.token" v-model="leftDrawerOpen" side="left" overlay bordered class="side-bar scrolling-sidebar">
  <header class=header>
    <img src="../img/user.jpg" alt="" class="perfil-prueba">
    <p class="name-user">{{ usuario.nombre }}</p>
  </header>
  <div class="menu">
    <div class="item"> <router-link class="item opciones" to="/menu"><i class="fas fa-tachometer-alt"></i>
        Home</router-link>
    </div>
    <div v-if="usuario.rol ==='ADMIN'" class="item"> <router-link class="opciones" to="/usuario"><i class="fas fa-user"></i>Usuario</router-link>
    <div v-if="usuario.rol !== 'ENTRENADOR'" class="item"> <router-link class="opciones" to="/sede"><i
          class="fas fa-map-marker-alt"></i>Sede</router-link></div>
    </div>
    <div v-if="usuario.rol !== 'ENTRENADOR'" class="item"> <router-link class="opciones" to="/ingresos"><i
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
    <div v-if="usuario.rol !== 'ENTRENADOR'" class="item">
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
    <div v-if="usuario.rol !== 'ENTRENADOR'" class="item">
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
    <div v-if="usuario.rol !== 'RECEPCION'" class="item">
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
    <button class="cerrar-sesion"  @click="singOut()"> <i class="fa fa-sign-out-alt "></i> Cerrar Sesion</button>
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
import { ref, onMounted } from 'vue'
import { useUsuarioStore } from '../stores/usuarios';
import { useRouter } from "vue-router";
const router = useRouter();

let useUsuario = useUsuarioStore()

let usuario = useUsuario.user


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

const singOut = () =>{
  useUsuario.user = {}
  useUsuario.token = ''
  router.push('/');
}

</script>

<style scoped>
.colorheader{
  background-color: #a1312d !important;
}

.colorfooter{
  background-color: #211F25 !important;
}

.titulo-footer{
  font-size: 15px;
  text-align: right;
}

.side-bar{
  position: relative;
 
}

.rol-user{
  margin-top: 15px;
}

.header{
 background: #33363a; 
 width: 100%;
 height: 190px;
}

header img{
  width: 100%;
  margin: 15px;
  margin-left: 110px;
  border-radius: 50%;
}

.perfil-prueba{
  height: 100px;
  width: 100px;
}

.menu{
  width: 100%;
  margin-top: 20px;
}

.menu .item{
  position: relative;
  cursor: pointer;

}

.menu .item .opciones {
  color: #211F25;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  display: block;
  padding: 4px 15px;
  line-height: 60px;
}

.item i{
  margin-right: 8px;
}

.item a .dropdown{
  position: absolute;
  right: 0;
  margin: 20px;
  transition: 0.3 ease;
}

.item .sub-menu{
  background: #F0F0F0;
}



.name-user{
  color: white;
  font-size: 15px;
  text-align: center;
  font-weight: bold;
margin-left: 34px;
}

.btn-cerrar{
margin-top: 160px;
text-align: center;
}

.cerrar-sesion {
  color: white;
  border: none;
  background: #DC0000;
  width: 250px;
  height: 50px;
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;
}

</style>