export default class Utils {
	public shuffleArray<T>(array: T[]): T[] {
		// Make a copy of the array
		const shuffledArray = array.slice();
	  
		for (let i = shuffledArray.length - 1; i > 0; i--) {
		  // Generate a random index
		  const j = Math.floor(Math.random() * (i + 1));
	  
		  // Swap the elements at indices i and j
		  [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
		}
	  
		return shuffledArray;
	}
}
