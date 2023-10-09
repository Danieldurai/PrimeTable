<template>
    <div id="product-detail-styles">
        <div class="grid grid-nogutters ">
            <div v-if="product" class="product-container lg:col-8">
                <h2>{{ product.title }}</h2>
                <div class="image-container lg:col-5">
                    <img :src="product.image">
                </div>
                <div>
                    <h3>price:{{ product.price }}</h3>
                    <h3>Description</h3>
                    <p>{{ product.description }}</p>
                </div>
            </div>
            <div v-else>/
                <p>Product not found</p>
            </div>
        </div>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        product: null
      };
    },

    created(){
        this.$store.state.products.forEach((product)=>{
            if(product.id == this.$route.params.id){
                this.product = product
            }
        })      
    }
   
  };
  </script>
  