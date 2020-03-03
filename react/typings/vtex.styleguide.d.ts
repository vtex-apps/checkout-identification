/* eslint-disable import/order */

import * as Styleguide from 'vtex.styleguide'

declare module 'vtex.styleguide' {
  import React from 'react'

  export const Button: React.FC

  export const Input: React.FC

  export const Spinner: React.FC<{ size?: number; block?: boolean }>

  export const IconCheck: React.FC
  export const IconClose: React.FC
  export const IconEdit: React.FC
}
