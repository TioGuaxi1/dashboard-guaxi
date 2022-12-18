searchApps = async () => {
  const containerApps = document.getElementById("apps");

  containerApps.innerHTML += `
  <p id="loading">Carregando Aplicações</p>`;

  const selectCommit = document.getElementById("selectCommit");
  const api = await axios.get("https://api.discloud.app/v2/app/all/status", {
    headers: {
      "api-token": localStorage.getItem("token-tioguaxi"),
    },
  });

  document.getElementById("loading").remove();

  const discloud = api.data.apps;
  for (var i = 0; i < discloud.length; i++) {
    const container =
      discloud[i].container === "Online" ? "btn btn-danger" : "btn btn-success";

    const style = discloud[i].container === "Online" ? "#50CF01" : "red";
    if (!isNaN(discloud[i].id)) {
      selectCommit.innerHTML += `
    <option value="${discloud[i].id}">${discloud[i].id}</option>
    `;
    }
    containerApps.innerHTML += `
      <div id="app">
      <p>ID: <strong>${discloud[i].id}</strong></p>
      <p>CPU: <strong>${discloud[i].cpu}</strong></p>
      <p>Memory: <strong>${discloud[i].memory}</strong></p>
      <p>Restart: <strong>${discloud[i].last_restart}</strong></p>
      <p style="color: ${style};">Status: <strong>${discloud[i].container} </strong></p>
      <button name="${discloud[i].id}" id="start/stop" class="${container}">
      <i class="fa fa-power-off" aria-hidden="true"></i>
      </button>
      <button name="${discloud[i].id}" id="reload" class="btn btn-secundary">
      <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
      <button name="${discloud[i].id}" id="logs" class="btn btn-primary">
      <i class="fa fa-file-text-o" aria-hidden="true"></i>
      </button>
      <button name="${discloud[i].id}" id="delete" class="btn btn-warning">
      <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
      <button name="${discloud[i].id}" id="backup" class="btn btn-primary">
      <i class="fa fa-cloud-download" aria-hidden="true"></i>
      </button>
      </div>

      `;
  }

  let btns = document.querySelectorAll("button");

  for (i of btns) {
    i.addEventListener("click", function () {
      if (this.id === "reload") {
        this.disabled = true;
        var config = {
          method: "put",
          url: `https://api.discloud.app/v2/app/${this.name}/restart`,
          headers: {
            "api-token": localStorage.getItem("token-tioguaxi"),
          },
        };
        axios(config)
          .then(function (response) {
            location.reload();
            alert(response.data.message);
          })
          .catch(function (error) {
            alert("Erro ao reiniciar");
          });
      } else if (this.id === "start/stop") {
        this.disabled = true;
        if (this.className === "btn btn-success") {
          var config = {
            method: "put",
            url: `https://api.discloud.app/v2/app/${this.name}/start`,
            headers: {
              "api-token": localStorage.getItem("token-tioguaxi"),
            },
          };
          axios(config)
            .then(function (response) {
              location.reload();
              alert(response.data.message);
            })
            .catch(function (error) {
              alert("Erro ao iniciar");
            });
        } else if (this.className === "btn btn-danger") {
          var config = {
            method: "put",
            url: `https://api.discloud.app/v2/app/${this.name}/stop`,
            headers: {
              "api-token": localStorage.getItem("token-tioguaxi"),
            },
          };
          axios(config)
            .then(function (response) {
              alert(response.data.message);
              location.reload();
            })
            .catch(function (error) {
              alert("Erro ao desligar");
            });
        }
      } else if (this.id === "logs") {
        this.disabled = true;
        var config = {
          method: "get",
          url: `https://api.discloud.app/v2/app/${this.name}/logs`,
          headers: {
            "api-token": localStorage.getItem("token-tioguaxi"),
          },
        };
        axios(config)
          .then(function (response) {
            window.open(response.data.apps.terminal.url);
            alert(response.data.message);
          })
          .catch(function (error) {
            alert("Erro ao gerar logs");
          });
      } else if (this.id === "delete") {
        if (window.confirm(`Você quer deletar a aplicação ${this.name}`)) {
          this.disabled = true;
          var config = {
            method: "delete",
            url: `https://api.discloud.app/v2/app/${this.name}/delete`,
            headers: {
              "api-token": localStorage.getItem("token-tioguaxi"),
            },
          };
          axios(config)
            .then(function (response) {
              location.reload();
              alert(response.data.message);
            })
            .catch(function (error) {
              alert("Erro ao deletar");
            });
        }
      } else if (this.id === "backup") {
        this.disabled = true;
        var config = {
          method: "get",
          url: `https://api.discloud.app/v2/app/${this.name}/backup`,
          headers: {
            "api-token": localStorage.getItem("token-tioguaxi"),
          },
        };
        axios(config)
          .then(function (response) {
            window.open(response.data.backups.url);
            alert(response.data.message);
          })
          .catch(function (error) {
            alert("Erro ao criar backup");
          });
      } else if (this.id === "trocar-token") {
        localStorage.clear();
        location.reload();
      }
    });
  }
  let inputs = document.querySelectorAll("input");

  for (i of inputs) {
    i.addEventListener("click", function () {
      let file = document.getElementById("file").files[0];
      if (this.id === "upload") {
        if (file !== undefined) {
          if (file.type === "application/x-zip-compressed") {
            this.disabled = true;
            this.value = "Uploading...";
            const formData = new FormData();
            formData.append("file", file);

            const config = {
              headers: {
                "api-token": localStorage.getItem("token-tioguaxi"),
                "Content-Type": "multipart/form-data",
              },
            };

            let url = `https://api.discloud.app/v2/upload`;

            axios
              .post(url, formData, config)
              .then((response) => {
                location.reload();
                alert(response.data.message);
              })
              .catch((error) => {
                alert(error.response.data.message);
              });
          }
        }
      } else if (this.id === "commit") {
        const appId = document.getElementById("selectCommit");
        if (file !== undefined) {
          if (appId.value !== null) {
            this.disabled = true;
            this.value = "Commiting...";
            const formData = new FormData();
            formData.append("file", file);

            const config = {
              headers: {
                "api-token": localStorage.getItem("token-tioguaxi"),
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": true,
              },
            };

            let url = `https://api.discloud.app/v2/app/${appId.value}/commit`;
            axios
              .put(url, formData, config)
              .then((response) => {
                location.reload();
                alert(response.data.message);
              })
              .catch((error) => {
                alert(error.response.data.message);
              });
          }
        }
      }
    });
  }
};

tokenActive = async () => {
  let button = document.getElementById("login-token");

  button.addEventListener("click", function () {
    const token = document.getElementById("token-insert");
    if (token.value !== "") {
      localStorage.setItem("token-tioguaxi", token.value);
      location.reload();
    }
  });
};

token = document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  if (localStorage.getItem("token-tioguaxi") === null) {
    container.innerHTML += `
    <input id="token-insert" type="text" placeholder="Insira seu token"/>
    <button id="login-token">
    <i class="fa fa-sign-in" aria-hidden="true"></i>
    </button>
    `;

    tokenActive();
  } else {
    container.innerHTML += `
    <button id="trocar-token">Trocar token
    <i class="fa fa-refresh" aria-hidden="true"></i>
    </button>
    `;
    searchApps();
  }
});
