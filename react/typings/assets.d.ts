declare module '*.css' {
  const styleObject: { [key: string]: string }
  export default styleObject
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const gql: DocumentNode
  export default gql
}
