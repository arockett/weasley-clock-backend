import { anyOf, arrayOf, assertBy, Assertion, enumOf, is, objectOf, primitives, ValidationRejection } from '@altostra/type-validations';
import { InvalidOwntracksMessageError } from './error-types';

export enum OwntracksMessageType {
  Location = 'location',
  Transition = 'transition'
}

/*
 * _type = 'location'
 */
export interface OwntracksLocationMessage extends OwntracksMessage {
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
  inregions: arrayOf(primitives.maybeString)
})

/*
 * _type = 'transition'
 */
export enum OwntracksTransitionEvent {
  Enter = 'enter',
  Leave = 'leave'
}
export interface OwntracksTransitionMessage extends OwntracksMessage {
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
 * Any Owntracks message
 */
export interface OwntracksMessage {
  topic: string,
  owntracksMsg:
    OwntracksLocationMessage |
    OwntracksTransitionMessage
}
export const isOwntracksMessage = objectOf({
  topic: primitives.string,
  owntracksMsg: anyOf(
    isOwntracksLocationMessage,
    isOwntracksTransitionMessage
  )
})

function invalidOwntracksMessageErrorFactory(value: unknown, rejections: ValidationRejection[]): any {
  return new InvalidOwntracksMessageError('Invalid message', { value, rejections })
}
export const validateOwntracksMessage: Assertion<OwntracksMessage> = assertBy(
  isOwntracksMessage,
  invalidOwntracksMessageErrorFactory
)
