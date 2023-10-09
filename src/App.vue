<template>
  <div id="app">
       
      <router-view></router-view>  
  </div>
</template>

<script>
import axios from 'axios';
export default {
  
  name: 'App',
  data() {
    return {
      
    };
  },

  created(){
      
    axios.get('https://fakestoreapi.com/products').then((res)=>{
                
       this.$store.commit('SET_DATA', res.data)
       let temp = this.$store.state.products
    let huge = []
    for(let i = 0; i<20; i++){
      huge = huge.concat(temp)
    }
    console.log(huge, "APP")
    this.$store.commit("SET_HUGE", huge)
               
    })
    
  },
  
  components: {
  
  },

  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
