/* @flow */
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropertySet from '../PropertySet'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { unserializePropertySet } from '../../../../monopoly/monopoly'

type Props = {
  header: string,
  subheader: string,
  propertySets: SerializedPropertySet[],
  onSelect: (selectedSet: SerializedPropertySet) => void,
  onCancel: () => void,
  fullSetOnly: boolean
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

  static defaultProps = {
    fullSetOnly: false
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
    const { header, subheader, propertySets, onCancel, fullSetOnly } = this.props
    const { selectedSetIndex } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            {header}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>{subheader}</h4>
          <ul className='list-inline'>
            {propertySets.map((set, setIndex) =>
              <li
                key={setIndex}
                style={this.highlightedSetStyle(setIndex)}
                onClick={() => this.toggleSelectSet(setIndex)}
              >
                <PropertySet
                  propertySet={unserializePropertySet(set)}
                  fullSetOnly={fullSetOnly}
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
