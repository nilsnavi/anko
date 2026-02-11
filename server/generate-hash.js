const bcrypt = require('bcryptjs');

async function hashPassword() {
    const password = 'admin123';
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Original password:', password);
        console.log('Hashed password:', hashedPassword);

        // Test verification
        const isValid = await bcrypt.compare(password, hashedPassword);
        console.log('Verification result:', isValid);
    } catch (error) {
        console.error('Error:', error);
    }
}

hashPassword();