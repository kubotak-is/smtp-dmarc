<script lang="ts">
  import Flatpickr from 'svelte-flatpickr'
  import flatpickrInstance from 'flatpickr'
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/light.css'
  import { format } from 'date-fns'

  export let from: string
  export let to: string
  export let value: [Date, Date] | undefined

  const options = {
    enableTime: false,
    mode: 'range',
    dateFormat: 'Y-m-d',
    maxDate: format(new Date(), 'yyyy-MM-dd'),
    defaultDate: [from, to],
    onChange(selectedDates) {
      const MAX_RANGE_DAYS = 30 // 最大選択可能な日数
      if (selectedDates.length === 2) {
        const start = selectedDates[0]
        const end = selectedDates[1]
        const diff = (end - start) / (1000 * 60 * 60 * 24) // 差分を日数で計算
        if (diff > MAX_RANGE_DAYS) {
          alert(`選択できる範囲は最大で${MAX_RANGE_DAYS}日です。`)
          // 選択範囲の修正や他の処理をここに追加
          // 例えば、選択範囲を自動で最大範囲内に調整する場合:
          flatpickrInstance.setDate([
            start,
            new Date(start.getTime() + MAX_RANGE_DAYS * 24 * 60 * 60 * 1000)
          ])
        }
      }
    }
  }
</script>

<Flatpickr class="input p-3" {options} bind:value on:change name="date" />
