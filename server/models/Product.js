const supabase = require('../config/supabase')

const Product = {
  format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      flavour: row.flavour,
      puffs: row.puffs,
      nicotine: row.nicotine,
      badge: row.badge,
      createdAt: row.created_at
    }
  },

  find(filter = {}) {
    let query = supabase.from('products').select('*')
    for (const [key, val] of Object.entries(filter)) {
      if (val !== undefined && val !== null) {
        const dbKey = key === 'createdAt' ? 'created_at' : key
        query = query.eq(dbKey, val)
      }
    }

    const builder = {
      query,
      sort(sortObj) {
        for (const [key, direction] of Object.entries(sortObj)) {
          const dbKey = key === 'createdAt' ? 'created_at' : key
          const ascending = direction === 1 || direction === 'asc' || direction === 'ascending'
          this.query = this.query.order(dbKey, { ascending })
        }
        return this
      },
      limit(limitVal) {
        this.query = this.query.limit(limitVal)
        return this
      },
      async then(resolve, reject) {
        try {
          const { data, error } = await this.query
          if (error) throw new Error(error.message)
          resolve((data || []).map(row => Product.format(row)))
        } catch (err) {
          reject(err)
        }
      }
    }
    return builder
  },

  async findById(id) {
    if (!id) return null
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return this.format(data)
  },

  async create(data) {
    const { data: row, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        flavour: data.flavour,
        puffs: data.puffs,
        nicotine: data.nicotine,
        badge: data.badge
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.format(row)
  },

  async findByIdAndUpdate(id, data, options = {}) {
    const updateData = {}
    const allowedKeys = ['name', 'description', 'price', 'image', 'flavour', 'puffs', 'nicotine', 'badge']
    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        updateData[key] = data[key]
      }
    }

    const { data: row, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.format(row)
  },

  async findByIdAndDelete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return { success: true }
  }
}

module.exports = Product