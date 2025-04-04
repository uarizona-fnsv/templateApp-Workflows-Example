<!-- 
// This is a quick and simple way to show global confirmations or warnings.
// I think its better to develop something more integrated with each component
// But this is fast and simple to use. Should not need to change this much. 

// simply set ui.snack to your message and it will show for 4 seconds
// ui.snack = "Upload Successful"
// optional ui.snackColor can be set to change the color of the snackbar
// ui.snackColor = 'success' | 'error' | 'warning' | 'info' (default is warning)
-->

<template>
	<v-snackbar class="mt-10" location="top" v-model="ui.snack" :timeout="4000" :color="ui.snackColor">
    	<div class="d-flex justify-center text-black">{{ ui.snackText }}</div>
    </v-snackbar>
</template>

<script setup>
    import {  ui } from '@/stores'   
</script>

<script>
export default {
name: 'SnackMessageBar',
}
</script>


