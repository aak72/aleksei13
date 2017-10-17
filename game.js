'use strict';

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Прибавлять к вектору можно только данные типа Vector');
        }
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    times(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
}

class Actor {
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        if (!(pos instanceof Vector && size instanceof Vector && speed instanceof Vector)) {
            throw new Error('Все параметры должны быть объектоми типа Vector');
        }

        this.pos = pos;
        this.size = size;
        this.speed = speed;
    }

    get type() {
        return 'actor';
    }

    get left() {
        return this.pos.x;
    }

    get top() {
        return this.pos.y;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    act() {}

    isIntersect(obj) {
        if (!(obj instanceof Actor)) {
                // SyntaxError
                // Алексей: исправил
            throw new Error('Нужно передать движущийся объект типа Actor');
        }

            // obj === this можно выделить в отдельную проверку
            // Алексей: исправил
            // остальные условия можно обратить чтобы написать сразу return <expr>
            // Алексей: не смог понять и применить :(

        if (obj === this) {
            return false;
        }
            /*
            if (obj.left >= this.right || obj.right <= this.left || obj.top >= this.bottom || obj.bottom <= this.top) {
                return false;
            }
            return true;
            */
            // Алексей: исправил
        return (!(obj.left >= this.right || obj.right <= this.left || obj.top >= this.bottom || obj.bottom <= this.top));
    }
}

class Level {
    constructor(grid = [], actors = []) {
        // тут лучше создать копии массивов, чтобы поля класса нельзя было изменить извне
        // Алексей: исправил
        //this.grid = grid;
        this.grid = grid.slice();
        //this.actors = actors;
        this.actors = actors.slice();
        this.height = this.grid.length;
        this.player = this.actors.find(actor => actor.type === 'player');
        this.status = null;
        this.finishDelay = 1;
        // здесь можно написать красиво через Math.max и .map
        //this.width = grid.reduce((width, line) => line.length > width ? line.length : width, 0);
        // Алексей: исправил
        this.width = this.height > 0 ? Math.max.apply(Math, this.grid.map(function(el) {
            return el.length;
        })) : 0;
    }

    isFinished() {
        // тут ошибка
        // Алексей: исправил
        /*
        if (this.status !== null && this.finishDelay < 0) {
            return true;
        }
        return false;
        */
        return this.status !== null && this.finishDelay < 0;
    }

    actorAt(actor) {
        // эту проверку, в принципе, можно опустить
        if (!(actor instanceof Actor)) {
            // SyntaxError
            // Алексей: исправил
            throw new Error('Необходимо использовать объект типа Actor');
        }
        // .find
        // Алексей: исправил
        /*
        for (let i = 0; i < this.actors.length; i++) {
            let obj = this.actors[i];
            if (actor.isIntersect(obj) && actor !== obj) {
                return obj;
            }
        }
        return undefined;
        */
        return this.actors.find(elem => actor.isIntersect(elem));
    }

    obstacleAt(nextPos, size) {
        if (!(nextPos instanceof Vector) || !(size instanceof Vector)) {
            // SyntaxError
            // Алексей: исправил
            throw new Error('Прибавлять к вектору можно только данные типа Vector');
        }

        if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x + size.x > this.width) {
            return 'wall';
        }

        if ((nextPos.y + size.y) >= this.height) {
            return 'lava';
        }

        // почему let? Значение этих переменных не меняется ведь
        // Алексей: исправил
        const xMin = Math.floor(nextPos.x);
        const xMax = Math.ceil(nextPos.x + size.x);
        const yMin = Math.floor(nextPos.y);
        const yMax = Math.ceil(nextPos.y + size.y);
        for (let y = yMin; y < yMax; y++) {
            for (let x = xMin; x < xMax; x++) {
                const cell = this.grid[y][x]
                if (cell) return cell;
            }
        }
    }

    removeActor(actor) {
        let index = this.actors.indexOf(actor);
        if(index !== -1) {
            this.actors.splice(index, 1);
        }
    }

    noMoreActors(type) {
        // можно в одну строчку с использованием .some
        // Алексей: исправил
        /*
        if (this.actors.length === 0) {
            return true;
        }
        for (let actorIn of this.actors) {
            if (actorIn.type === type) {
                return false;
            }
        }
        return true;
        */
        return !this.actors.some(elem => elem.type === type);
    }

    playerTouched(obstacle, coin) {
        if (this.status !== null) {
            return;
        }

        if (obstacle === 'lava' || obstacle === 'fireball') {
            this.status = 'lost';
            // здесь можно написать return и убрать else
            // Алексей: исправил
        } //else if (obstacle === 'coin') {

        if (obstacle === 'coin') {
            this.removeActor(coin);
            if(this.noMoreActors('coin')) {
                this.status = 'won';
            }
        }
    }
}

