class CalcController {

    constructor(){

        this._lastOperator - '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.getElementById("display");
        this._dateEl = document.getElementById("data");
        this._timeEl = document.getElementById("hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize() {
        this.setDisplayDateTime();


        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
        //Inicializa o valor da calculadora
        this.setLastNumberToDisplay();
    }

    initKeyboard() {

        document.addEventListener('keyup', e=> {

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseFloat(e.key));
                    break;
            }
        });
    }

    addEventListenerAll(element, events, fn) {
        
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clearAll() {
        this._operation = [0];
        this._lastNumber = '';
        this.lastOperator = '';

        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return ['+', '-', '*', '%', '/'].indexOf(value) > -1;
    }

    pushOperation(value) {

        this._operation.push(value);
        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult() {

        return eval(this._operation.join(""));

    }
     
    calc() {
        
        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        console.log('_lastOperation', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult();

        if (last == '%') {
            result /= 100;
            this._operation = [result];
        } else {

            this._operation = [result];

            if (last) {
                this._operation.push(last);
            }

        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {

        let lastItem;
        //Changed for method to for..of -- And it WORKS!
        for (const op of this._operation) {
            if (this.isOperator(op) == isOperator) {
                lastItem = op;
                break;
            }
          }
        
        /* OLD FOR method replaced with new FOr..OF
         for(let i = this._operation.length-1;i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }*/
        if (!lastItem) {
            
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            //String
            if (this.isOperator(value)) {
                //troca o operador
                this.setLastOperation(value);
                
            } else {
                //Outra coisa
                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();
            }

        }
      //  console.log(this._operation);
    }
    setError() {

        this.displayCalc = 'Error';

    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation  === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value) {
        
        switch (value) {

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(value));
                break;

            default: 
                this.setError();
                break;


        }

    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        console.log(buttons);

        buttons.forEach((btn,index) =>{


            this.addEventListenerAll(btn, 'click drag', e => {

                let textBtn = btn.className.baseVal.replace("btn-", "");
                
                this.execBtn(textBtn);
                
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        })

    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit", 
            month: "long", 
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }


    get displayCalc() {

        return this._displayCalcEl.innerHTML;
    
    }

    set displayCalc(value) {

        this._displayCalcEl.innerHTML = value;

    }

    get currentDate() {
        return new Date();
    }
    
    set currentDate(value) {
        this._currentDate = value;
    }

}