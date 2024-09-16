<template>
   <q-page class="flex flex-center">
        <div class="row" style="width: 100%;">
            <div v-if="usuario.rol ==='ADMIN'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Creación, activación y edición de Usuarios</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/user.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label=" Visitar Usuarios" to="/usuario"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !== 'ENTRENADOR'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card  class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Creación, activación y edición de Sedes</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/sede.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Sedes" to="/sede"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !== 'ENTRENADOR'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Visualización y agregación de los ingresos</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/ingresos.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Ingresos" to="/ingresos"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Creación y seguimiento de clientes</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/cliente.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Clientes" to="/clientes"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !== 'ENTRENADOR'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Visualización y Gestión del Inventario</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/productos.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Productos" to="/productos"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !== 'ENTRENADOR'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Visualización y Gestión de Ventas</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/ventas.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Ventas" to="/ventas"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !== 'ENTRENADOR'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Visualización y Gestión de Planes</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/planes.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Planes" to="/planes"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !== 'ENTRENADOR'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Renovación y gestión de Pagos</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/pagos.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Pagos" to="/pagos"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !=='RECEPCION'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Visualización y Gestión de Maquinas</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/maquinas.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Maquinas" to="/maquina"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="usuario.rol !=='RECEPCION'" class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
                    <q-card-section horizontal>
                        <q-card-section style="width: 60%;">
                            <div class="text-h5 q-mt-sm q-mb-xs">Solicitud y Gestión de Mantenimientos</div>
                        </q-card-section>
                        <q-card-section class="col-5 text-right">
                            <q-avatar size="120px" class="bg-white">
                                <img src="../assets/mantenimiento.gif">
                            </q-avatar>
                        </q-card-section>
                    </q-card-section>
                    <q-card-section horizontal>
                        <q-btn outline rounded icon="reply" color="white" label="Visitar Mantenimientos" to="/mantenimiento"></q-btn>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUsuarioStore } from "../stores/usuarios";
import { useRouter } from "vue-router";
const router = useRouter();

let useUsuario = useUsuarioStore();

let usuario = useUsuario.user;

</script>

<style>
.bg-my-custom-red {
  background-color: #4d4d4d !important;
}
</style>

