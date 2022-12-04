
// Створюємо клас Table, що рендерить таблицю для гри

class Table {

    constructor(number, parent) {
        this.number = number;
        this.parent = parent;
        this.table = document.createElement('table');
    }

    render() {
        this.table.className = 'game__table';
        for (let i = 1; i <= this.number; i++) {
            let row = document.createElement('tr');
            row.className = 'game__row';
            for (let j = 1; j <= this.number; j++) {
                let cell = document.createElement('td');
                cell.className = 'game__cell';
                row.append(cell);
            }
            this.table.append(row);
        }
        this.parent.append(this.table);
    }

    delete() {
        this.table.remove();
    }
}

// Створюємо клас ColoredCell, що малює кольорові комірки

class ColoredCell {

    constructor(cell, color) {
        this.cell = cell;
        this.color = color;
    }

    render() {

        if (this.color === 'blue') {
            this.cell.classList.add('game__cell--blue');
            this.cell.classList.remove('game__cell--green', 'game__cell--red');
        }

        if (this.color === 'green') {
            this.cell.classList.add('game__cell--green');
            this.cell.classList.remove('game__cell--blue', 'game__cell--red');
        }

        if (this.color === 'red') {
            this.cell.classList.add('game__cell--red');
            this.cell.classList.remove('game__cell--green', 'game__cell--blue');
        }
    }
}

// Створюємо класс Player 

class Player {

    constructor(name) {
        this._name = name;
        this._score = 0;
    }

    get name() {
        return this._name;
    }

    set score(value) {
        this._score = value;
    }

    get score() {
        return this._score;
    }

}
// Створюємо класс User, що наслідує від класу Player і рендерить людину - гравця

class User extends Player {

    constructor(name, parent) {
        super(name);
        this.parent = parent;
        this.divPlayerContainer = document.createElement("div");
        this.spanPlayerName = document.createElement("span");
        this.spanPlayerScore = document.createElement("span");
    }

    render() {
        this.divPlayerContainer.classList.add('game__player', 'game__player--user');
        this.spanPlayerName.textContent = this._name;
        this.spanPlayerScore.textContent = this._score;
        this.divPlayerContainer.append(this.spanPlayerName, this.spanPlayerScore);
        this.parent.append(this.divPlayerContainer);
    }

    renderScore() {
        this.spanPlayerScore.textContent = this._score;
    }

    delete() {
        this.divPlayerContainer.remove();
    }
}
// Створюємо класс Computer, що наслідує від класу Player і рендерить компьютер

class Computer extends Player {

    constructor(name, parent) {
        super(name);
        this.parent = parent;
        this.divPlayerContainer = document.createElement("div");
        this.spanPlayerName = document.createElement("span");
        this.spanPlayerScore = document.createElement("span");
    }

    render() {
        this.divPlayerContainer.classList.add('game__player', 'game__player--computer');
        this.spanPlayerName.textContent = this._name;
        this.spanPlayerScore.textContent = this._score;
        this.divPlayerContainer.append(this.spanPlayerName, this.spanPlayerScore);
        this.parent.append(this.divPlayerContainer);
    }

    renderScore() {
        this.spanPlayerScore.textContent = this._score;
    }

    delete() {
        this.divPlayerContainer.remove();
    }
}

// Створюємо класс Game, що містить весь необхідний функціонал для гри

class Game {

    constructor(diff, num, gameStartForm) {
        this.diff = diff;
        this.gameStartForm = gameStartForm;
        this.num = num;
        this.game = document.querySelector('.game');
        this.tableContent = document.querySelector('.game__content');
        this.user = new User('Гравець', this.game);
        this.computer = new Computer('Компьютер', this.game);
        this.table = new Table(this.num, this.tableContent);
        this.cells = null;
        this.timer = null;
        this.interval = null;
    }

