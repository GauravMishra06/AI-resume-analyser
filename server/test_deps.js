console.log('Attempting to require mammoth...');
try {
    const mammoth = require('mammoth');
    console.log('Successfully required mammoth');
} catch (error) {
    console.error('Failed to require mammoth:', error);
}

console.log('Attempting to require pdf-parse...');
try {
    const pdf = require('pdf-parse');
    console.log('Successfully required pdf-parse');
} catch (error) {
    console.error('Failed to require pdf-parse:', error);
}
