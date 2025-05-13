let currentIndex = 0;
  const carousel = document.querySelector('.carousel');
  const form = document.getElementById('form');
  const nomeInput = document.getElementById('nome');
  const telefoneInput = document.getElementById('telefone');
  const idadeInput = document.getElementById('idade');

  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  renderCarousel();

  function moveSlide(step) {
    const totalItems = registros.length;
    currentIndex = (currentIndex + step + totalItems) % totalItems;
    renderCarousel();
  }

  function renderCarousel() {
    carousel.innerHTML = '';
    if (registros.length > 0) {
      const item = registros[currentIndex];
      if (item.idade > 0 && item.idade < 110) {
        alert("Idade inválida. Digite um valor entre 0 e 110.");
        return;
      }
      const div = document.createElement('div');
      div.classList.add('carousel-item');
      div.innerHTML = `
          <p><strong>Nome:</strong> ${item.nome}</p>
          <p><strong>Telefone:</strong> ${item.telefone}</p>
          <p><strong>Idade:</strong> ${item.idade} anos</p>
          <button onclick="deleteItem(${currentIndex})">Excluir</button>
      `;
      carousel.appendChild(div);
    } else {
      const emptyMessage = document.createElement('div');
      emptyMessage.classList.add('carousel-item');
      emptyMessage.innerHTML = '<p>Nenhum registro cadastrado.</p>';
      carousel.appendChild(emptyMessage);
    }
  }

  function deleteItem(index) {
    registros.splice(index, 1);

    localStorage.setItem('registros', JSON.stringify(registros));
    if (currentIndex >= registros.length && registros.length > 0) {
      currentIndex = registros.length - 1;
    } else if (registros.length === 0) {
      currentIndex = 0;
    }
    renderCarousel();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const idade = idadeInput.value.trim();

    if (nome && telefone && idade) {
      registros.push({ nome, telefone, idade: parseInt(idade) });
      localStorage.setItem('registros', JSON.stringify(registros));
      nomeInput.value = '';
      telefoneInput.value = '';
      idadeInput.value = '';
      renderCarousel();
    } else {
      alert('preenchimento obrigatório');
    }
  });
