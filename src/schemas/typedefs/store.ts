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
    avg_rating: Int
    rating_count: Int
    followers: Int
    CreatedAt: String
    UpdatedAt: String
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

  type storeId {
    ID: ID
  }

  type itemSlug {
    Slug: String
  }

  type allSlug {
    ID: ID
    Slug: String
  }

  input queryStore {
    name: String
    minDate: String
    maxDate: String
    owner: String
    active: String
    minExp: String
    maxExp: String
    page: String
    limit: String
  }

  type Query {
    getUserStore: store
    getStoreByID(id: String!): store
    getAllStoreId: [storeId]
    getAllSlugByStoreId(id: String!): [itemSlug]
    getAllSlug: [allSlug]
    getItemBySlug(slug: String!): item
    getAllStore(query: queryStore): [store]
  }
`;
