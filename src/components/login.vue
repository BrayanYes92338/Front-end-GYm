<template>
    <div class="contenedor1">
        <div class="image-container">
            <img src="../img/fondo1.jpg" alt="Imagen de fondo">
        </div>
        <div class="wrapper">
            <div class="from-box login " >
                <img src="../img/Logo.png" alt="" class="logo1">
                <h2>INGRESAR</h2>
                <form action="#">

                    <div class="input-box">
                        <span class="icon"><i class="fas fa-envelope"></i></span>
                        <input type="text" v-model="email">
                        <label for="">Correo</label>
                    </div>
                    <div class="input-box">
                        <span class="icon"><i class="fas fa-lock"></i></span>
                        <input type="password" v-model="passwordLogin">
                        <label for="">Contraseña</label>
                    </div>
                    <button  class=btn @click="login2()">Ingresar</button>
                   
                </form>
            </div>

        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useUsuarioStore } from '../stores/usuarios';
import { useRouter } from "vue-router";
const router = useRouter();
let useUsuario = useUsuarioStore()
let email = ref("");
let passwordLogin = ref("")



async function login2() {
    try {
        const res = await useUsuario.login({
            correo: email.value,
            password: passwordLogin.value
        })
        useUsuario.token = res.data.token;
        useUsuario.user=res.data.usuario
        console.log(res);

        router.push('/home');
    } catch (error) {
        console.log(error);
    }
}


</script>

<style>
.logo1 {
    width: 230px;
    height: 230px;
    margin-left: 40px;
}

.contenedor1 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    height: 100vh;
    background: #feffff;
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