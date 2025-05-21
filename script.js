class CarouselRegistro {
  constructor(carouselSelector, formId, nomeId, telefoneId, idadeId) {
    this.carousel = document.querySelector(carouselSelector);
    this.form = document.getElementById(formId);
    this.nomeInput = document.getElementById(nomeId);
    this.telefoneInput = document.getElementById(telefoneId);
    this.idadeInput = document.getElementById(idadeId);
    this.registros = JSON.parse(localStorage.getItem('registros')) || [];
    this.currentIndex = 0;
    this.editingIndex = undefined; // Adicionado para rastrear o item sendo editado
    this.botaoSalvar = this.form.querySelector('button[type="submit"]'); // Obtém o botão Salvar

    this.renderCarousel();
    this.setupEventListeners();
  }

  moveSlide(step) {
    const totalItems = this.registros.length;
    this.currentIndex = (this.currentIndex + step + totalItems) % totalItems;
    this.renderCarousel();
  }

  renderCarousel() {
    this.carousel.innerHTML = '';
    if (this.registros.length > 0) {
      const item = this.registros[this.currentIndex];
      const formattedTelefone = this.formatarTelefoneParaDisplay(item.telefone);
      const div = document.createElement('div');
      div.classList.add('carousel-item');
      div.innerHTML = `
          <p><strong>Nome:</strong> ${item.nome}</p>
          <p><strong>Telefone:</strong> ${formattedTelefone}</p>
          <p><strong>Idade:</strong> ${item.idade} anos</p>
          <button onclick="carouselRegistro.editItem(${this.currentIndex})">Editar</button>
          <button onclick="carouselRegistro.deleteItem(${this.currentIndex})">Excluir</button>
      `;
      this.carousel.appendChild(div);
    } else {
      const emptyMessage = document.createElement('div');
      emptyMessage.classList.add('carousel-item');
      emptyMessage.innerHTML = '<p>Nenhum registro cadastrado.</p>';
      this.carousel.appendChild(emptyMessage);
    }
  }

  formatarTelefoneParaDisplay(numero) {
    let formattedNumber = '';
    const cleanedNumber = numero.replace(/\D/g, '');

    if (cleanedNumber.length >= 2) {
      formattedNumber += '(' + cleanedNumber.substring(0, 2) + ')';
      if (cleanedNumber.length > 2) {
        formattedNumber += ' ';
        if (cleanedNumber.length > 7) {
          formattedNumber += cleanedNumber.substring(2, 7) + '-' + cleanedNumber.substring(7, 11);
        } else {
          formattedNumber += cleanedNumber.substring(2);
        }
      }
    } else {
      formattedNumber = cleanedNumber;
    }
    return formattedNumber;
  }

  editItem(index) {
    const itemToEdit = this.registros[index];
    this.nomeInput.value = itemToEdit.nome;
    this.telefoneInput.value = itemToEdit.telefone;
    this.idadeInput.value = itemToEdit.idade;
    this.editingIndex = index;
    this.botaoSalvar.textContent = 'Atualizar'; // Muda o texto do botão para indicar edição
  }

  deleteItem(index) {
    this.registros.splice(index, 1);
    localStorage.setItem('registros', JSON.stringify(this.registros));
    if (this.currentIndex >= this.registros.length && this.registros.length > 0) {
      this.currentIndex = this.registros.length - 1;
    } else if (this.registros.length === 0) {
      this.currentIndex = 0;
    }
    this.renderCarousel();
  }

  handleSubmit(e) {
    e.preventDefault();
    const nome = this.nomeInput.value.trim();
    const telefone = this.telefoneInput.value.trim().replace(/\D/g, '');
    const idade = this.idadeInput.value.trim();

    if (nome && telefone && idade) {
      if (this.editingIndex !== undefined) {
        // Atualiza um registro existente
        this.registros[this.editingIndex] = { nome, telefone, idade: parseInt(idade) };
        localStorage.setItem('registros', JSON.stringify(this.registros));
        delete this.editingIndex; // Limpa o índice de edição
        this.botaoSalvar.textContent = 'Salvar'; // Restaura o texto do botão
      } else {
        // Adiciona um novo registro
        this.registros.unshift({ nome, telefone, idade: parseInt(idade) });
        localStorage.setItem('registros', JSON.stringify(this.registros));
        this.currentIndex = 0;
      }
      this.nomeInput.value = '';
      this.telefoneInput.value = '';
      this.idadeInput.value = '';
      this.renderCarousel();
    } else {
      alert('preenchimento obrigatório');
    }
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.nomeInput.addEventListener('input', () => primeiraMaiuscula(this.nomeInput));
    this.telefoneInput.addEventListener('input', () => formatarTelefone(this.telefoneInput));
  }
}

const carouselRegistro = new CarouselRegistro('.carousel', 'form', 'nome', 'telefone', 'idade');

function nextSlide() {
  carouselRegistro.moveSlide(1);
}

function prevSlide() {
  carouselRegistro.moveSlide(-1);
}

function formatarTelefone(input) {
  let numero = input.value.replace(/\D/g, '');
  let formattedNumber = '';

  if (numero.length > 0) {
    formattedNumber += '(' + numero.substring(0, 2);
    if (numero.length > 2) {
      formattedNumber += ') ';
      if (numero.length > 2 + 5) {
        formattedNumber += numero.substring(2, 2 + 5) + '-' + numero.substring(2 + 5, 2 + 5 + 4);
      } else {
        formattedNumber += numero.substring(2);
      }
    } else {
      formattedNumber = '(' + numero;
    }
  }
  input.value = formattedNumber;
}

function primeiraMaiuscula(input) {
  input.value = input.value
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}
