// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,  
      xxl: 2560, // This was 2561
    },
  },
  theme: {
    defaultTheme: 'customTheme', // Set your custom theme as the default
    themes: {
      customTheme: {
        dark: false, // Set to true for a dark theme
        colors: {
          UARed: '#AB0520', 
          UABlue: '#0C234B', 
          UAWarmGray: '#F4EDE5', 
          UACoolGray: '#E2E9EB', 
          UAMidnight: '#001C48', 
          UAAzurite: '#1E5288', 
          UAOasis: '#378DBD', 
          UAChili: '#8B0015', 
          UABloom: '#EF4056', 
          UASky: '#81D3EB', 
          UALeaf: '#70B865', 
          UARiver: '#007D84', 
          UAMesa: '#A95C42', 
        },
      },
    },
  },
})


