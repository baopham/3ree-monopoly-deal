/* @flow */
import React from 'react'
import PropertySet from '../PropertySet'
import PropertySetClass from '../../../../monopoly/PropertySet'

type Props = {
  propertySets: PropertySetClass[],
  onClick: (selectedSetIndex: number) => void,
  setIsSelected: (selectedSetIndex: number) => boolean,
  setFilter: (set: PropertySetClass) => boolean
}

export default class PropertySetSelector extends React.Component {
  props: Props

  static defaultProps = {
    setFilter: set => true
  }

  highlightedSetStyle (setIndex: number): Object {
    return {
      border: this.props.setIsSelected(setIndex) ? '1px solid red' : 'none'
    }
  }

  render () {
    const { propertySets, setFilter, onClick } = this.props

    return (
      <ul className='list-inline'>
        {propertySets.map((set, setIndex) =>
          <li
            key={setIndex}
            style={this.highlightedSetStyle(setIndex)}
            onClick={() => onClick(setIndex)}
          >
            {setFilter(set) &&
              <PropertySet
                propertySet={set}
              />
            }
          </li>
        )}
      </ul>
    )
  }
}
