import React, { Component } from 'react'
import ReactToken from 'react-token'
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBRow, MDBCol } from 'mdbreact'

class Controls extends Component {
  render () {
    return (
      <MDBRow className='controls'>
        <MDBCol size='3'>
          <MDBDropdown label='Organization'>
            <label>Org:</label>
            <MDBDropdownToggle caret color='primary'>
              {this.props.org}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              {this.props.orgs.map(o => {
                return (<MDBDropdownItem key={o.name} onClick={() => this.props.onSelectOrg(o)}>{o}</MDBDropdownItem>)
              })}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>

        <MDBCol>
          <ReactToken
            selected={this.props.topics}
            placeholder='Filter Topics'
            onAdd={(d) => { this.props.onChangeTopics(d, true) }}
            onRemove={(d) => { this.props.onChangeTopics(d, false) }}
            key='topics' />
        </MDBCol>
        <MDBCol>
          <ReactToken
            selected={this.props.branches}
            placeholder='Filter Branches'
            onAdd={(d) => { this.props.onChangeBranches(d, true) }}
            onRemove={(d) => { this.props.onChangeBranches(d, false) }}
            key='branches' />
        </MDBCol>
      </MDBRow>
    )
  }
}

export default Controls
