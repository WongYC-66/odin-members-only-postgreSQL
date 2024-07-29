const pool = require('./pool.js')

exports.getAllMessages = async () => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM messages
        LEFT JOIN users ON messages.user_id = users.user_id
        ORDER BY timestamp DESC
        ;
    `)
    // console.log(rows)
    return rows
}

exports.getUserByUsername = async (username) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM users
        WHERE username = '${username}'
        ;
    `)
    // console.log(rows)
    return rows[0]
}

exports.saveNewUser = async (user) => {
    await pool.query(`
        INSERT INTO users (firstName, lastName, username, password, isMember, isAdmin) 
        VALUES
        (
            '${user.firstName}',
            '${user.lastName}',
            '${user.username}',
            '${user.password}',
            '${user.isMember}',
            false
        )
    `)
}

exports.findByUserIdAndUpdate = async (user_id, obj) => {
    const key = Object.keys(obj)[0]
    const { [key]: val } = obj;

    // console.log({ key, val })
    // update one key to one val
    // if key = isAdmin, update isMember to true also
    await pool.query(`
        UPDATE users 
            SET ${key} = '${val}'
            ${key === 'isAdmin' ? ', isMember = true' : ''}
            WHERE user_id = ${user_id}
        ;
    `)


}

exports.saveNewMessage = async (message) => {
    await pool.query(`
        INSERT INTO messages(title, message, user_id, timestamp) 
        VALUES
            (
                '${message.title}',
                '${message.message}',
                ${message.user_id},
                '${message.timestamp}'
            )
        ;
    `)
}

exports.findByMessageIdAndDelete = async (message_id) => {
    await pool.query(`
        DELETE from messages
        WHERE message_id = ${message_id}
    ;
    `)
}