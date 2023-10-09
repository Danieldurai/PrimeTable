import Vue from 'vue'
import Vuex from 'vuex'



Vue.use(Vuex)

const store = new Vuex.Store({

    state:{
        products : null, //Contains 20 products
        hugeList : null  //Contains a hugelist of products
    },


    mutations:{

        //Initializing the product state
        SET_DATA(state, payload){
            state.products = payload
        },

        //Initializing the hugeList state
        SET_HUGE(state, payload){
          state.hugeList = payload
       }, 

       //Adding a new entry to product state
        ADD_DATA(state, payload){
            state.products.push(payload)
        },

        //Deleting an entry from products state
        DELETE(state, payload){
            state.products = state.products.filter(val => val.id !== payload);
        },
        
        //Deleting multiple entries from products state
        DELETE_MULTIPLE(state, payload){
            state.products = state.products.filter(val => !payload.includes(val))
        },

        //Modifying product state data by getting input from user
        MODIFY_DATA(state, payload){
            state.products.forEach(product => {
                if(product.id == payload.id){
                    product.title = payload.title
                    product.description = payload.description
                    product.price = payload.price
                    product.category = payload.category
                    product.rating.count = payload.count
                }
            });
        }
    },

    getters:{
        //Getting data from products state
        shopProducts(state){
            return state.products
        }        
    }
   
})

export default store