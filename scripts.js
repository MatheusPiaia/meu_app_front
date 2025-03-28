const routes = {
    "#home": "home",
    "#equipamentos": "equipamentos",
    "#tecnicos": "tecnicos"
};

function renderPage() {
    const path = window.location.hash || "#home"; // Default para home
    const templateId = routes[path] || "not-found";
    const template = document.getElementById(templateId);
    if (template) {
        document.getElementById("app").innerHTML = template.innerHTML;
    }
}

function navigate(hash) {
    window.location.hash = hash;
}

// Detecta mudança no hash da URL e carrega a página correspondente
window.addEventListener("hashchange", renderPage);

// Carrega a página inicial ao abrir
window.onload = renderPage;

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
async function getEquipaments() {
  try {
    let response = await fetch('http://127.0.0.1:5000/equipamentos');
    console.log(response);
    
    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    let data = await response.json();
    // Limpa a lista antes de adicionar novos itens
    document.getElementById("myTableEquipamentBody").innerHTML = "";
    data.equipamentos.forEach(item => insertList(item.nome, item.modelo, item.setor, item.impacto))
    }
  catch (error) {
    console.error("Erro ao buscar equipamentos", error);
    return null;
  } 
}
 document.addEventListener("DOMContentLoaded", getEquipaments());


async function postEquipament(newEquipament, newModel, newSector, newImpact){
  const formData = new FormData();
  formData.append("nome", newEquipament);
  formData.append("modelo", newModel);
  formData.append("setor", newSector);
  formData.append("impacto", newImpact);      
  try {
    let response = await fetch('http://127.0.0.1:5000/equipamento', {
      method: "POST", 
      body: formData
    });   

    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    getEquipaments();
    alert("Equipamento Adicionado");
  }
  catch (error) {
    console.error("Erro ao cadastrar equipamento", error);
    alert("Erro ao cadastrar Equipamento, Equipamento duplicado!")
    return null;
  } 
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
  }

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de edição para cada item da lista
  --------------------------------------------------------------------------------------
*/

const insertButtonEdit = (parent) => {
    let span = document.createElement("span");
    let txt = document.createElement("i");
    span.className = "edit";
    txt.className = "bi bi-pencil-square";
    span.appendChild(txt);
    parent.appendChild(span);
  }

/*
  --------------------------------------------------------------------------------------
  Função para remover um equipamento da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    console.log(close.length);
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const nomeItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {
          div.remove()
          deleteItem(nomeItem)
          alert("Removido!");
        }
      }
    }
  }

/*
  --------------------------------------------------------------------------------------
  Função para cadastrar um novo equipamento com nome, modelo, setor e impacto 
  --------------------------------------------------------------------------------------
*/
const newEquipament = () => {
    let inputEquipament = document.getElementById("newEquipament").value;
    let inputModel = document.getElementById("newModel").value;
    let inputSector = document.getElementById("newSector").value;
    let inputImpact = document.getElementById("newImpact").value;

    if (inputEquipament === ''){
        alert("Escreva o nome do equipamento");
    }else if (inputModel === ''){
        alert("Escreva o modelo do equipamento");
    }else if (inputSector === ''){
        alert("Escreva o setor que equipamento opera");
    }else if (inputImpact === ''){
        alert("Selecione o impacto do equipamento");
    }else {       
        postEquipament(inputEquipament, inputModel, inputSector, inputImpact)
    }
}

const insertList = (equipamentName, Model, Sector, Impact) => {
    let equipament = [equipamentName, Model, Sector, Impact]
    let tableEquipament = document.getElementById("myTableEquipamentBody");
    let row = tableEquipament.insertRow();

    for (var i = 0; i < equipament.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = equipament[i];
      }
      insertButtonEdit(row.insertCell(-1))
      insertButton(row.insertCell(-1))      
      document.getElementById("newEquipament").value = "";
      document.getElementById("newModel").value = "";
      document.getElementById("newSector").value = "";      
    
      removeElement();
}