<template>
    <div class="cuerpo">
        <div class="formulario" v-if="modal1" >
           <q-form @submit="cambiar" class="form">  <!-- @submit="" -->
                <div class="candado"><i class="fas fa-lock"></i></div>
                <h3 class="titulo">Cambio de contraseña</h3>
                <div class="input-group">
                    <q-label class="label">Ingrese nueva contraseña:</q-label>
                <q-input outlined class="q-mt-md" v-model="passwordLogin" label="Contraseña"
                    :type="isPwd ? 'password' : 'text'" :rules="[
                        val => val !== null && val !== '' || 'Por favor ingresa una nueva contraseña'
                    ]">
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                    </template>
                </q-input>
                <q-label class="label">Confirme nueva contraseña:</q-label>
                <q-input outlined class="q-mt-md" v-model="passwordLogin2" label="Contraseña"
                    :type="isPwd2 ? 'password' : 'text'" :rules="[
                        val => val !== null && val !== '' || 'Por favor ingresa una nueva contraseña'
                    ]">
                    <template v-slot:append>
                        <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd2 = !isPwd2" />
                    </template>
                </q-input>
            </div>
                <button class="btn"  type="submit">Cambiar Contraseña</button>

            </q-form>
        </div>
        <div class="carta" v-if="modal2">
            <q-card class="q-mt-md " style="width: 650px; background-color: #a5f3bc; color:black">
                <q-card-section>
                    <div class="visto"><i class="fas fa-check vis"></i></div>
                    <q-card-title class="text-h4">Cambio de contraseña</q-card-title>
                    <q-card-text>
                        <p class="titulo-carta">¡Tu contraseña ha sido cambiada con éxito! Por favor, cierra esta ventana y vuelve al inicio.</p>

                    </q-card-text>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup>
import { Notify } from 'quasar';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUsuarioStore } from '../stores/usuarios';
let useUsuario = useUsuarioStore()
const route = useRoute()
const correo = ref(route.query.correo)
const modal1 = ref(true);
const modal2 = ref(false);
console.log(correo.value);

if(!correo.value || correo.value === undefined){
    Notify.create("No tiene permisos")
    route.push("/")
}

let passwordLogin = ref("")
let passwordLogin2 = ref("")
let isPwd = ref(true);
let isPwd2 = ref(true);


function cambiar() {
    if(passwordLogin.value === passwordLogin2.value){
        const res = useUsuario.usuarioPutPassword(correo.value,passwordLogin.value)
        console.log(res);
        modal1.value = false;
        modal2.value = true;
    }else{
        Notify.create("Las contraseñas no coinciden")
    }
}

</script>

<style>
.cuerpo{
        height: 120vh;
        display: grid;
        place-items: center;
}

.candado{
    font-size: 100px;
    color: #999999;

}

.titulo{
     color: #999999;
     font-size: 45px;
}

.formulario {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;


}

.label{
    color: #3D3D3D;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 15px;
}


.form {
    padding: 40px 40px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    text-align: center;
    width: 450px;
    background-color: white;
}

.input-group {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-top: 24px;
}

</style>