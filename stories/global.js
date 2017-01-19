/* @flow */
import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import { PROPERTY_RED } from '../universal/monopoly/cards'
import AlertBar from '../universal/components/AlertBar'
import Card from '../universal/components/Card'
import TextFormDialog from '../universal/components/TextFormDialog'

storiesOf('global.AlertBar', module)
  .add('with danger background', () => (
    <AlertBar bsBackground='danger' show>
      Alert alert alert!
    </AlertBar>
  ))

storiesOf('global.Card', module)
  .add('with face up', () => (
    <Card card={PROPERTY_RED} faceUp />
  ))
  .add('with face down', () => (
    <Card card={PROPERTY_RED} />
  ))
  .add(`with size 'large'`, () => (
    <Card card={PROPERTY_RED} size='large' />
  ))
  .add(`with size 'small'`, () => (
    <Card card={PROPERTY_RED} size='small' />
  ))
  .add(`with size 'xsmall'`, () => (
    <Card card={PROPERTY_RED} size='xsmall' />
  ))

storiesOf('global.TextFormDialog', module)
  .add('being cancelable', () => (
    <TextFormDialog
      cancelable
      header='Header'
      inputLabel='Input Label'
      submitLabel='Submit'
      onSubmit={action('submitted')}
      onCancel={action('canceled')}
    />
  ))
  .add('being non-cancelable', () => (
    <TextFormDialog
      header='Header'
      inputLabel='Input Label'
      submitLabel='Submit'
      onSubmit={action('submitted')}
      onCancel={action('canceled')}
    />
  ))
  .add('input allowing spaces', () => (
    <TextFormDialog
      allowSpaces
      header='Header'
      inputLabel='Input Label'
      submitLabel='Submit'
      onSubmit={action('submitted')}
      onCancel={action('canceled')}
    />
  ))
