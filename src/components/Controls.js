import React, { useState } from 'react'
import ReactToken from 'react-token'
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBRow,
  MDBCol
} from 'mdbreact'

const Controls = ({
  selectedOrg,
  selectedSortBy,
  orgList,
  branchFilters,
  topicFilters,
  onSelectOrg,
  onChangeBranches,
  onChangeTopics,
  onChangeKeyword,
  onSortChange
}) => {
  const [typeDelay, setTypeDelay] = useState()

  const onType = (event) => {
    typeDelay && clearTimeout(typeDelay)
    const value = event.target.value
    setTypeDelay(setTimeout(() => onChangeKeyword(value), 500))
  }

  const handleKeyDown = (event) => {
    const value = event.target.value
    if (event.key === 'Enter') {
      typeDelay && clearTimeout(typeDelay)
      onChangeKeyword(value)
    }
  }

  return (
    <MDBRow className='controls'>
      <MDBCol size='4'>
        <MDBRow>
          <MDBCol size='5'>
            <MDBDropdown label='Organization'>
              <MDBDropdownToggle caret color='primary'>
                {selectedOrg}
              </MDBDropdownToggle>
              <MDBDropdownMenu basic>
                {orgList.map(organization => (
                  <MDBDropdownItem key={organization} onClick={() => onSelectOrg(organization)}>{organization}</MDBDropdownItem>
                ))}
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBCol>
          <MDBCol>
            <input className='search rt-container' placeholder='Search' onKeyPress={handleKeyDown} onChange={onType} />
          </MDBCol>
        </MDBRow>
      </MDBCol>
      <MDBCol size='3'>
        <ReactToken
          selected={topicFilters}
          placeholder='Filter Topics'
          onAdd={(d) => { onChangeTopics(d, true) }}
          onRemove={(d) => { onChangeTopics(d, false) }}
          key='topics'
        />
      </MDBCol>
      <MDBCol>
        <ReactToken
          selected={branchFilters}
          placeholder='Filter Branches'
          onAdd={(d) => { onChangeBranches(d, true) }}
          onRemove={(d) => { onChangeBranches(d, false) }}
          key='branches'
        />
      </MDBCol>
      <MDBCol size='2'>
        <MDBDropdown label='Organization'>
          <MDBDropdownToggle caret color='primary'>
            Last Updated {selectedSortBy}
          </MDBDropdownToggle>
          <MDBDropdownMenu basic>
            {['', ...branchFilters].map(sortBy => (
              <MDBDropdownItem key={sortBy} onClick={() => onSortChange(sortBy)}>Last Updated {sortBy}</MDBDropdownItem>
            ))}
          </MDBDropdownMenu>
        </MDBDropdown>
      </MDBCol>
    </MDBRow>
  )
}

export default Controls
