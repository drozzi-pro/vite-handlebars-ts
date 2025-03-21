import "./index.scss"
import {ERangeElems} from "@shared/input/range/types.ts";

export const initInputRange = () => {
  const ranges: NodeListOf<HTMLElement> = document.querySelectorAll(ERangeElems.Range)
  const trekBgFilled = '#DE8D55'
  const trekBg = 'transparent'

  ranges.forEach(range => {
    const sliderFrom: HTMLInputElement | null = range.querySelector(ERangeElems.SliderFrom)
    const sliderTo: HTMLInputElement | null = range.querySelector(ERangeElems.SliderTo)
    const inputFrom: HTMLInputElement | null = range.querySelector(ERangeElems.InputFrom)
    const inputTo: HTMLInputElement | null = range.querySelector(ERangeElems.InputTo)
    const trek: HTMLElement | null = range.querySelector(ERangeElems.Trek)

    const store = {
      from: 0,
      to: 0,
      max: 0
    }

    if (sliderFrom && sliderTo && inputFrom && inputTo) {
      store.max = Number(sliderFrom.max) ?? 0;
      store.from = Number(sliderFrom.value) ?? 0;
      store.to = Number(sliderTo.value) ?? 0;

      fillColor();
      [sliderFrom, sliderTo, inputFrom, inputTo].forEach(rangeInput => {
        const handler =
          rangeInput === sliderFrom || rangeInput === sliderTo ?
          'oninput' : 'onchange'

        rangeInput[handler] = (e) => {
          const input = e.target as HTMLInputElement

          if (input === sliderFrom || input === inputFrom) {
            const newFromValue = Number(input.value)
            store.from = newFromValue >= store.to ? store.to : newFromValue
            if (store.from < 0) {
              store.from = 0
            }
          }

          if (input === sliderTo || input === inputTo) {
            const newToValue = Number(input.value)
            store.to = newToValue <= store.from ? store.from : newToValue
            if (store.to > store.max) {
              store.to = store.max
            }
          }

          updateValues()
          fillColor()
        }
      });



      const updateValues = () => {
        const from = `${store.from}`
        const to = `${store.to}`
        inputFrom.value = from
        sliderFrom.value = from
        inputTo.value = to
        sliderTo.value = to
      }

      function fillColor() {
        if (trek) {
          const percent1 = (store.from / store.max) * 100;
          const percent2 = (store.to / store.max) * 100;
          trek.style.background =
            `linear-gradient(to right, ${trekBg} ${percent1}% , ${trekBgFilled} ${percent1}% , ${trekBgFilled} ${percent2}%, ${trekBg} ${percent2}%)`;
        }
      }
    }
  })
}