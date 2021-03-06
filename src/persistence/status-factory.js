module.exports = (db) => {
  return {create, get, update, delUser, delAll, getNumberOfUsers, add}

  async function create (locationId, userId) {
    await db.query(`
      INSERT INTO status
      values
      ($1, $2);
      `, [locationId, [userId]])
  }

  async function update (locationId, newUserId) {
    // TODO could have issues with multi users hitting db
    const old = await get(locationId)
    if (old.users_going.includes(newUserId)) {
      throw new Error('User is already going to this location')
    }
    const newArray = [...old.users_going, newUserId]
    const result = await db.query(`
      UPDATE status
      SET users_going = $1
      WHERE id = $2
      `, [newArray, locationId])
    return result
  }

  async function add (locationId, userId) {
    if (await get(locationId)) {
      try {
        return await update(locationId, userId)
      } catch (err) {
        return err
      }
    } else {
      return await create(locationId, userId)
    }
  }

  async function get (id) {
    const { rows: [result] } = await db.query(`
      SELECT * FROM status WHERE id = $1
      `, [id])
    return result || null
  }

  async function getNumberOfUsers (id) {
    const { rows: [result] } = await db.query(`
      SELECT * FROM status WHERE id = $1
    `, [id])
    if (result && result.users_going) return result.users_going.length
    return 0
  }

  async function delUser (locationId, userId) {
    const original = await get(locationId)
    const newUsersGoing = original.users_going.filter((x) => userId !== x)
    const result = await db.query(`
      UPDATE status
      SET users_going = $1
      WHERE id = $2
    `, [newUsersGoing, locationId])
    return result
  }

  async function delAll () {
    await db.query(`
      DELETE from status;
    `)
  }

}
