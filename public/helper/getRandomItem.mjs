export const getRandomItem = (array) => {
    if (!Array.isArray(array) || array.length === 0) {
        console.error("Input must be a non-empty array.");
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
}