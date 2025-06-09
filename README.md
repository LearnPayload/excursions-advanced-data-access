## Project Overview

This is an **example e-commerce application** built specifically to demonstrate **Advanced Data Access Patterns in Payload CMS** for an educational video series called "Excursions."

### Purpose

- **NOT a production e-commerce app** - this is purely educational
- Demonstrates the progression from scattered Payload queries to clean abstractions
- Shows when and why to build data access layers over Payload CMS
- Designed to be standalone content (independent of other video series)

## Architecture Goals

### Core Problem Being Solved

Replace scattered Payload boilerplate throughout the codebase:

```typescript
// Instead of this everywhere...
const payload = await getPayload({ config })
const products = await payload.find({
  collection: 'products',
  where: { category: { equals: 'electronics' } },
  limit: 20,
  sort: '-createdAt',
})
```

### Target API Design

Clean, domain-specific interface:

```typescript
// Much cleaner and more intentional
const products = await model.product.getByCategory('electronics', {
  limit: 20,
  sort: '-createdAt',
})

const cartItems = await model.cart.getAll()
await model.order.create(cartItems)
```

#### Implementation Structure

```typescript
// Backend implementations
// Domain models extend appropriate backend
class ProductModel extends BaseModel<Product> {
  collection: CollectionSlug: "products"
}

class BaseModel<T> {
  async getAll() {}
  async getByID() {}
  async create() {}
  async update() {}
  async delete() {}
}
```

## Development Approach

### API-First Design

1. **Design the ideal API first** - how do we want to interact with data?
2. **Work backwards to implement** - build just enough to support that interface
3. **Focus on developer experience** - prioritize clean, readable code

### Complexity Guidelines

- **Keep it simple** - don't over-engineer for this example
- **Demonstrate clear value** - each abstraction should solve obvious pain points
- **Avoid feature creep** - stay focused on data access patterns

## Success Criteria

- Dramatically cleaner application code compared to direct Payload usage
- Clear demonstration of when/why to build abstractions
- Reusable patterns you can apply to your own projects
- Architecture that could realistically scale with growing requirements
