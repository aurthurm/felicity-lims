<template>
  <footer 
    id="mainFooter" 
    class="col-span-12 bg-card border-t border-border text-center text-card-foreground py-4 px-6"
    role="contentinfo"
    aria-label="Site footer"
  >
    <div class="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
      <span class="text-sm">Copyright © {{ new Date().getFullYear() }} Felicity LIMS</span>
      <span class="hidden sm:inline text-muted-foreground">|</span>
      <router-link 
        to="/about" 
        class="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
        aria-label="About Felicity LIMS"
      >
        About
      </router-link>
    </div>
  </footer>
</template>

<style scoped>
#mainFooter {
  position: fixed;
  margin: 0 auto;
  width: 100%;
  bottom: 0;
  z-index: 10;
}
</style>