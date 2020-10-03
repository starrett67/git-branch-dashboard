import React, { useEffect, useState } from 'react'
import { MDBBtn, MDBCol } from 'mdbreact'

const MergeButton = ({ branch, srcBranch, onMerge }) => {
  const [srcTree, setSrcTree] = useState(srcBranch.commit.commit.tree.sha)
  const [destTree, setDestTree] = useState(branch.commit.commit.tree.sha)

  useEffect(() => {
    setSrcTree(srcBranch.commit.commit.tree.sha)
  }, [srcBranch])

  useEffect(() => {
    setDestTree(branch.commit.commit.tree.sha)
  }, [destTree])

  return (
    <MDBCol>
      <MDBBtn
        className='text-truncate'
        disabled={(srcTree === destTree)}
        onClick={() => { onMerge(srcBranch, branch) }}
      >
        Merge {srcBranch.name}
      </MDBBtn>
    </MDBCol>
  )
}

export default MergeButton
