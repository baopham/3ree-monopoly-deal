/* @flow */
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropertySetClass from '../../../../monopoly/PropertySet'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import PropertySetSelector from '../PropertySetSelector'

type Props = {
  header: string,
  subheader: string,
  propertySets: PropertySetClass[],
  onSelect: (selectedSet: PropertySetClass) => void,
  onCancel: () => void
}

type State = {
  selectedSetIndex: ?number
}

export default class PropertySetSelectorForm extends React.Component {
  props: Props

  state: State

  state = {
    selectedSetIndex: undefined
  }

  select = () => {
    const { selectedSetIndex } = this.state
    const { propertySets } = this.props

    if (selectedSetIndex === undefined) {
      return
    }

    this.props.onSelect(propertySets[selectedSetIndex])
  }

  toggleSelectSet = (setIndex: number) => {
    if (!this.setIsHighlighted(setIndex)) {
      this.setState({
        selectedSetIndex: setIndex
      })
      return
    }

    this.setState({
      selectedSetIndex: undefined
    })
  }

  setIsHighlighted = (setIndex: number): boolean => {
    return this.state.selectedSetIndex === setIndex
  }

  render () {
    const { header, subheader, propertySets, onCancel } = this.props
    const { selectedSetIndex } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            {header}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5>{subheader}</h5>
          <PropertySetSelector
            propertySets={propertySets}
            onClick={this.toggleSelectSet}
            setIsSelected={this.setIsHighlighted}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle='primary'
            disabled={selectedSetIndex === undefined}
            onClick={this.select}
          >
            Select
          </Button>

          <Button
            className='pull-left'
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}