class LevelParser {
    // некорректное значение по-умолчанию
    // Алексей: решил всё переписать по-другому - пришлось долго повозиться )

    constructor (dictionary = {}) {
        this.dictionary = dictionary;
        this.obstacle = {
            'x': 'wall',
            '!': 'lava'
        };
    }

    actorFromSymbol(symbol) {
        // очень странная проверка
        // Алексей: исправил
        /*
        if (symbol == Object.keys(this.dictionaryActors)) {
            return this.dictionaryActors[symbol];
        }
        return undefined;
        */
        return this.dictionary[symbol];
    }


    //actorFromSymbol(symbol) {
        //return this.dictionary[symbol];
    //}
    /*
    obstacleFromSymbol(symbol) {
        // может быть switch был бы здесь уместнее?
        if (symbol === 'x') {
            return 'wall';
        }
        if (symbol === '!') {
            return 'lava';
        }
        // это можно не писать - undefined возвращается и так
        return undefined;
    }
    */
    obstacleFromSymbol(symbol) {
        return this.obstacle[symbol];
    }
    /*
    createGrid(array) {
        let grid = [];
        // форматирование поехало // исправил
        // записывается короче с помощью .max
        array.forEach(row => {
            let line = row.split('');
            for (let cell of line) {
            // дублирование obstacleFromSymbol
                if (cell === 'x') {
                    line[line.indexOf(cell)] = 'wall';
                } else if (cell === '!') {
                    line[line.indexOf(cell)] = 'lava';
                } else {
                    line[line.indexOf(cell)] = undefined;
                }
            }
        grid.push(line);
    });
        return grid;
    }
    */
    createGrid(arr) {
        return arr.map(elemY => elemY.split('').map(elemX => this.obstacle[elemX]));
    }
    /*
    createActors(array) {
        let grid = [];
        let indexY = 0;
        // поехало форматирование и вообще непонятно что происходит // форматирование исправил
        // line[line.indexOf(cell)] - зачем это?
        array.forEach(row => {
            let line = row.split('');
            let y = indexY++;
            line.forEach(cell => {
                if (cell === line[line.indexOf(cell)] && cell === line[line.indexOf(cell)] && typeof (this.dictionaryActors[line[line.indexOf(cell)]]) === 'function' && (new this.dictionaryActors[line[line.indexOf(cell)]]() instanceof Actor)) {
                    grid.push(new this.dictionaryActors[line[line.indexOf(cell)]]((new Vector (line.indexOf(cell), y))));
                    line[line.indexOf(cell)] = this.dictionaryActors;
                }
            });
        });
        return grid;
    }
    */
    createActors(arr = []) {
        let { dictionary } = this;
        let actors = [];

        arr.forEach((elemY, y) => elemY.split('').forEach((elemX, x) => {
            let key = dictionary[elemX];
            if (typeof key !== 'function') {
                return;
            }

            let obj = new key(new Vector(x, y));
            if (obj instanceof Actor) {
            actors.push(obj);
            }
        }));
        return actors;
    }

    parse(arr) {
        return new Level(this.createGrid(arr), this.createActors(arr));
    }
}

class Fireball extends Actor {
    // не стоит использовать конструктор Vector по-умолчанию, его кто-нибудь может поменять и всё сломается
    // Алексей: исправил
    /*
    constructor(pos = new Vector(), speed = new Vector()) {
        super(pos);
        // pos, size и speed должны задаваться через конструктор родителя
        // мутировать объект плохо
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.speed.x = speed.x;
        this.speed.y = speed.y;
        // объявить просто свойством класса
        Object.defineProperty(this, "type", {
            value: 'fireball',
            writable: false,
        });
    }
    */
    constructor(pos, speed) {
        super(pos, new Vector(1, 1), speed);
    }

    get type() {
        return 'fireball';
    }
    /*
    getNextPosition(time = 1) {
        return new Vector (this.speed.x*time+this.pos.x, this.speed.y*time+this.pos.y);
    }
    */
    getNextPosition(time = 1) {
        return this.pos.plus(this.speed.times(time));
    }
    /*
    handleObstacle() {
        // мутировать объекты плохо
        this.speed.x *= -1;
        this.speed.y *= -1;
    }
    */
    handleObstacle() {
        this.speed = this.speed.times(-1);
    }
    /*
    act(time, level) {
        let nextPosition = this.getNextPosition(time);
        let obstacle = level.obstacleAt(nextPosition, this.size);
        if (obstacle) {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    }
    */
    act(time, level) {
        let nextPos = this.getNextPosition(time);
        let obstacle = level.obstacleAt(nextPos, this.size);

        if(obstacle) {
            this.handleObstacle();
        } else {
            this.pos = nextPos;
        }
    }
}

