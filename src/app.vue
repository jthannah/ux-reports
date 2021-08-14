<template>
  <div class="bg-img relative flex min-h-screen">
    <div class="sm:p-6 z-1 relative w-3/5 p-10 px-4 py-5 m-auto mt-48 bg-white rounded-md shadow">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Update your email</h3>
      <div class="max-w-xl mt-2 text-sm text-gray-500">
        <p>Change the email address you want associated with your account.</p>
      </div>
      <form class="sm:flex sm:items-center mt-5">
        <div class="sm:max-w-xs w-full">
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            class="
              focus:ring-indigo-500 focus:border-indigo-500
              sm:text-sm
              block
              w-full
              border-gray-300
              rounded-md
              shadow-sm
            "
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          class="
            hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
            inline-flex
            items-center
            justify-center
            w-full
            px-4
            py-2
            mt-3
            font-medium
            text-white
            bg-indigo-600
            border border-transparent
            rounded-md
            shadow-sm
          "
        >
          Save
        </button>
      </form>
    </div>
  </div>
  <apexchart width="500" :options="chartOptions" :series="series"></apexchart>
<!--  <DoughnutChart ref="doughnutRef" :chart-data="testData" :options="options" />-->
</template>

<script lang="ts">
import ReportApi from '@/api/reports'
import { computed, defineComponent, ref } from 'vue'
// import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'
// import { Chart, ChartData, ChartOptions, registerables } from 'chart.js'
// Chart.register(...registerables)
import VueApexCharts from 'vue3-apexcharts'
import ApexCharts from 'apexcharts'
//
// Add this when into a TypeScript codebase
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts
  }
}

export default defineComponent({
  components: {
    apexchart: VueApexCharts,
    // DoughnutChart,
  },
  setup() {
    // const series = ref([])
    // const labels = ref([])
    ReportApi.getData().then((data) => {
      console.log(data)
    })
    const series = [0.9158410887621303,0.06804763334334012,0.016111277894526124]
    const chartOptions = {
      chart: {
        type: 'pie',
      },
      labels: ['Good', 'Moderate', 'Bad'],
    }

    console.log(series)

    // const options = ref({
    //   responsive: true,
    //   plugins: {
    //     legend: {
    //       position: 'top',
    //     },
    //     title: {
    //       display: true,
    //       text: 'Chart.js Doughnut Chart',
    //     },
    //   },
    // })
    // const data = ref([20, 40, 60, 50, 5])
    // const testData = computed(() => ({
    //   labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
    //   datasets: [
    //     {
    //       data: data.value,
    //       backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
    //     },
    //   ],
    // }))

    return { series, chartOptions }
  },
})
</script>
