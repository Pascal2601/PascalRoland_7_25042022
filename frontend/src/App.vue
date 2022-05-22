<template>
  <div id="nav">
    <router-link to="/"
      ><img
        id="nav_groupomania"
        src="../image/icon-left-font-monochrome-white.svg"
        alt="lien acceuil"
    /></router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
body {
  margin: 0;
  background-color: #f0f2f5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
  box-sizing: border-box;
}

#nav {
  padding: 30px;
  background-color: #091f43;
  &_groupomania {
    width: 200px;
  }
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #d1515a;
    }
  }
}
</style>
