import { Nullable } from "@js/types";
import { getClosest } from "@js/helpers/node.ts";

const globalActionAttribute = 'data-global-action'
type GlobalEvent = MouseEvent | TouchEvent | KeyboardEvent

interface IEventData {
  elem: Nullable<HTMLElement>,
  target: Nullable<HTMLElement>,
  action: Nullable<string>,
  key: Nullable<string>,
}

export const getEventData = ( event: GlobalEvent ) => {
  // event.stopPropagation()
  const data: IEventData = {
    elem: null,
    target: null,
    action: null,
    key: null
  }

  data.elem = event.target ? event.target as HTMLElement : null
  data.target = getClosest( data.elem, `[${ globalActionAttribute }]` ) as Nullable<HTMLElement>
  data.action = data.target ? data.target.getAttribute( globalActionAttribute ) : data.action

  if ( "key" in event && event.key ) {
    data.key = event.key
  }

  return data
}