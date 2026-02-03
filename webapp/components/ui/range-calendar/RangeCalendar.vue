<script lang="ts" setup>
import type { RangeCalendarRootEmits, RangeCalendarRootProps } from "reka-ui"
import type { DateValue } from "reka-ui"
import type { HTMLAttributes, Ref } from "vue"
import { getLocalTimeZone, today } from "@internationalized/date"
import { reactiveOmit, useVModel } from "@vueuse/core"
import { RangeCalendarRoot, useDateFormatter, useForwardPropsEmits } from "reka-ui"
import { createYear, createYearRange, toDate } from "reka-ui/date"
import { computed, toRaw } from "vue"
import { cn } from '@/utils/cn'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarNextButton, RangeCalendarPrevButton } from "."

const props = withDefaults(
  defineProps<RangeCalendarRootProps & { class?: HTMLAttributes["class"] }>(),
  { placeholder: undefined }
)

const emits = defineEmits<RangeCalendarRootEmits>()

const delegatedProps = reactiveOmit(props, "class", "placeholder")

const placeholder = useVModel(props, "placeholder", emits, {
  passive: true,
  defaultValue:
    props.defaultPlaceholder ??
    (props.modelValue?.start ? toRaw(props.modelValue.start) : undefined) ??
    today(getLocalTimeZone()),
}) as Ref<DateValue>

const formatter = useDateFormatter(props.locale ?? "en")

const yearRange = computed(() =>
  createYearRange({
    start:
      props?.minValue ??
      (toRaw(placeholder.value) ?? today(getLocalTimeZone())).cycle("year", -100),
    end:
      props?.maxValue ??
      (toRaw(placeholder.value) ?? today(getLocalTimeZone())).cycle("year", 10),
  })
)

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    data-slot="range-calendar"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
    v-model:placeholder="placeholder"
  >
    <RangeCalendarHeader>
      <div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-1">
        <div class="flex justify-end">
          <RangeCalendarPrevButton class="relative left-0" />
        </div>
        <div class="flex items-center justify-center gap-1">
          <div class="relative">
            <span class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
              {{ placeholder ? formatter.custom(toDate(placeholder), { month: "short" }) : "" }}
            </span>
            <NativeSelect
              hide-icon
              class="h-8 min-w-16 cursor-pointer border-0 bg-transparent px-2 text-center text-sm text-transparent shadow-none outline-none focus-visible:ring-0"
            @change="
              (e: Event) => {
                const month = Number((e?.target as HTMLSelectElement)?.value)
                if (placeholder && month) placeholder = placeholder.set({ month })
              }
            "
          >
            <NativeSelectOption
              v-for="month in (placeholder && createYear({ dateObj: placeholder })) || []"
              :key="month.toString()"
              :value="month.month"
              :selected="placeholder?.month === month.month"
            >
              {{ formatter.custom(toDate(month), { month: "short" }) }}
            </NativeSelectOption>
          </NativeSelect>
          </div>
          <div class="relative">
            <span class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
              {{ placeholder ? formatter.custom(toDate(placeholder), { year: "numeric" }) : "" }}
            </span>
            <NativeSelect
              hide-icon
              class="h-8 min-w-16 cursor-pointer border-0 bg-transparent px-2 text-center text-sm text-transparent shadow-none outline-none focus-visible:ring-0"
            @change="
              (e: Event) => {
                const year = Number((e?.target as HTMLSelectElement)?.value)
                if (placeholder && year) placeholder = placeholder.set({ year })
              }
            "
          >
            <NativeSelectOption
              v-for="year in yearRange"
              :key="year.toString()"
              :value="year.year"
              :selected="placeholder?.year === year.year"
            >
              {{ formatter.custom(toDate(year), { year: "numeric" }) }}
            </NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
        <div class="flex justify-start">
          <RangeCalendarNextButton class="relative right-0" />
        </div>
      </div>
    </RangeCalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            <RangeCalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="mt-2 w-full"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <RangeCalendarCellTrigger :day="weekDate" :month="month.value" />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
