import { Component } from '@angular/core';
import { cards } from '../cards';
import { CloneService } from '../clone.service'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent {
  cards = cards;

  constructor(private cloneService: CloneService) {}

  gameCards = [];
  currentCardsInPlay = 0;
  lastFlippedCard;

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }

  /*On new game, create a pair for
  every stored card then randomize the order*/
  newGame() {
    this.gameCards = [];
  	for (let card of this.cards) {
      this.gameCards.push(card);
      this.gameCards.push(this.cloneService.deepClone(card));
  	}
    this.gameCards = this.shuffleArray(this.gameCards);
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  onClick(card) { 
    this.currentCardsInPlay++;

    this.flipCard(card);

    if (this.currentCardsInPlay === 2) {
      this.delay(500).then(any=>{
        this.compareImages(card);
      });
      this.currentCardsInPlay = 0;
    } else {
      this.lastFlippedCard = card;
    }
    
  }

  flipCard(card) {
    let background = card.background;
    card.background = card.image;
    card.image = background;
  }

  compareImages(card) {
    if (card.background === this.lastFlippedCard.background) {
      console.log('they match');
      if (this.gameOver()) {
        console.log('YOU WIN');
      }
    } else {
      this.flipCard(card);
      this.flipCard(this.lastFlippedCard);
      console.log('no match');
    }
  }

  gameOver() {
    var previousImage;
    for (let card of this.gameCards) {
      console.log(card);
      if (!this.previousImage) {
        this.previousImage = card.image;
      }
      if (!(card.image === this.previousImage)) {
        console.log('card image: ' + card.image + ' previous image: ' + this.previousImage);
        return false;
      } 
    }
  }

}