const chatBody = document.getElementById("chatBody");
var messageInput = document.getElementById("messageInput");
var btnSend = document.getElementById("btnSend");

function getNamaBulan(index) {
    const namaBulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Des"
    ];
    return namaBulan[index];
}

function getNamaHari(index) {
    const namaHari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];
    return namaHari[index];
}

const urlFb = "https://chatzer-lite-default-rtdb.firebaseio.com/";

function showSign() {
    var vSign = document.getElementById("viewSign");
    var vLogin = document.getElementById("viewLogin");
    var cPopup = document.getElementById("contain-login");
    vLogin.style.display = "none";
    vSign.style.display = "flex";
    cPopup.style.height = "590px";
}
function showLogin() {
    var vSign = document.getElementById("viewSign");
    var vLogin = document.getElementById("viewLogin");
    var cPopup = document.getElementById("contain-login");
    vLogin.style.display = "flex";
    vSign.style.display = "none";
    cPopup.style.height = "400px";
}

// checked popup
const userId = localStorage.getItem('key');

const lsHasLog = localStorage.getItem("hasLog");
const divPopupSL = document.getElementById("popupLoginSign");
if (lsHasLog) {
     const key = localStorage.getItem('key');
     const usn = localStorage.getItem('usn');
    const pw = localStorage.getItem('pw');
    const role = localStorage.getItem('role');
    const bio = localStorage.getItem('bio');
    const ct = localStorage.getItem('contact');
    const color = localStorage.getItem('colorFav');
  console.log('username:' + usn + ', pass:' + pw + ', role:' + role + ', bio:' + bio + ', contc:' + ct + ', color:' + color + ', key' + key)
  document.addEventListener("DOMContentLoaded", () => { updateUserStatusOnline(userId)
  window.addEventListener("beforeunload", (e) => { updateUserStatusOffline(userId)
  })
  })
    console.log("you are logged in");
} else {
    divPopupSL.style.display = "flex";
}

/*  localStorage.removeItem('hasLog');
      localStorage.removeItem('usn');
      localStorage.removeItem('pw');
      localStorage.removeItem('role');
      localStorage.removeItem('bio');
      localStorage.removeItem('contact');
      localStorage.removeItem('colorFav');*/

function login() {
    const usn = document.getElementById("usn-login");
    const pw = document.getElementById("pw-login");

    fetch(urlFb + "account.json")
        .then(res => res.json())
        .then(data => {
            for (var key in data) {
                const val = data[key];
                console.log(val);
                if (val.username === usn.value && val.password === pw.value) {
                    localStorage.setItem("hasLog", true);
                    localStorage.setItem("key", key);
                    localStorage.setItem("usn", usn.value);
                    localStorage.setItem("pw", pw.value);
                    localStorage.setItem("role", val.role);
                    localStorage.setItem("bio", val.bio);
                    localStorage.setItem("contact", val.contact);
                    localStorage.setItem("colorFav", val.colorFavorite);
                    alert("berhasil login");
                    location.reload();
                } else {
                    //  alert('username atau password salah')
                    console.log("username atau password salah");
                }
            }
        })
        .catch(error => console.error(error.message));
}

// handle sign di html nya

// profil3 changed
const inputSignProfile = document.getElementById("inputProfile");

// get ada di html nya

//post
function sendMessage() {
    if (!messageInput.value) {
        return;
    }
    btnSend.innerHTML =
        '<div class="spinner-border text-light" role="status" style="width:20px;height:20px;"></div>';
        
var sekarang = new Date();
var hari = getNamaHari(sekarang.getDay());
var bulan = getNamaBulan(sekarang.getMonth());
var tahun = sekarang.getFullYear();
var jam = sekarang.getHours();
var menit = sekarang.getMinutes();
    const usn = localStorage.getItem("usn");
    const pw = localStorage.getItem("pw");
    const role = localStorage.getItem("role");
    const contact = localStorage.getItem("contact");
    const color = localStorage.getItem("colorFav");
    const ms = messageInput.value;
    const dateSend = `${hari}, ${sekarang.getDate()} ${bulan} ${tahun}  ${jam}:${menit} WIB`;

    fetch(urlFb + "message.json")
        .then(res => res.json())
        .then(data => {
            let lastIndex = 0;
            for (const key in data) {
                lastIndex++;
            }
            const nextIdM = lastIndex + 1;
            var msgValid = {
                id: nextIdM,
                username: usn,
                role: role,
                contact: contact,
                message: ms,
                date: dateSend,
                colorText: color
            };

            fetch(urlFb + "message.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(msgValid)
            })
                .then(res => res.json())
                .then(data => {
                    messageInput.value = "";
                    btnSend.innerHTML = '<i class="bi bi-arrow-up"></i></i>';
                })
                .catch(error =>
                    console.error("failed to send message." + error)
                );
        });
}

const infoOnline = document.getElementById('info-online');
const acBody = document.getElementById('accountBody');
fetch(urlFb + 'account.json')
.then(res=>res.json())
.then(data=> {
  let akunOn = 0;
  let akunAll = 0;
  for (let key in data) {
   const val = data[key]
   akunAll++;
   if (val.status === 'online') {
     akunOn++;
   }
   
   var usn = val.username;
   var contact = val.contact;
   var status = val.status;
   var src = val.profileImageUrl;
   
   const acc = document.createElement('div');
   acc.innerHTML = `
              <div class="w-100 d-flex rounded-2 text-dark py-2" style="padding-left:5%;background:#f9e5fc;height:55px;">
                <img src="${src}" style="width:50px;border-radius:50%;" alt="">
                <div class="d-flex px-2 flex-column" >
                  <p class="m-0">${usn}</p>
                  <p class="m-0">${contact}</p>
                  <p class="m-0">• ${status}</p>
                </p>
              </div>
            </div>
   `;
   acBody.appendChild(acc)
  }
   infoOnline.innerHTML= `${akunOn}/${akunAll} online`;
})
.catch(e => console.error(error.message))

// Function to update user status to 'online'
function updateUserStatusOnline(userId) {
    // Endpoint URL to update user status
    const endpointURL = `${urlFb}/account/${userId}.json`;

    // Data to be sent
    const newData = {
        status: 'online'
    };

    // Fetch request with PATCH method to update user status to 'online'
    fetch(endpointURL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (response.ok) {
            console.log('User status updated to online.');
        } else {
            throw new Error('Failed to update user status.');
        }
    })
    .catch(error => {
        console.error('Error updating user status:', error);
    });
}

// Function to update user status to 'offline'
function updateUserStatusOffline(userId) {
    // Endpoint URL to update user status
    const endpointURL = `${urlFb}/account/${userId}.json`;

    // Data to be sent
    const newData = {
        status: 'offline'
    };

    // Fetch request with PATCH method to update user status to 'offline'
    fetch(endpointURL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (response.ok) {
            console.log('User status updated to offline.');
        } else {
            throw new Error('Failed to update user status.');
        }
    })
    .catch(error => {
        console.error('Error updating user status:', error);
    });
}

function logout() {
    localStorage.removeItem("hasLog");
    localStorage.removeItem("key");
    localStorage.removeItem("usn");
    localStorage.removeItem("pw");
    localStorage.removeItem("role");
    localStorage.removeItem("bio");
    localStorage.removeItem("contact");
    localStorage.removeItem("colorFav");
    localStorage.removeItem("srcProfile");
    alert("you logout. please login again");
    location.reload();
}
