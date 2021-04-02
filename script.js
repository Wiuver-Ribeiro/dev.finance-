
// Modal-overlay
const Modal = {
  open() {
    document.querySelector('.modal-overlay')
      .classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay')
      .classList.remove('active');
  }
};

//LocalStorage
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transaction')) || [];
  },
  set(transactions) {
    // primeiro nome de identificação | valor em si
    //Ele guarda no localStorage uma string
    localStorage.setItem('dev.finances:transaction', JSON.stringify(transactions));
  },
}


//transaction

//Transaction
const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    // somar as entradas
    let income = 0;
    //Para cada transação
    Transaction.all.forEach((transaction) => {
      //Se ela for maior do que zero
      if (transaction.amount > 0) {
        //soma o valor da transação a variável income
        income += transaction.amount
      }
    })
    return income;
  },
  expenses() {
    // somar as saídas
    let expense = 0;
    //Para cada transação
    Transaction.all.forEach((transaction) => {
      //Se ela for menor do que zero
      if (transaction.amount < 0) {
        //soma o valor das saídas e coloque em expense
        expense += transaction.amount
      }
    })
    return expense;
  },
  total() {
    // entradas - saidas = total
    return Transaction.incomes() + Transaction.expenses();
  }
};

const DOM = {

  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index) {

    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const amount = Utils.formatCurrency(transaction.amount);
    //  const transactions = localStorage.getItem('transactionn');
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${transaction.amount < 0 ? 'expense' : 'income'}"> ${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" onclick="Transaction.remove(${index})" title="remove transaction" alt="Remover transação" >
      </td>
   `;
    return html; //Retornando os valores para outra função
  },

  updatebalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransaction() {
    DOM.transactionsContainer.innerHTML = "";
  }
}


const Utils = {
  formatAmount(value) {
    value = Number(value) * 100; //Maneira simples
    // value = Number(value.replace(/\,\./g, "")) * 100; //Maneira complexa;
    return value;
  },

  formatDate(date) {
    const splitteDate = date.split("-");
    return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "") //Pega tudo que for diferente de numero e coloca "";
    value = Number(value) / 100;
    value = value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    return signal + value;
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  validateField() {
    const { description, amount, date } = Form.getValues();
    if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    } else {
      console.log('Dados enviados corretamente...')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date,
    }
  },

  saveTransaction(transaction) {
    Transaction.add(transaction);
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();
    try {
      //Verificar se todos as informações foram preenchidas
      Form.validateField();
      //Formatat os dados do formulário
      const transaction = Form.formatValues();
      //Salvar transaction
      Form.saveTransaction(transaction);
      //Apagar os dados do formulário
      Form.clearFields();
      //Fechar modal
      Modal.close();
      //Atualizar a aplicação
      App.reload();
    } catch (error) {
      alert(error.message);
    }
  },
}


const App = {
  init() {
    //Chamando a função de mostrar as transactions
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    //Atualizar o balance
    DOM.updatebalance();

    //Salvar as transaction no localStorage
    Storage.set(Transaction.all);
    //Reload no Tema
    reloadDarkTheme();
  },
  reload() {
    DOM.clearTransaction();

    //Reload no tema da aplicação
    reloadDarkTheme();
    App.init();
  }
};

//DARK and LIGHT MODE
const Mode = {
  toggleMode() {
    document.querySelector("body").classList.toggle('dark-mode-body');
    document.querySelector("header").classList.toggle('dark-mode-header');
    Mode.modeCard();
    Mode.modeTable();
    document.querySelector("footer").classList.toggle('dark-mode-footer');
  },
  modeCard() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.toggle('dark-mode-card')
    })
  },
  modeTable() {
    const tableTd = document.querySelectorAll("table td")
    tableTd.forEach((td) => {
      td.classList.toggle('dark-mode-table');
    })
  },
}


//Função acionado toda vez que carregar;
function reloadDarkTheme() {

  if(localStorage.darkMode=="true") {
    Mode.toggleMode();
    document.getElementById("switch").checked=true;
  }
};
document.getElementById("switch").addEventListener('change', () => {
  localStorage.darkMode=(localStorage.darkMode=="true")?"false":"true";
});


const Hide = {
  showDetails(id_image, id_element, src, icon_1,icon_2) {
    const newImg = document.getElementById(`${id_image}`);
    const newTextDisplay = document.querySelector(`#${id_element}`);
    newTextDisplay.innerHTML = "---------";
    newImg.src = src ? `./assets/${icon_1}` : Hide.showIcon().Icone ; 
  },
  showIcon() {
    Icone: './assets/income.svg';
    document.querySelector('#incomeDisplay').innerHTML = Transaction.incomes();
  },
}

App.init();
