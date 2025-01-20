function createCadastro(nome, dataNascimento, telefone, email) {
  return { nome, dataNascimento, telefone, email };
}

function salvarCadastro(cadastro) {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  cadastros.push(cadastro);
  localStorage.setItem('cadastros', JSON.stringify(cadastros));
}

function exibirCadastros() {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  let lista = cadastros
    .map(
      (cadastro, index) => `
      <li>
          ${cadastro.nome} - ${cadastro.email} 
          <button onclick="deletarCadastro(${index})">Deletar</button>
      </li>
  `
    )
    .join('');

  document.getElementById('lista-cadastros').innerHTML = `<ul>${lista}</ul>`;
}

function deletarCadastro(index) {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  cadastros.splice(index, 1);
  localStorage.setItem('cadastros', JSON.stringify(cadastros));
  exibirCadastros();
}

document
  .querySelector('.formulario-registro')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    let nome = document.getElementById('nome').value.trim();
    let dataNascimento = document.getElementById('data-nascimento').value;
    let telefone = document.getElementById('telefone').value.trim();
    let email = document.getElementById('email').value.trim();

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
      alert('O campo Nome deve conter apenas letras e espaços.');
      return;
    }

    if (!/^\d{10,11}$/.test(telefone)) {
      alert(
        'O campo Telefone deve conter apenas números com 10 ou 11 dígitos.'
      );
      return;
    }

    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    let emailExistente = cadastros.find((cadastro) => cadastro.email === email);

    if (emailExistente) {
      alert('Este e-mail já está cadastrado. Tente outro.');
      return;
    }

    let novoCadastro = createCadastro(nome, dataNascimento, telefone, email);
    salvarCadastro(novoCadastro);

    event.target.reset();

    alert('Cadastro realizado com sucesso!');
  });

document.addEventListener('DOMContentLoaded', () => {
  exibirCadastros();
});
