import {
  anyOf,
  arrayOf,
  assertBy,
  Assertion,
  enumOf,
  is,
  maybe,
  objectOf,
  primitives } from '@altostra/type-validations';

export enum OwntracksMessageType {
  Location = 'location',
  Transition = 'transition',
  Lwt = 'lwt'
}

/*
 * _type = 'location'
 */
export interface OwntracksLocationMessage {
  _type: OwntracksMessageType.Location,
  tst: number,
  lat: number,
  lon: number,
  vel: number,
  inregions?: string[]
}
export const isOwntracksLocationMessage = objectOf({
  _type: is(OwntracksMessageType.Location),
  tst: primitives.number,
  lat: primitives.number,
  lon: primitives.number,
  vel: primitives.number,
  inregions: maybe(arrayOf(primitives.string))
})

/*
 * _type = 'transition'
 */
export enum OwntracksTransitionEvent {
  Enter = 'enter',
  Leave = 'leave'
}
export interface OwntracksTransitionMessage {
  _type: OwntracksMessageType.Transition,
  tst: number,
  event: OwntracksTransitionEvent,
  desc: string
}
export const isOwntracksTransitionMessage = objectOf({
  _type: is(OwntracksMessageType.Transition),
  tst: primitives.number,
  event: enumOf<OwntracksTransitionEvent>(
    OwntracksTransitionEvent.Enter,
    OwntracksTransitionEvent.Leave
  ),
  desc: primitives.string
})

/*
 * _type = 'lwt'
 */
export interface OwntracksLwtMessage {
  _type: OwntracksMessageType.Lwt,
  tst: number
}
export const isOwntracksLwtMessage = objectOf({
  _type: is(OwntracksMessageType.Lwt),
  tst: primitives.number
})

/*
 * Any Owntracks message
 */
export interface OwntracksMessage {
  topic: string,
  body:
    OwntracksLocationMessage |
    OwntracksTransitionMessage |
    OwntracksLwtMessage
}
export const isOwntracksMessage = objectOf({
  topic: primitives.string,
  body: anyOf(
    isOwntracksLocationMessage,
    isOwntracksTransitionMessage,
    isOwntracksLwtMessage
  )
})

export const validateOwntracksMessage: Assertion<OwntracksMessage> = assertBy(
  isOwntracksMessage,
  (value, rejections) => {
    console.log(`Input rejections:\n${JSON.stringify(rejections, null, 2)}`);
    return new Error('Invalid owntracks message');
  }
)
