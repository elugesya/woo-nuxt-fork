<template>
  <div class="p-10">
    <h1>Image Test</h1>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <h3>Direct Access (No IPX)</h3>
        <img src="/images/showcase/rib-boat.png" class="w-full" />
      </div>
      <div>
        <h3>NuxtImg (IPX)</h3>
        <NuxtImg src="/images/showcase/rib-boat.png" class="w-full" />
      </div>
    </div>
  </div>
</template>
