<template>
	<v-dialog v-model="ui.showConfirmDialog" max-width="500">
		<v-card class="pa-4">
			<v-card-title class="text-h6 ml-2">
				{{ ui.confirmDialogTitle }}
			</v-card-title>

			<!-- Pre-line allows use of \n character in body -->
			<v-card-text style="white-space: pre-line;"> 
				{{ ui.confirmDialogBody }}
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				
				<v-btn color="primary" @click="confirm(true)">
					{{ ui.confirmDialogType === 'Ok' ? 'OK' : 'Yes' }}
				</v-btn>
				
				<v-btn v-if="ui.confirmDialogType === 'YesNo'" color="secondary" @click="confirm(false)">
					No
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { ui } from '@/stores'

export default {
	setup() {
		const confirm = (result) => {
			ui.resolveConfirm(result)
		}
		return { ui, confirm }
	}
}
</script>