class HorizontalFireball extends Fireball {
    // было бы хорошо значение по-умолчанию добавить
    // Алексей: исправил
    /*
    constructor(position) {
        super(position);
        // мутировать плохо и должно задаваться через базовый конструктор
        // Алексей: исправил
        this.speed.x = 2;
        this.speed.y = 0;
    }
    */
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(2, 0));
    }
}

class VerticalFireball extends Fireball {
    // значение по-умолчанию
    // Алексей: исправил
    /*
    constructor(position) {
        super(position);
        // мутировать плохо и должно задаваться через базовый конструктор
        // Алексей: исправил
        this.speed.x = 0;
        this.speed.y = 2;
    }
    */
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(0, 2));
    }
}

class FireRain extends Fireball {
    // значение по-умолчанию
    // Алексей: исправил
    /*
    constructor(position) {
        super(position);
        // мутировать плохо и должно задаваться через базовый конструктор
        // Алексей: исправил
        this.speed.x = 0;
        this.speed.y = 3;
        this.startPos = position;
    }
    handleObstacle() {
        this.pos = this.startPos;
    }
    */
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(0, 3));
        this.startPos = pos;
    }

    handleObstacle() {
        this.pos = this.startPos;
    }
}

class Coin extends Actor {
    // конструктор принимает 1 аргумент
    // Алексей: исправил
    /*
    constructor(position = new Vector(), size = new Vector(0.6, 0.6)) {
        super(position, size);
        // поле лучше назвать как-нибудь по-другому: basePos, например
        // Алексей: исправил
        this.position = position;
        // должно задаваться через конструктор
        // Алексей: исправил
        this.pos.x += 0.2;
        this.pos.y += 0.1;
        this.spring = Math.random() * Math.PI * 2;
        this.springSpeed = 8;
        this.springDist = 0.07;
        // свойство класса
        // Алексей: исправил
        Object.defineProperty(this, "type", {
            value: 'coin',
        });
    }
    */
    constructor(pos = new Vector(1, 1)) {
        super(new Vector(pos.x + 0.2, pos.y + 0.1), new Vector(0.6, 0.6));
        this.beginPos = pos;
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random() * Math.PI * 2;
    }

    get type() {
        return 'coin';
    }

    updateSpring(time = 1) {
        // скобки лишние
        // Алексей: исправил
        //this.spring = this.spring + this.springSpeed * time;
        this.spring += this.springSpeed * time;
    }

    getSpringVector() {
        // лишние скобки :)
        // Алексей: исправил
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    }

    getNextPosition(time = 1) {
        this.updateSpring(time);
        // объявили переменную и не используете
        // Алексей: исправил
/*
        const newVector = this.getSpringVector();
        return this.position.plus(this.getSpringVector());
*/
        let springVector = this.getSpringVector();
        return new Vector(this.pos.x, this.pos.y + springVector.y * time);
    }

    act(time) {
        this.pos = this.getNextPosition(time);
    }
}

class Player extends Actor {
        // Алексей: исправил
        /*
        constructor(pos = new Vector(0,0)) {
        super(pos, new Vector(0.8, 1.5));
        // должно задаваться через родительский конструктор
        this.pos.y = pos.y - 0.5;
        // свойство класса
        Object.defineProperty(this, "type", {
            value: 'player',
        });
    }
        */
    constructor(pos = new Vector(1, 1)) {
        super(new Vector(pos.x, pos.y - 0.5), new Vector(0.8, 1.5));
    }

    get type() {
        return 'player';
    }
}

const actorDict = {
    '@': Player,
    'v': FireRain,
    '=': HorizontalFireball,
    '|': VerticalFireball,
    'o': Coin
};  // тут точка с запятой должна быть :) //
    // Алексей: исправил
const parser = new LevelParser(actorDict);

loadLevels()
    .then(schemas => runGame(JSON.parse(schemas), parser, DOMDisplay))
    // форматирование (отступы забыли)
    // Алексей: исправил
    .then(() => alert('Вы выиграли приз!'))
    .catch(err => alert(err));
