const supabase = require('../config/supabase')

const Order = {
  find(filter = {}) {
    // We will build the select query dynamically on execution
    let populateUser = false
    let populateProduct = false
    let userFields = '*'

    // Map MongoDB filter fields to PostgreSQL columns
    const processedFilter = {}
    for (const [key, val] of Object.entries(filter)) {
      if (key === 'user') {
        processedFilter['user_id'] = val
      } else {
        processedFilter[key] = val
      }
    }

    const builder = {
      populates: [],
      sorts: [],
      populate(path, selectFields) {
        if (path === 'user') {
          populateUser = true
          if (selectFields) {
            userFields = selectFields.split(' ').join(',')
          }
        } else if (path === 'product') {
          populateProduct = true
        }
        return this
      },
      sort(sortObj) {
        for (const [key, direction] of Object.entries(sortObj)) {
          const dbKey = key === 'createdAt' ? 'created_at' : key
          const ascending = direction === 1 || direction === 'asc' || direction === 'ascending'
          this.sorts.push({ dbKey, ascending })
        }
        return this
      },
      async then(resolve, reject) {
        try {
          // Construct the SELECT statement based on populate requirements
          let selectStr = '*'
          if (populateUser && populateProduct) {
            selectStr = `*, user:users(${userFields}), product:products(*)`
          } else if (populateUser) {
            selectStr = `*, user:users(${userFields})`
          } else if (populateProduct) {
            selectStr = `*, product:products(*)`
          }

          let execQuery = supabase.from('orders').select(selectStr)

          // Apply filters
          for (const [key, val] of Object.entries(processedFilter)) {
            if (val !== undefined && val !== null) {
              execQuery = execQuery.eq(key, val)
            }
          }

          // Apply sorts
          for (const s of this.sorts) {
            execQuery = execQuery.order(s.dbKey, { ascending: s.ascending })
          }

          const { data, error } = await execQuery
          if (error) throw new Error(error.message)

          // Format results to match MongoDB structures
          const formatted = (data || []).map(row => {
            const formattedRow = {
              _id: row.id,
              id: row.id,
              customerName: row.customer_name,
              phone: row.phone,
              address: row.address,
              paymentScreenshot: row.payment_screenshot,
              status: row.status,
              createdAt: row.created_at
            }

            if (populateProduct && row.product) {
              const Product = require('./Product')
              formattedRow.product = Product.format(row.product)
            } else {
              formattedRow.product = row.product_id
            }

            if (populateUser && row.user) {
              const User = require('./User')
              formattedRow.user = User.format(row.user)
            } else {
              formattedRow.user = row.user_id
            }

            return formattedRow
          })

          resolve(formatted)
        } catch (err) {
          reject(err)
        }
      }
    }
    return builder
  },

  async create(data) {
    const { data: row, error } = await supabase
      .from('orders')
      .insert({
        user_id: data.user,
        customer_name: data.customerName,
        phone: data.phone,
        address: data.address,
        product_id: data.product,
        payment_screenshot: data.paymentScreenshot,
        status: data.status || 'pending'
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      _id: row.id,
      id: row.id,
      user: row.user_id,
      customerName: row.customer_name,
      phone: row.phone,
      address: row.address,
      product: row.product_id,
      paymentScreenshot: row.payment_screenshot,
      status: row.status,
      createdAt: row.created_at
    }
  },

  async findByIdAndUpdate(id, data, options = {}) {
    const updateData = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.customerName !== undefined) updateData.customer_name = data.customerName
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address

    const { data: row, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      _id: row.id,
      id: row.id,
      user: row.user_id,
      customerName: row.customer_name,
      phone: row.phone,
      address: row.address,
      product: row.product_id,
      paymentScreenshot: row.payment_screenshot,
      status: row.status,
      createdAt: row.created_at
    }
  }
}

module.exports = Order