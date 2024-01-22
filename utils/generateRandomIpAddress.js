function generateRandomIpAddress() {
    const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
    console.log(`Using random IP Address: ${octets.join('.')}`)
    return octets.join('.');
}

module.exports = generateRandomIpAddress;