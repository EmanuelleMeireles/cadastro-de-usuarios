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

  let usuariosEncontrados = cadastros.filter(
    (cadastro) => cadastro.email === emailBusca
  );

  if (usuariosEncontrados.length > 0) {
    let lista = usuariosEncontrados
      .map((usuario, index) => {
        return `
        <li>
          <strong>Nome:</strong> ${usuario.nome}<br>
          <strong>Data de Nascimento:</strong> ${formatarData(
            usuario.dataNascimento
          )}<br>
          <strong>Telefone:</strong> ${usuario.telefone}<br>
          <strong>E-mail:</strong> ${usuario.email}
          <button class="btn-excluir" onclick="confirmarExclusao(${index})">Excluir</button>
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
      return `
      <li>
        <strong>Nome:</strong> ${cadastro.nome}<br>
        <strong>Data de Nascimento:</strong> ${formatarData(
          cadastro.dataNascimento
        )}<br>
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

function formatarData(dataString) {
  let [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarTelefone(event) {
  const input = event.target;
  let valor = input.value.replace(/\D/g, '');

  if (valor.length > 10) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
  } else if (valor.length > 6) {
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3');
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,4})/, '($1)$2');
  } else {
    valor = valor.replace(/^(\d{0,2})/, '($1');
  }

  input.value = valor;
}

document.getElementById('telefone').addEventListener('input', formatarTelefone);

function voltar() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}

document
  .querySelector('.formulario-registro')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    let nome = document.getElementById('nome').value.trim();
    let dataNascimento = document.getElementById('data-nascimento').value; // String no formato YYYY-MM-DD
    let telefone = document.getElementById('telefone').value.trim();
    let email = document.getElementById('email').value.trim();

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
      alert('O campo Nome deve conter apenas letras e espaços.');
      return;
    }

    if (!/^\(\d{2}\)\d{4,5}-\d{4}$/.test(telefone)) {
      alert('O campo Telefone deve estar no formato (DDD)xxxx-xxxx.');
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
