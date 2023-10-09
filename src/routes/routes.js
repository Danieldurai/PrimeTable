import ProductDetail from '../components/ProductDetail.vue'
import CrudComponent from '../components/CrudComponent.vue'

export default [


    { path: '/', component: CrudComponent},
    { path: '/products/:id', component: ProductDetail },

]