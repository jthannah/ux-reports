import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import './assets/css/tailwind.css'
import './assets/fonts/inter.css'
import ApexCharts from 'apexcharts'
// import { inspect } from '@xstate/inspect'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// if (appConfig.env === 'localdev' && !window.Cypress) {
//   inspect({
//     // Open xstate visualizer in a new tab
//     iframe: false,
//   })
// }

const app = createApp(App)
app.config.globalProperties.$apexcharts = ApexCharts
app.use(router)
app.mount('#app')
