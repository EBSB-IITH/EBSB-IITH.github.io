const cards = document.querySelectorAll(".card");
const moveCountElement = document.getElementById("moveCount");
const userDetailsForm = document.getElementById("userDetailsForm");
const form = document.forms['submit-to-google-sheet'];
const scriptURL = "https://script.google.com/macros/s/AKfycbwruRAe5isQcdGkLL9HcIxKSaoJqM_XzZGNWpZQnAbfslgkPKHmu-tOYOjkgMDMSjT1/exec";

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let moves = 0;

function setFocusOnForm() {
    const firstInput = document.getElementById("fullname"); 
    if (firstInput) {
      firstInput.focus();
    }
  }

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        // matchCards(cardOneImg, cardTwoImg);
        moves++;
        moveCountElement.innerText = moves;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            userDetailsForm.style.display = "block";
            userDetailsForm.style.opacity = "1";
            disableDeck = true;
            document.body.oncontextmenu = "return true";
            document.body.onkeydown = "return true";
            document.body.onmousedown = "return true";
            setFocusOnForm();
            document.getElementById('moves').value = moves;
            form.addEventListener('submit', e => {
                e.preventDefault();
                fetch(scriptURL, {
                    method: 'POST',
                    body: new FormData(form),
                })
                .then(res => res.json())
                .then(data => {
                    alert("Thanks for playing the lucky draw. We will get back to you soon.");
                    setTimeout(function() {
                        window.location.href = "game.html";
                    }, 1000);
                    form.reset();
                })
                .catch(error => console.error('Error!', error.message));
            });
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    moves = 0;
    moveCountElement.innerText = moves;
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

function checkAndShowForm() {
    if (matched === 8) {
        userDetailsForm.style.display = "block";
        userDetailsForm.style.opacity = "1";
        disableDeck = true;
        document.body.oncontextmenu = "return true";
        document.body.onkeydown = "return true";
        document.body.onmousedown = "return true";
        document.getElementById('moves').value = moves;
        form.addEventListener('submit', e => {
            e.preventDefault();
            fetch(scriptURL, {
                method: 'POST',
                body: new FormData(form),
            })
                .then(res => res.json())
                .then(data => {
                    alert("Thanks for playing the lucky draw. We will get back to you soon.");
                    setTimeout(function () {
                        window.location.href = "game.html";
                    }, 1000);
                    form.reset();
                })
                .catch(error => console.error('Error!', error.message));
        });
    }
}

shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

setInterval(checkAndShowForm, 100);