<template>
	<v-container v-if="codeHistory" style="max-width: 800px;" class="px-16 pt-10">
		<v-row class="mb-4" v-if="!newEvent" align="center">
			
			<v-col>
				<v-autocomplete
				  v-model="selectedEventName"
				  @update:modelValue="syncDates"
				  label="Event Name"
				  hide-details
				  :items="eventNames"
				  density="comfortable"
				  variant="outlined">
				</v-autocomplete>
			</v-col>
			<v-col class="flex-shrink-1 flex-grow-0">
				<v-btn @click="startNewEvent" height="45" color="#1E5288">New Event</v-btn>
			</v-col>
		</v-row>

		<v-card class="mb-4 pa-0" v-if="selectedEventName" elevation="0" max-width="700">
			<v-card-title class="mt-2 mb-4 pa-0">
				<v-row>
				<v-col>Event: {{selectedEventName}}</v-col>
				<v-col>Start: {{eventStartDate}}</v-col>
				<v-col align="end">End: {{eventEndDate}}</v-col>
			</v-row>
			</v-card-title>
			<v-card-text class=" pa-0">
				<v-textarea class="mt-6" label="Paste Codes" 
					v-model="codesRawText"
					height="500"
					@input="updateCodesArray"
					variant="outlined">
				</v-textarea>
			</v-card-text>
		</v-card>
		
		<v-card class="pa-4" v-if="newEvent">
			<v-card-title class="mb-2">Enter Event Details</v-card-title>
			<v-card-text>
			<v-text-field label="Event Name" variant="outlined" v-model="newEventName"></v-text-field>
				<v-row>		
					<v-col>
						<DatePicker
							label="Start Date"
							v-model="eventStartDate"
							color="primary">
						</DatePicker>
					</v-col>
					<v-col>
						<DatePicker
							label="End Date"
							v-model="eventEndDate"
							color="primary">
						</DatePicker>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-btn @click="saveEvent" class="uabutton ml-2">Save Event</v-btn>
				<v-btn @click="cancelEvent">Cancel</v-btn>
			</v-card-actions>
		</v-card>

		
		<v-btn v-if="readyToUpload" class="uabutton" @click="uploadCodes">UPLOAD CODES</v-btn>
		<v-alert v-model="showAlert" class="mt-4"
			closable
		    :text="alertText"
		    :title="alertTitle"
		    :type="alertTitle == 'Success' ? 'success' : 'warning'"
		  ></v-alert>
		
	</v-container>
</template>

<script setup>
import { api } from '@/stores'   
</script>

<script>
import DatePicker from '@/components/DatePicker.vue'
export default {
data: () => ({
	newEvent: 			false,
	newEventName:       null, 
	events: 			null,
	eventStartDate: 	null,
	eventEndDate: 		null,
	selectedEventName: 	null,
	codeHistory: 		null,
	codeType: 			{ codeType: "TIA" },
	codesRawText: 		null,
	codes: 				null,
	showAlert:          false,
	alertText:    		null,
	alertTitle:         null,

	/*payload: {
	    "codeType" : "TIA",
	    "codeDescription" : "Fall 2024",
	    "validFrom" : "12-20-2024",
	    "validTo" : "01-15-2025",
	    "codes" : [
	        "TEST5",
	        "TEST6"
	    ]
	}*/
}),

async mounted() {
	this.codeHistory = await api.fetchCodeHistory(this.codeType)
	this.buildEvents()
},

computed: {
	eventStartDateShort() {
      return this.formatDate(this.eventStartDate);
    },

    eventEndDateShort() {
      return this.formatDate(this.eventEndDate);
    },	

	eventNames() {
        let descriptions = []
        this.codeHistory.forEach(item => {
            item.details.forEach(detail => {
                if (!descriptions.includes(detail.codeDescription)) {
                    descriptions.push(detail.codeDescription)
                }
            })
        })
        return descriptions
    },

    readyToUpload() {
    	return this.selectedEventName && this.codes
    }
},

methods: {
	startNewEvent() {
		this.resetFields()
		this.newEvent = true		
	},

	cancelEvent() {		
		this.resetFields()
		this.newEvent = false
	},

	saveEvent() {
		this.events.push({
			codeDescription: this.newEventName,
            validFrom: this.formatDate(this.eventStartDate),
            validTo: this.formatDate(this.eventEndDate)
		})

		this.eventNames.push(this.newEventName)
		this.selectedEventName = this.newEventName
		this.syncDates(this.selectedEventName)
		this.newEventName = null
		this.newEvent = false
	},

	async uploadCodes() {
		const payload = {
		    "codeType" : "TIA",
		    "codeDescription" : this.selectedEventName,
		    "validFrom" : this.eventStartDate,
		    "validTo" : this.eventEndDate,
		    "codes" : this.codes
		}

		const response = await api.postUploadCodes(payload)

		if (response && response.status == "error") {
			this.alertTitle = "Error"
			this.alertText = "Duplicate Codes detected in Upload."
			this.showAlert = true
		} 

		if (response && response.status == "OK") {
			this.alertTitle = "Success"
			this.alertText = "Codes successfully added."
			this.showAlert = true
			this.selectedEventName = null
			this.resetFields()
		}
	},

	formatDate(date) {
	  	if (!date) return '';
	  
	  	const d = new Date(date);
	  	const year = d.getFullYear();
	  	const month = String(d.getMonth() + 1).padStart(2, '0');
	  	const day = String(d.getDate()).padStart(2, '0');
	  
	  	return `${year}-${month}-${day}`;
	},

    syncDates(value) {
        const matchingEvent = this.events.find(
            desc => desc.codeDescription === value
        )
        if (matchingEvent) {
            this.eventStartDate = matchingEvent.validFrom
            this.eventEndDate = matchingEvent.validTo
        }
    },

    updateCodesArray() {
      	this.codes = this.codesRawText.split('\n').filter(line => line.trim() !== '')
      	if (this.codesRawText == "") { this.codes = null }
    },

    buildEvents() {
        this.events = []
        this.codeHistory.forEach(item => {
            item.details.forEach(detail => {
                if (!this.events.some(desc => desc.codeDescription === detail.codeDescription)) {
                    this.events.push({
                        codeDescription: detail.codeDescription,
                        validFrom: detail.validFrom,
                        validTo: detail.validTo
                    })
                }
            })
        })
    },

    resetFields() {
    	this.eventStartDate = 		null
		this.eventEndDate = 		null
		this.newEventName =  		null
		this.codes =  				null
		this.codesRawText =         null
    },
},

}
</script>

<style>
</style>