    // Метод стартує безпосередньо гру після кліку на кнопку "Старт"
    gameStart() {

            this.gameStartForm.classList.add('invisible');
            this.user.render();
            this.computer.render();
            this.table.render();

            this.cells = Array.from(document.querySelectorAll('.game__cell'));
            this.timer = this._timerValue(this.diff);

            this.interval = setInterval(() => {
                const obj = {
                    table: this.table,
                    tableContent: this.tableContent,
                    gameStartForm: this.gameStartForm,
                    cells: this.cells,
                    timer: this.timer,
                    number: this.table.number,
                    interval: this.interval,
                    user: this.user,
                    computer: this.computer,
                };
                this._gameLogic(obj);
            }, this.timer);

    }

    // Допоміжна функція - логіка гри
    _gameLogic(obj) {
        const {table, tableContent, gameStartForm, cells, timer, number, interval, user, computer} = obj;
        const runNumber = this._rundomNumber(cells.length);
        const currentCell = cells[runNumber];

        this._gameAction(currentCell, timer, user, computer);
        this._deleteCell(runNumber, cells);
        const finalScore = Math.round((number * number) / 2 - 2);

        if (computer.score === finalScore || user.score === finalScore) {

            clearInterval(interval);
            setTimeout(() => {
                const h2Winner = document.createElement('h2');
                if (computer.score > user.score) {
                    const winner = 'Компьютер переміг!';
                    h2Winner.innerHTML = winner;
                    h2Winner.classList.add('game__winner', 'game__winner--computer');
                } else {
                    const winner = 'Гравець переміг!';
                    h2Winner.innerHTML = winner;
                    h2Winner.classList.add('game__winner', 'game__winner--user');
                }
                computer.delete();
                user.delete();
                table.delete();
                tableContent.append(h2Winner);
                gameStartForm.classList.remove('invisible');
            }, 3000);
        };

    }

    // Допоміжна функція - змінює колір комірок і змінює рахунок
    _gameAction(cell, timer, user, computer) {

        // Підсвічуємо комірку синім
        new ColoredCell(cell, 'blue').render();

        let time = setTimeout(() => {
            new ColoredCell(cell, 'red').render();
            cell.removeEventListener('mousedown', eventHeandle);
        }, timer);

        setTimeout(() => {
            this._scoreChange(user, computer);
            computer.renderScore();
            user.renderScore();
        }, timer);

        cell.addEventListener('mousedown', eventHeandle);


        function eventHeandle() {
            clearTimeout(time);
            new ColoredCell(cell, 'green').render();
        }

    }

    // Допоміжна функція для зміни рахунку користувача та компьютера
    _scoreChange(user, computer) {
        const coloredInRed = Array.from(document.querySelectorAll('.game__cell--red'));
        const coloredInGreen = Array.from(document.querySelectorAll('.game__cell--green'));

        user.score = coloredInGreen.length;
        computer.score = coloredInRed.length;
    }

    // Допоміжна функція - повертає рандомне число з урахуванням num
    _rundomNumber(num) {
        return Math.floor(Math.random() * num);
    }

    // Допоміжна функція - видаляє обрану комірку з масиву
    _deleteCell(num, array) {
        array.splice(num, 1);
    }

    // Допоміжна функція - повертає значення таймера в залежності від обраної складності гри
    _timerValue() {
        switch (this.diff) {
            case 'light': return 1500;
            case 'medium': return 1000;
            case 'hard': return 500;
        }
    }

}

// Функція запускається одразу на сторінці, вішає EventListener на кнопку Старту, виконує підготовчі дії перед запуском гри безпосередньо

function gameStarter() {
    const gameStartForm = document.querySelector('.game__start');
    const gameDiffSelect = document.querySelector('.game__start-diff');

    gameStartForm.addEventListener('submit', e => {
        const diff = gameDiffSelect.value;
        const gameWinner = document.querySelector('.game__winner');

        // Розмір таблиці для гри в даному випадку 10Х10
        const num = 10;

        const game = new Game(diff, num, gameStartForm);

        if(gameWinner) gameWinner.remove();
        game.gameStart();
        e.preventDefault();
    });
}

gameStarter();




