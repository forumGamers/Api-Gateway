export const storeTypedefs = `#graphql
  type store {
    ID: ID
    name: String
    image: String
    background: String
    description: String
    status_id: Int
    exp: Int
    active: Boolean
    Items: [item]
    StoreStatus: store_status
  }

  type item {
    ID: ID
    name: String
    image: String
    status: String
    slug: String
    stock: Int
    price: Int
    description: String
    discount: Int
    sold: Int
    active: Boolean
  }

  type store_status {
    ID: ID
    name: String
  }

  type Query {
    getUserStore: store
  }
`;
