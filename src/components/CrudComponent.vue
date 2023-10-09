<template>
    <div id="crud-styles">
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                    <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="shopProducts" :selection.sync="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,20, 800]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
            <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justify-content-between">
                        <h5 class="mb-2 md:m-0 md:align-self-center">Manage Products</h5>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                    </div>
                </template>
                <Column selectionMode="multiple"  :exportable="false"></Column>
                <Column field="id" header="ID" :sortable="true"></Column>
                <Column field="title" header="Title" :sortable="true"></Column>
                <Column header="Image" :exportable="false">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image"  alt="Image" class="product-image" />
                    </template>
                </Column>
                 <Column field="rating" header="Reviews" class="rating-column" :sortable="true">
                    <template #body="slotProps">
                        <Rating :value="slotProps.data.rating.rate" :readonly="true" :cancel="false" />
                    </template>
                </Column>
                <Column field="price" header="Price" :sortable="true">
                    <template #body="slotProps">
                        {{formatCurrency(slotProps.data.price)}}
                    </template>
                </Column>
                <Column field="category" header="Category" :sortable="true"></Column>
                <Column :exportable="false" header="Actions" :styles="{'min-width':'12rem'}">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mr-2" @click="confirmDeleteProduct(slotProps.data)" />
                        <Button icon="pi pi-info-circle" class="p-button-rounded p-button-info" @click="showInfo(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
             
        </div>
        <Dialog :visible.sync="productDialog"  header="Product Details" :modal="true" class="p-fluid">
                <img :src="product.image" :alt="product.image" class="product-image" v-if="product.image" />
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="product.title" required="true" autofocus :class="{'p-invalid': submitted && !product.title}" />
                    <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                </div>                
                <div class="field">
                    <label for="description">Description</label>
                    <TextArea id="description" v-model="product.description" required="true" rows="3" cols="50" />
                </div>
                <div class="field">
                    <label class="mb-3">Category</label>
                    <div class="formgrid grid">
                        <div class="field-radiobutton col-6">
                            <RadioButton id="category1" name="category" value="men's clothing" v-model="product.category" />
                            <label for="category1">Men's Clothing</label>
                        </div>
                        <div class="field-radiobutton col-6">
                            <RadioButton id="category2" name="category" value="jewelery" v-model="product.category" />
                            <label for="category2">Jewelery</label>
                        </div>
                        <div class="field-radiobutton col-6">
                            <RadioButton id="category3" name="category" value="electronics" v-model="product.category" />
                            <label for="category3">Electronics</label>
                        </div>
                        <div class="field-radiobutton col-6">
                            <RadioButton id="category4" name="category" value="women's clothing" v-model="product.category" />
                            <label for="category4">Women's Clothing</label>
                        </div>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="price">Price</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div class="field col">
                        <label for="quantity">Quantity</label>
                        <InputNumber id="quantity" v-model="quantity" integeronly />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                </template>
        </Dialog>
        <Dialog :visible.sync="deleteProductDialog"  header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3"  />
                <span v-if="product">Are you sure you want to delete <b>{{product.title}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
            </template>
        </Dialog>
         <Dialog :visible.sync="deleteProductsDialog"  header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3"  />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>

<script>
    import DataTable from 'primevue/datatable'
    import Toolbar from 'primevue/toolbar'
    import Button from 'primevue/button'
    import  FileUpload from 'primevue/fileupload'
    import {FilterMatchMode} from 'primevue/api'
    import Column from 'primevue/column'
    import Rating from 'primevue/rating'
    import InputText from 'primevue/inputtext'
    import Dialog from 'primevue/dialog'
    import RadioButton from 'primevue/radiobutton'
    import InputNumber from 'primevue/inputnumber'
    import TextArea from 'primevue/textarea'
    import { mapGetters } from 'vuex';
    export default{
        name:"crudComponent",
        data() {
            return {

                productDialog: false,   //Visibility of product dialog box
                deleteProductDialog: false, //Visibility of single product delete dialog box
                deleteProductsDialog: false, //Visibility of multiple product delete dialog box
                product: {},    //Initializing product data for providing data to dialog boxes
                quantity: 0,    //Initializing quantity data property seperately where the v-model doesn't support nested objects
                selectedProducts: null, //Contains all the selected products
                //Searching based on filters
                filters: {
                    'global':{value:null, matchMode: FilterMatchMode.CONTAINS}
                },
                submitted: false, //monitors the form submission
            }
        },
        
        components:{
            DataTable,
            Toolbar,
            Button,
            FileUpload,
            Column,
            Rating,
            InputText,
            Dialog,
            RadioButton,
            InputNumber,
            TextArea
        },
        computed:{
            ...mapGetters(['shopProducts'])
        },
       

        methods:{
            //route to a seperate page when clicking
            showInfo(value){
                this.$router.push({ path: `/products/${value.id}`, params: value });
            },

            //formats the currency
            formatCurrency(value) {
                if(value)
                    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                return;
            },

            //Used to create new product in the list
            openNew() {
                this.product = {};
                this.submitted = false;
                this.productDialog = true;
            },

            //Used to hide the dialog box
            hideDialog() {
                this.productDialog = false;
                this.submitted = false;
            },

            //Used to save the newly created product as well as the modified existing product
            saveProduct() {
                this.submitted = true;

                if (this.product.title) {
                    if (this.product.id) {
                       this.$store.commit('MODIFY_DATA', {...this.product, count: this.quantity})
                    }
                    else {
                        this.product.id = this.createId();
                        this.product.image = 'product-placeholder.svg';
                        this.product.rating = 4;
                        this.$store.commit('ADD_DATA', {...this.product, count: this.quantity})
                    }

                    this.productDialog = false;
                    this.product = {};
                    this.quantity = 0;
                }
            },

            //Used to edit the particular product details
            editProduct(product) {
                this.product = {...product};
                console.log(typeof(product.rating.count))
                this.quantity = product.rating.count
                this.productDialog = true;
            },

            //invokes the delete confirmation dialog box
            confirmDeleteProduct(product) {
                this.product = product;
                this.deleteProductDialog = true;
            },

            //Deleting a particular product from the list
            deleteProduct() {
                this.$store.commit('DELETE', this.product.id)
                this.deleteProductDialog = false;
                this.product = {};
                this.quantity = 0
            },

            //Used to find index
            findIndexById(id) {
                let index = -1;
                for (let i = 0; i < this.products.length; i++) {
                    if (this.products[i].id === id) {
                        index = i;
                        break;
                    }
                }

                return index;
            },

            //Used to create id to the new product
            createId() {
                let id = '';
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for ( var i = 0; i < 5; i++ ) {
                    id += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return id;
            },

            //Export the data table in csv format
            exportCSV() {
                this.$refs.dt.exportCSV();
            },

            //Invoke multiple delete confirm dialog box
            confirmDeleteSelected() {
                this.deleteProductsDialog = true;
            },

            //Deletes multiple product from the list
            deleteSelectedProducts() {
                // this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.$store.commit('DELETE_MULTIPLE', this.selectedProducts)
                this.deleteProductsDialog = false;
                this.selectedProducts = null;
                // this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
            },

            //Initializing Filters for searching
            initFilters() {
                this.filters = {
                    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                }
            }
        },
       
        
    }
</script>

