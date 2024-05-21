<template>
    <child-component>
      <template v-slot:header>
        <h1>Este es el encabezado</h1>
      </template>
  
      <p>Este es el contenido principal.</p>
  
      <template v-slot:footer>
        <p>Este es el pie de página</p>
      </template>
    </child-component>
  </template>