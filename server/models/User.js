const supabase = require('../config/supabase')

const User = {
  // Translate postgres row structure to legacy MongoDB format expected by routes & frontend
  format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      password: row.password,
      isAdmin: row.is_admin,
      createdAt: row.created_at
    }
  },

  async findOne(queryObj) {
    let query = supabase.from('users').select('*')

    if (queryObj && queryObj.$or) {
      const clauses = []
      for (const cond of queryObj.$or) {
        const key = Object.keys(cond)[0]
        const val = cond[key]
        if (val !== undefined && val !== null && val !== '') {
          const dbKey = key === 'isAdmin' ? 'is_admin' : (key === 'createdAt' ? 'created_at' : key)
          clauses.push(`${dbKey}.eq.${val}`)
        }
      }
      if (clauses.length > 0) {
        query = query.or(clauses.join(','))
      } else {
        return null
      }
    } else if (queryObj) {
      for (const [key, val] of Object.entries(queryObj)) {
        if (val !== undefined && val !== null) {
          const dbKey = key === 'isAdmin' ? 'is_admin' : (key === 'createdAt' ? 'created_at' : key)
          query = query.eq(dbKey, val)
        }
      }
    }

    const { data, error } = await query.maybeSingle()
    if (error) throw new Error(error.message)
    return this.format(data)
  },

  async create({ name, email, phone, password, isAdmin }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email || null,
        phone: phone || null,
        password,
        is_admin: isAdmin || false
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.format(data)
  }
}

module.exports = User