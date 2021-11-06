import React, { useContext } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import { AuthCtx } from '../context/AuthCtx'
export const Preloader = () => {
  const { userType } = useContext(AuthCtx)

  return (
    // <Dimmer active inverted>
    //   <Loader>Loading</Loader>
    // </Dimmer>
    null
  )
}
