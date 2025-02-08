const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  host: 'flockr.socialnetwork@gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'flockr.socialnetwork@gmail.com',
    pass: 'yopm bvxm rrrp pzlv',
  },
})

export { transporter }
