const fs = require('fs')
const path = require('path')

module.exports = ({ test, assert, helpers }) => {
  const { projectRoot } = helpers
  const { categories, dishes } = require('../../utils/mockMenu')
  const validStatuses = ['on_sale', 'off_sale']

  test('each dish has required fields and valid values', () => {
    dishes.forEach((dish) => {
      assert.ok(dish.id, `dish id is required: ${dish.name}`)
      assert.ok(dish.categoryId, `categoryId is required: ${dish.id}`)
      assert.ok(dish.name, `name is required: ${dish.id}`)
      assert.ok(Number(dish.price) > 0, `price must be greater than 0: ${dish.id}`)
      assert.ok(validStatuses.includes(dish.status), `invalid status: ${dish.id}`)
    })
  })

  test('category ids are unique', () => {
    const ids = categories.map((category) => category.id)

    assert.strictEqual(new Set(ids).size, ids.length)
  })

  test('dish ids are unique', () => {
    const ids = dishes.map((dish) => dish.id)

    assert.strictEqual(new Set(ids).size, ids.length)
  })

  test('dish categoryId matches an existing category', () => {
    const categoryIds = new Set(categories.map((category) => category.id))

    dishes.forEach((dish) => {
      assert.ok(categoryIds.has(dish.categoryId), `missing category for dish: ${dish.id}`)
    })
  })

  test('local dish images exist', () => {
    dishes.forEach((dish) => {
      const imagePath = path.join(projectRoot, dish.image.replace(/^\//, ''))

      assert.ok(fs.existsSync(imagePath), `image not found: ${dish.image}`)
    })
  })
}
