const routes = {
    "#home": "home",
    "#equipamentos": "equipamentos",
    "#tecnicos": "tecnicos"
};

const routeHandlers = {
  "#home": function () {
  console.log("Página inicial carregada");
  getMaintenances();
  },
  "#equipamentos": function(){
    getEquipaments();
  },   

  "#tecnicos": function(){
    getTechnicians();
  }
};

function renderPage() {
    const path = window.location.hash || "#home";
    const templateId = routes[path] || "not-found";
    const template = document.getElementById(templateId);
    if (template) {
        document.getElementById("app").innerHTML = template.innerHTML;
    }
    if (routeHandlers[path]) {
      routeHandlers[path]();
  }
}

function navigate(hash) {
    window.location.hash = hash;
}

// Detecta mudança no hash da URL e carrega a página correspondente
window.addEventListener("hashchange", renderPage);

document.addEventListener("DOMContentLoaded", renderPage);
// Carrega a página inicial ao abrir
window.onload = renderPage;

/*
----------------------------------------------------------------------------------------
FUNÇÕES REFERENTES A TELA EQUIPAMENTOS
----------------------------------------------------------------------------------------
*/

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
    data.equipamentos.forEach(item => insertEquipamentList(item.nome, item.modelo, item.setor, item.impacto))
    }
  catch (error) {
    console.error("Erro ao buscar equipamentos", error);
    return null;
  } 
}
 //document.addEventListener("DOMContentLoaded", getEquipaments());


 /*
  --------------------------------------------------------------------------------------
  Função para adicionar a um equipamento ao servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
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
  Função para remover um equipamento do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/

async function deleteEquipament(newEquipament){
  
  try{
    let response = await fetch(`http://127.0.0.1:5000/equipamento?nome=${encodeURIComponent(newEquipament)}`, {
      method: "DELETE",      
    });

    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    getEquipaments();
    alert("Equipamento removido da base");
  }
  catch{
    console.error("Erro ao deletar equipamento", error);
    alert("Erro ao deletar equipamento, manutenção neste equipamento em andamento");
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
    let i;
    console.log(close.length);
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        console.log(div);
        const nomeItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {          
          deleteEquipament(nomeItem);
          
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

const insertEquipamentList = (equipamentName, Model, Sector, Impact) => {
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


/*
----------------------------------------------------------------------------------------
FUNÇÕES REFERENTES A TELA TÉCNICOS
----------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de técnicos existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

async function getTechnicians() {
  try {
    let response = await fetch('http://127.0.0.1:5000/tecnicos');
    console.log(response);
    
    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    
    let data = await response.json();
    console.log(data);    
    // Limpa a lista antes de adicionar novos itens
    document.getElementById("myTableTechniciansBody").innerHTML = "";
        data.tecnicos.forEach(item => insertTechnicianList(item.nome, item.matricula, item.turno))
    
    }
  catch (error) {
    console.error("Erro ao buscar Técnicos", error);
    return null;
  } 
}

 /*
  --------------------------------------------------------------------------------------
  Função para adicionar um técnico ao servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
async function postTechnician(newTechnician, newTechnicianId, newShift){
  const formData = new FormData();
  formData.append("nome", newTechnician);
  formData.append("matricula", newTechnicianId);
  formData.append("turno", newShift);       
  try {
    let response = await fetch('http://127.0.0.1:5000/tecnico', {
      method: "POST", 
      body: formData
    });   

    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    getTechnicians();
    alert("Técnico Adicionado");
  }
  catch (error) {
    console.error("Erro ao cadastrar técnico", error);
    alert("Erro ao cadastrar Técnico, Matricula duplicada!")
    return null;
  } 
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um equipamento do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/

async function deleteTechnician(newTechnicianId){
  
  try{
    let response = await fetch(`http://127.0.0.1:5000/tecnico?matricula=${encodeURIComponent(newTechnicianId)}`, {
      method: "DELETE",      
    });

    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    getTechnicians();
    alert("Técnico removido da base");
  }
  catch{
    console.error("Erro ao deletar técnico", error);
    alert("Erro ao deletar técnico, Técnico com manutenção em andamento");
    return null;
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um técnico da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElementTechnician = () => {
  let close = document.getElementsByClassName("close");    
  let i;
  console.log(close.length);
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      console.log(div);
      const matricula = div.getElementsByTagName('td')[1].innerHTML
      if (confirm("Você tem certeza?")) {          
        deleteTechnician(matricula);
        
      }
    }
  }
}

const insertTechnicianList = (technicianName, technicianId, Shift) => {
  let technician = [technicianName, technicianId, Shift]
  let tableTechnician = document.getElementById("myTableTechniciansBody");
  let row = tableTechnician.insertRow();

  for (var i = 0; i < technician.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = technician[i];
    }
    insertButtonEdit(row.insertCell(-1))
    insertButton(row.insertCell(-1))      
    document.getElementById("newTechnician").value = "";
    document.getElementById("newTechnicianId").value = "";
    document.getElementById("newShift").value = "";      
  
    removeElementTechnician();
}

const newTechnician = () => {
  let inputTechnician = document.getElementById("newTechnician").value;
  let inputId = document.getElementById("newTechnicianId").value;
  let inputShift = document.getElementById("newShift").value;  

  if (inputTechnician === ''){
      alert("Escreva o nome do Técnico");
  }else if (inputId === ''){
      alert("Escreva a matrícula do técnico");
  }else if (inputShift === ''){
      alert("Escreva o turno de trabalho");  
  }else {       
      postTechnician(inputTechnician, inputId, inputShift)
  }
}

/* Função para buscar todas as manutenções cadastradas no banco, para servir como base para as opções do select
*/
async function getMaintenances() {
  try {
    let response = await fetch('http://127.0.0.1:5000/manutencoes');
    console.log(response);
    
    if(!response.ok){
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    
    let data = await response.json();
    let selectEquip = document.getElementById("equipamentSelect");
    let selectTech = document.getElementById("idTechSelect")
    selectEquip.innerHTML = "";
    selectTech.innerHTML = "";

    let equipamentos = data.equipamentos;       

    equipamentos.forEach(item => {
      let option =  document.createElement("option");      
      option.value = item.nome_equipamento;
      option.textContent = item.nome_equipamento;
      selectEquip.appendChild(option); 
          
      let optionTech =  document.createElement("option");  
      optionTech.value = item.matricula_tecnico;
      optionTech.textContent = item.matricula_tecnico;
      selectTech.appendChild(optionTech);

    })
    
    
    
    
    }
  catch (error) {
    console.error("Erro ao buscar Técnicos", error);
    return null;
  } 
}
