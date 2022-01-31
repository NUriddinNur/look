//         HTML taglarni olish
const addUser = document.querySelector("#userAdd")
const userNameInput = document.querySelector('#usernameInput')
const telephoneInput = document.querySelector('#telephoneInput')
const customers = document.querySelector('.customers-list')
const foodsForm = document.querySelector('#foodsForm')
const foodBtn = document.querySelector('#addBtn')
const mainHeder = document.querySelector('.main-headers')
const orderList = document.querySelector('.orders-list')
const foodCount = document.querySelector('#foodsCount')
const foodId = document.querySelector('#foodsSelect')

//         databazadan malumotlarni olish
const orderData = window.localStorage.getItem('orders')
const orders = orderData ? JSON.parse(orderData) : []
const database = window.localStorage.getItem('users')
const users = database ? JSON.parse(database) : []       
const acUs = window.localStorage.getItem('activUser')

let [activUserId, activUserName] = acUs ? JSON.parse(acUs) : ['','']


selectCustomer(+activUserId, activUserName)

  //            Databazaga zakas qo'shish
  // tanlangan zkazlarni databazaga qo'shish databazada zakaz borbolsa soniga qoshib qoyadi bo'lmasa databazaga yangi zakas qo'shadi 
foodBtn.addEventListener('click', (event) => {
    event.preventDefault()
    let order = {}

    if (!foodCount.value)  {
        return
    }
    if(foodCount.value > 10) {
        alert("Ishtaxa karnegu buncha maxsulot yetkazib berolmaymiz brat !!!")
        foodCount.value = ''
        return 
    }
    let checher = true
    
    for (let ord of orders) {
        if (ord['userId'] === activUserId && ord['foodId'] === foodId.value) {
            ord['count'] = Number(ord['count']) + Number(foodCount.value) + ""
            checher = false
        }
    }
    if (checher) {
        order["userId"] = activUserId
        order["foodId"] = foodId.value
        order["count"] = foodCount.value
        orders.unshift(order)
    }

    window.localStorage.setItem('orders', JSON.stringify(orders))
    foodCount.value = ''

    selectCustomer(activUserId, activUserName)
    ordersPage(activUserId)
})

  //                    Databazaga  user qo'shish
  // userni malumotlari olinadi (username, phone ) validatsadan o'tkaziladi va databazaga yozib qoyiladi
addUser.addEventListener('submit', (event) => {
    event.preventDefault();
    activUserId = +generatId()
    activUserName = userNameInput.value
    let phone = telephoneInput.value

    const pattern  = "<(\"[^\"]*\"|'[^']*'|[^'\">])*>";

    if (activUserName.length > 30) {
        alert("Invalid use name")
        userNameInput.value = ''
        return
    }
    if(!(phoneValidation(phone))) {
        alert('Invalid phone number')
        telephoneInput.value = ''
        return
    }
    if(activUserName.match(pattern)){
        console.log("alo");
        alert("Invalid user name")
        userNameInput.value = ""
        return
    }

    users.push({
        userId: activUserId,
        userName: activUserName,
        phone: '+'+ phone
    })

    window.localStorage.setItem('users', JSON.stringify(users))

    userNameInput.value = ''
    telephoneInput.value = ''
    selectCustomer(activUserId, activUserName)
})

   // databazada hamma userlarni o'qib customrs listga chiqarish
function addUsers(id) {
    let userList = ''

    for (let user of users) {

        if (id === user['userId']) {
            userList += `
                <li style="background-color:red;" id="id${user['userId']}" class="customer-item">
                <span class="customer-name" onclick='selectCustomer(${user['userId']}, "${user["userName"]}")'>${user['userName']}</span>
                <a class="customer-phone" href="tel:${user['phone']}">${user['phone']}</a>
                </li>
            `
        }else {
            userList += `
            <li id="id${user['userId']}" class="customer-item">
                <span class="customer-name" onclick='selectCustomer(${user['userId']}, "${user["userName"]}")'>${user['userName']}</span>
                <a class="customer-phone" href="tel:${user['phone']}">${user['phone']}</a>
            </li>
        `
        }


    }

    customers.innerHTML = userList
}

   // unikql Id generatsa qilish
function generatId() {
    return +(Date.now() + '').slice(-5)
}

    // telefon validatsiya
function phoneValidation(num) {
    let regex = /([9][9][8][0-9]{2}[0-9]{3}[0-9]{2}[0-9]{2})/g

    if(num.length != 12) return null
    return num.match(regex, +num)
}

   // user statusni activga o'tkazish 
function selectCustomer(id, name) {

    window.localStorage.setItem('activUser', JSON.stringify([`${id}`,`${name}`]))
    addUsers(id)
    ordersPage(id)
    activUserName = name
    activUserId = id;

    mainHeder.innerHTML = `
        <div  class="cutomer-id-wrapper">
            <span>client id:</span>
            <span id="clientId">${id}</span>
        </div>
        <h1 id="userHeader" class="customer-name">${name}</h1>
    `
}
  // uzerga tegishli bolgan zakazlarni databazadan o'qib orders listga chiqarish
function ordersPage(userId) {
    let order = ""
    userId = +userId

    for (let ord of orders) {
        if (ord['userId'] === userId) {
            if (ord['foodId'] === "1") {
                order += `
                <li class="order-item">
                    <img src="./img/cola.jpeg">
                        <div>
                            <span class="order-name">Cola</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }else if (ord['foodId'] === "2") {
                order += `
                <li class="order-item">
                    <img src="./img/fanta.jpeg">
                        <div>
                            <span class="order-name">Fanta</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }else if (ord['foodId'] === "3") {
                order += `
                <li class="order-item">
                    <img src="./img/burger_cheese.jpeg">
                        <div>
                            <span class="order-name">Burger Cheese</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }else if (ord['foodId'] === "4") {
                order += `
                <li class="order-item">
                    <img src="./img/spinner.jpeg">
                        <div>
                            <span class="order-name">Spinner</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }else if (ord['foodId'] === "5") {
                order += `
                <li class="order-item">
                    <img src="./img/combo.jpeg">
                        <div>
                            <span class="order-name">Combo</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }else if (ord['foodId'] === "6") {
                order += `
                <li class="order-item">
                    <img src="./img/chicken_togora.jpeg">
                        <div>
                            <span class="order-name">Chicken Tog'ora</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }else if (ord['foodId'] === "7") {
                order += `
                <li class="order-item">
                    <img src="./img/chicken_wings.jpeg">
                        <div>
                            <span class="order-name">Chicken wings</span>
                            <span class="order-count">${ord['count']}</span>
                        </div>
                </li>
                `
            }
        }
    }
    orderList.innerHTML = order
}


