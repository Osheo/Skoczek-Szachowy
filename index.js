$('.modal').modal({
    onCloseEnd: function() {
        location.reload();
    }
});

let cards = document.querySelectorAll('.card');
const dimension = 5;
let tab = [];
let speed = 10;
let speedElement = document.querySelector('#speed');
speedElement.innerHTML = `Prędkość: ${speed}`;

for (let i = 0; i < dimension; i++) {
    tab[i] = document.querySelectorAll(`.card${i}`);
    for (let j = 0; j < tab[i].length; j++) {
        tab[i][j].visitedNumber = 0;
        tab[i][j].addEventListener('click', async function() {
            tab[i][j].visitedNumber = 1;
            await drawMove(tab[i][j]);
            nextMove(i, j, 2);
        });
    }
}

const possibleMoves = [
    {
        x: -1,
        y: 2
    },
    {
        x: 1,
        y: 2
    },
    {
        x: 2,
        y: 1
    },
    {
        x: 2,
        y: -1
    },
    {
        x: 1,
        y: -2
    },
    {
        x: -1,
        y: -2
    },
    {
        x: -2,
        y: -1
    },
    {
        x: -2,
        y: 1
    }
];

let ifEnd = false;
async function nextMove(row, column, index) {
    let k = 0;
    do {
        let newY = row + possibleMoves[k].y;
        let newX = column + possibleMoves[k].x;
        if (newY >= 0 && newX >= 0 && newY < dimension && newX < dimension && tab[newY][newX].visitedNumber == 0) {
            tab[newY][newX].visitedNumber = index;
            await drawMove(tab[newY][newX]);
            if (index < dimension * dimension) {
                let result = await nextMove(newY, newX, index + 1);
                if (!result) {
                    tab[newY][newX].visitedNumber = 0;
                    await undoMove(tab[newY][newX]);
                }
            } else {
                ifEnd = true;
            }
        }
        k++;
        if (k == 8) {
            return false;
        }
    } while (!ifEnd);
    if (dimension * dimension == index) {
        await showModal();
    }
}

const showModal = () => {
    return new Promise(() => {
        setTimeout(() => {
            $('.modal').modal('open');
        }, 500);
    });
};

const getSpeed = (value) => {
    speed = value;
    speedElement.innerHTML = `Prędkość: ${speed}`;
};

const drawMove = (object) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(object.visitedNumber);
            object.classList.add('activeCard');
            object.innerHTML = `<p>${object.visitedNumber}</p>`;
            setTimeout(function() {
                object.classList.remove('activeCard');
            }, 6000 * (1 / speed));
            resolve('true');
        }, 7000 * (1 / speed));
    });
};

const undoMove = (object) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            object.classList.add('activeCard');
            object.innerHTML = `<p></p>`;
            setTimeout(function() {
                object.classList.remove('activeCard');
            }, 6000 * (1 / speed));
            resolve('true');
        }, 7000 * (1 / speed));
    });
};
