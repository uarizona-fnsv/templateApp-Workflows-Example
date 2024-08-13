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


