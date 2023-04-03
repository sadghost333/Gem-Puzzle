import { Orders } from "./helpers.js";
const shuffleBtn = document.querySelector('.shuffle-btn');
const startBtn = document.querySelector('.start-btn');
const saveBtn = document.querySelector('.save-btn');
const resultsBtn = document.querySelector('.results-btn');
const frameSizeNum = document.querySelector('.frame-size-num');
const time = document.querySelector('.time-num');
const movesNum = document.querySelector('.moves-num');
const sizeBtns = document.querySelectorAll('.size-item');
const gameBox = document.querySelector('.game-wrapper');
const resultsWindow = document.querySelector('.results-wrapper')
const closeResults = document.querySelector('.results-close-btn')

let isGameRun = false;
let seconds = 0;
let moves = 0;
let frameSize = 3;
let isShuffle = false;
let isWin = false;
time.textContent = `${seconds} seconds`;
movesNum.textContent = moves;

window.addEventListener('load', () => {
  handleEventListeners();
  generateItems();
  moveEventListeners();
})

function handleEventListeners() {
  sizeBtns.forEach(e => e.addEventListener('click', function({ target }) {
    const prevSelected = document.querySelector('.size-item.selected');
    prevSelected.classList.remove('selected');
    prevSelected.classList.remove('green-active');
    target.classList.add('selected');
    target.classList.add('green-active');

    frameSizeNum.textContent = target.textContent;
    frameSize = +(target.textContent[0]);
    isShuffle = false;

    generateItems();
    moveEventListeners();
  }));

  startBtn.addEventListener('click', startAndStop);
  shuffleBtn.addEventListener('click', getShuffle);
  resultsBtn.addEventListener('click', function(){
    resultsWindow.style.display = 'flex'
  })
  closeResults.addEventListener('click', function(){
    resultsWindow.style.display = 'none'
  })
}

function secondsUp() {
  if(isGameRun){
    seconds = seconds + 1;
    time.textContent = `${seconds} seconds`;
    setTimeout(secondsUp , 1000);
  }
}

function startAndStop() {
  if(isShuffle){
    if(!isGameRun){
      isGameRun = true;
      secondsUp();
      startBtn.textContent = 'Stop';
      gameBox.childNodes.forEach(e => {
        e.draggable = 'true';
      })
      return;
    }

    isGameRun = false;
    startBtn.textContent = 'Start';
    gameBox.childNodes.forEach(e => {
      e.draggable = '';
    })
  }
}

function getShuffle() {
  if(isShuffle){
    startBtn.classList.add('menu-item');
    startBtn.classList.remove('menu-item-disabled');
    seconds = 0;
    moves = 0;
    time.textContent = `${seconds} seconds`;
    movesNum.textContent = moves;
    isGameRun = false;
    startBtn.textContent = 'Start';
    generateItems();
    return;
  }
  isShuffle = true;
  startBtn.classList.remove('menu-item-disabled');
  startBtn.classList.add('menu-item');
  generateItems();
}

function generateItems() {

  if(isShuffle) {
    const order = new Orders(frameSize * frameSize);
    const randomNumberArray = order.shuffle();

    gameBox.childNodes.forEach((item, index) => {
      item.style.order = randomNumberArray[index];
    })

  } else {

    if(gameBox.childNodes.length > 0) {
      while (gameBox.firstChild) {
        gameBox.removeChild(gameBox.firstChild);
      }
    }
    
    for(let i = 1; i < ((frameSize * frameSize) + 1); i++){
      let div = document.createElement("div");
      div.classList.add('game-items');
      div.style.width = `${Math.floor(100/frameSize) - 1}%`;
      div.style.height = `${Math.floor(100/frameSize) - 1}%`;
      div.style.order = i - 1;
      div.textContent = i;
      gameBox.append(div);
    }
    gameBox.lastChild.classList.add('game-item-empty');
    gameBox.lastChild.textContent = '';
    gameBox.lastChild.draggable = '';
    gameBox.lastChild.classList.remove('game-items');
  }
} 

function moveEventListeners() {
  let ItemDragStartIndex;
  let activeItemIndex;
  let redItemIndex;
  let activeElement;
  const redItem = document.querySelector('.game-item-empty');
  const gameItems = document.querySelectorAll('.game-items');

  gameItems.forEach(element => element.addEventListener('dragstart', (event) => {
    event.target.classList.add(`selected`);
    
    activeItemIndex = event.target.style.order;
    ItemDragStartIndex = activeItemIndex;
    redItemIndex = redItem.style.order;
  }));
  
  gameBox.addEventListener('dragover', (event) =>{
    event.preventDefault();
    activeElement = document.querySelector('.game-items.selected');
    redItem.addEventListener('drop', (event) =>{
      event.preventDefault();
      event.stopPropagation();
      redItem.style.order = activeItemIndex;
      activeElement.style.order = redItemIndex;
    })
  })
   
  gameItems.forEach(element => element.addEventListener('dragend', (event) => {
    event.target.classList.remove(`selected`);

    if(event.target.style.order !== ItemDragStartIndex){
      moves++
      movesNum.textContent = moves;
    }
    
    checkItemsOrder()
  }));
}

function checkItemsOrder() {
  let items = gameBox.childNodes;
  let count = 0;
  
  for(let i = 0; i < items.length - 1; i++){
    let currentItem = items[i];
    if(+(currentItem.style.order) === i){
      count = count + 1;
      console.log(count);
    }
    if(count === (items.length - 1)){
      isWin= true;
    }
  } 

  if(isWin){
      startAndStop();
      items.forEach(e => {
        e.draggable = '';
      })
      alert('Win!')
      saveBtn.classList.add('menu-item');
      saveBtn.classList.remove('menu-item-disabled')
      startBtn.classList.add('menu-item-disabled');
      startBtn.classList.remove('menu-item');
    }
}
