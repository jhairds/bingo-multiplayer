export const arrayElemRemover = (array, number) => {
    const index = array.indexOf(number); // Find the index of the number
    if (index !== -1) {
        array.splice(index, 1); // Remove the element if found
    }
}
