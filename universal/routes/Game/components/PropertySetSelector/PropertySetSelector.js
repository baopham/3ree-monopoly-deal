/* @flow */
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropertySet from '../PropertySet'
import PropertySetType from '../../../../monopoly/PropertySet'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'

type Props = {
  header: string,
  subheader: string,
  propertySets: PropertySetType[],
  onSelect: (selectedSet: PropertySetType) => void,
  onCancel: () => void
}

type State = {
  selectedSetIndex: ?number
}

export default class PropertySetSelector extends React.Component {
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

  setIsHighlighted (setIndex: number): boolean {
    return this.state.selectedSetIndex === setIndex
  }

  highlightedSetStyle (setIndex: number): Object {
    return {
      border: this.setIsHighlighted(setIndex) ? '1px solid red' : 'none'
    }
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
          <ul className='list-inline'>
            {propertySets.map((set, setIndex) =>
              <li
                key={setIndex}
                style={this.highlightedSetStyle(setIndex)}
                onClick={() => this.toggleSelectSet(setIndex)}
              >
                <PropertySet
                  propertySet={set}
                />
              </li>
            )}
          </ul>
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
