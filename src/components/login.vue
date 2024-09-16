<template>
    <div class="contenedor1">
        <div class="image-container">
            <img src="../img/fondo1.jpg" alt="Imagen de fondo">
        </div>
        <div class="wrapper">
            <div class="from-box login text-center" >
                <img src="../img/Logo.png" alt="" class="logo1">
                <h2>INGRESAR</h2>
                <q-form @submit="login2">

                    <q-input class="q-mt-sm" outlined v-model="email" label="Correo electronico" lazy-rules
                         :rules="[val => val && val.length > 0 || 'Porfavor ingresa tu correo']">
                    </q-input>
                    <q-input outlined class="q-mt-md" v-model="passwordLogin" label="Contraseña"
                         :type="isPwd ? 'password' : 'text'" :rules="[
                         val => val !== null && val !== '' || 'Por favor ingresa tu contraseña'
                          ]">
                         <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                         </template>
                     </q-input>
                     <div class="remember-forgot">
                        <div class="q-pa-md q-gutter-sm">
                            <q-dialog v-model="dialog" persistent transition-show="slide-up" transition-hide="slide-down">
                                <q-card class="custom-modal-bg" style="width: 1100px;">
                                    <q-bar>
                                        <q-space />
                                        <q-btn dense flat icon="close" @click="cerrar">
                                            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
                                        </q-btn>
                                    </q-bar>

                                    <q-card-section>
                                        <div class="text-h6">INGRESE CORREO</div>
                                    </q-card-section>
                                    <q-card-section class="q-pt-none">
                                        <p>Por favor ingresar el Correo Electronico para iniciar el proceso de cambio de
                                            contraseña.</p>
                                        <q-input class="q-mt-sm" outlined v-model="correo" label="Correo electronico"
                                            lazy-rules
                                            :rules="[val => val && val.length > 0 || 'Por favor ingresa tu correo']">
                                        </q-input>
                                        <button class="btn" @click="usuarioPutPassword()">Enviar</button>
                                    </q-card-section>
                                </q-card>
                            </q-dialog>
                        </div>
                    </div>
                    <button class="btn" type="submit">Ingresar</button>
                </q-form>
                <button @click="dialog = true"><a>¿Olvidaste tu contraseña?</a></button>
            </div>

        </div>
    </div>    
</template>


<script setup>
import { ref } from 'vue';
import { useUsuarioStore } from '../stores/usuarios';
import { useRouter } from "vue-router";
import { Notify } from 'quasar';
const router = useRouter();
let useUsuario = useUsuarioStore()
let email = ref("");
let correo = ref("");
let passwordLogin = ref("")
let isPwd = ref(true);
const dialog = ref(false);
const maximizedToggle = ref(false);


function cerrar() {
    dialog.value = false;
}




async function login2() {
    try {
        const res = await useUsuario.login({
            correo: email.value,
            password: passwordLogin.value
        })
        useUsuario.token = res.data.token;
        useUsuario.user=res.data.usuario
        console.log(res);

        router.push('/menu');
    } catch (error) {
        console.log(error);
    }
}

async function usuarioPutPassword() {
    try {
        if (!correo.value) {
            Notify.create({
                message: "Por favor ingrese un correo",
                position: "top",
                color: 'red',
                timeout: 4000
            });
        } else {  
            const res = await useUsuario.usuarioGetEmail(correo.value);
            if (res.data.usuario) {
                const ress = await useUsuario.enviarEmail(correo.value);
                console.log(ress);
                
                Notify.create({
                    message: "El correo ha sido enviado exitosamente",
                    position: "top",
                    color: 'green',
                    timeout: 4000
                });
                dialog.value = false;
                limpiar();
            } else {
                Notify.create({
                    message: "El correo no es válido",
                    position: "top",
                    color: 'red',
                    timeout: 4000
                });
            }

        
        }
    } catch (error) {
        console.log(error);
    }
}

function limpiar(){
    correo.value = "";
}


</script>

<style>
.logo1 {
    width: 150px;
    height: 150px;
}

.contenedor1 {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    height: 100vh;
    background: #feffff;
}

.custom-modal-bg {
    background-color: white;
    color: black;

}

a{
    color: #162938;
    text-decoration: none;
}
.remember {
    font-size: 15px;
    margin-top: 18px;
}

.image-container {
    width: 80%;
    height: 100%;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.wrapper {
    position: relative;
    width: 20%;
    height: 100%;
    background: white;
    border: solid 2px rgba(255, 255, 255, .5);
    backdrop-filter: blur(20px);
    box-shadow: 0 0 30px rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;

}

.wrapper .from-box {
    width: 100%;
    padding: 40px;
}


.wrapper .from-box.register {
    position: relative
}


.from-box h2 {
    font-size: 2em;
    color: #162938;
    text-align: center;
}

.input-box {
    position: relative;
    width: 100%;
    height: 50px;
    border-bottom: 2px solid #162938;
    margin: 30px 0;
}

.input-box label {
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    font-size: 1em;
    color: #162938;
    font-weight: 500;
    pointer-events: none;
    transition: .5s;
}

.input-box input:focus~label,
.input-box input:valid~label {
    top: -5px;

}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #162938;
    font-size: 1em;
    font-weight: 600;
    padding: 0 35px 0 5px;
}

.input-box .icon {
    position: absolute;
    right: 8px;
    font-size: 1.2em;
    color: #162938;
    line-height: 57px;
}

.remember-forgot {
    font-size: .9em;
    color: #162938;
    font-weight: 500;
    margin: -15px 0 15px;
    display: flex;
    justify-content: space-between;
}

.remember-forgot label input {
    color: #162938;
    margin-right: 3px;
}

.remember-forgot a {
    color: #162938;
    text-decoration: none;
}

.remember-forgot a:hover {
    text-decoration: underline;
}

.btn {
    width: 100%;
    height: 45px;
    background: #162938;
    border: none;
    outline: none;
    border-radius: 6px;
    cursor: pointer;
    color: #fff;
    font-size: 1em;
    font-weight: 500;
    margin: 20px 0;
}

.login-register {
    font-size: .9em;
    color: #162938;
    font-weight: 500;
    text-align: center;
    margin: 25px 0 10px;
}

.login-register p a {
    color: #162938;
    text-decoration: none;

}

.login-register p a:hover {
    text-decoration: underline;
}
</style>