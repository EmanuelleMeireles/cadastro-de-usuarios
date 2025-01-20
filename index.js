function createCadastro(nome, dataNascimento, telefone, email) {
  return { nome, dataNascimento, telefone, email };
}

function salvarCadastro(cadastro) {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  cadastros.push(cadastro);
  localStorage.setItem('cadastros', JSON.stringify(cadastros));
}

function verificarEmailExistente(email) {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  return cadastros.find((cadastro) => cadastro.email === email);
}

function buscarUsuario() {
  let emailBusca = document.getElementById('email-busca').value.trim();
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  let resultadoDiv = document.getElementById('resultado-busca');
  let listaDiv = document.getElementById('lista-cadastros');

  let usuariosEncontrados = cadastros.filter(
    (cadastro) => cadastro.email === emailBusca
  );

  if (usuariosEncontrados.length > 0) {
    let lista = usuariosEncontrados
      .map((usuario, index) => {
        let dataNascimento = new Date(usuario.dataNascimento);
        let dataFormatada = new Date(
          dataNascimento.getTime() - dataNascimento.getTimezoneOffset() * 60000
        );

        let btnExcluirStyle = 'background-color: #e53935;';

        return `
        <li>
          <strong>Nome:</strong> ${usuario.nome}<br>
          <strong>Data de Nascimento:</strong> ${dataFormatada.toLocaleDateString(
            'pt-BR'
          )}<br>
          <strong>Telefone:</strong> ${usuario.telefone}<br>
          <strong>E-mail:</strong> ${usuario.email}
          <button class="btn-excluir" style="${btnExcluirStyle}" onclick="confirmarExclusao(${index})">Excluir</button>
        </li>
      `;
      })
      .join('');

    resultadoDiv.innerHTML = `<ul>${lista}</ul>`;
  } else {
    resultadoDiv.innerHTML = `<p style="color: red;">Nenhum usuário encontrado com este e-mail.</p>`;
    exibirCadastros();
  }
}

function exibirCadastros() {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  let listaDiv = document.getElementById('lista-cadastros');

  document.getElementById('resultado-busca').innerHTML = '';

  if (cadastros.length === 0) {
    listaDiv.innerHTML = '<p>Nenhum cadastro encontrado.</p>';
    return;
  }

  let lista = cadastros
    .map((cadastro, index) => {
      let dataNascimento = new Date(cadastro.dataNascimento);
      let dataFormatada = dataNascimento.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });

      return `
      <li>
        <strong>Nome:</strong> ${cadastro.nome}<br>
        <strong>Data de Nascimento:</strong> ${dataFormatada}<br>
        <strong>Telefone:</strong> ${cadastro.telefone}<br>
        <strong>E-mail:</strong> ${cadastro.email}
        <button class="btn-excluir" onclick="confirmarExclusao(${index})">Excluir</button>
      </li>
    `;
    })
    .join('');

  listaDiv.innerHTML = `<ul>${lista}</ul>`;
}

function confirmarExclusao(index) {
  let confirmar = confirm('Tem certeza que deseja excluir o funcionário?');
  if (confirmar) {
    deletarCadastro(index);
  }
}

function deletarCadastro(index) {
  let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
  cadastros.splice(index, 1);
  localStorage.setItem('cadastros', JSON.stringify(cadastros));
  exibirCadastros();
}

function voltar() {
  window.location.href = 'index.html';
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

    let emailExistente = verificarEmailExistente(email);

    if (emailExistente) {
      alert('Este e-mail já está cadastrado. Tente outro.');
      return;
    }

    let novoCadastro = createCadastro(nome, dataNascimento, telefone, email);
    salvarCadastro(novoCadastro);

    event.target.reset();

    alert('Cadastro realizado com sucesso!');
    exibirCadastros();
  });

document.addEventListener('DOMContentLoaded', () => {
  exibirCadastros();
});
