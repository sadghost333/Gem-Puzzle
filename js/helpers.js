class Orders {
  maxOrder = 0;
  arrayOfNumbers = [];

  constructor(num) {
    this.maxOrder = num;

    for (let i = 0; i < this.maxOrder; i++) {
      this.arrayOfNumbers.push(i);
    }
  }

  shuffle = () => {
    let currentIndex = this.arrayOfNumbers.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [this.arrayOfNumbers[currentIndex], this.arrayOfNumbers[randomIndex]] = [
        this.arrayOfNumbers[randomIndex], this.arrayOfNumbers[currentIndex]];
    }
  
    return this.arrayOfNumbers;
  }
}

export {Orders}