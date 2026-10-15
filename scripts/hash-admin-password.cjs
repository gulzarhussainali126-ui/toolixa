const bcrypt = require('bcryptjs');
const password = process.argv[2];
if (!password || password.length < 14) {
  console.error('Usage: node scripts/hash-admin-password.cjs "A-unique-password-at-least-14-chars"');
  process.exit(1);
}
bcrypt.hash(password, 12).then(hash => {
  console.log('\nADMIN_PASSWORD_HASH=' + hash);
  console.log('Copy this hash into your hosting provider environment variables. Do not commit it or share it.\n');
}).catch(() => { console.error('Could not generate password hash.'); process.exit(1); });
