// Kode untuk navbar, search, dan cart
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

// Kode CRUD untuk menu
document.addEventListener('DOMContentLoaded', loadMenu);
document.getElementById('menuForm').addEventListener('submit', addMenu);

function loadMenu() {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = ''; // Menghapus daftar menu yang ada
    const menus = JSON.parse(localStorage.getItem('menus')) || [];

    // Menyimpan menu yang ada di HTML ke dalam local storage
    const existingMenus = [
        { name: "Affogato", price: 15000, discountPrice: 20000, image: "img/affogato.jpg" },
        { name: "Lontong Balap", price: 15000, discountPrice: 20000, image: "img/lontongbalap.jpg" },
        { name: "Ice Coffee Milk", price: 15000, discountPrice: 20000, image: "img/icecoffeemilk.jpg" },
        { name: "Coffee and Toast", price: 15000, discountPrice: 20000, image: "img/coffeeandtoast.jpg" },
        { name: "Dalgona", price: 15000, discountPrice: 20000, image: "img/dalgona.jpg" },
        { name: "Kopi Tubruk", price: 15000, discountPrice: 20000, image: "img/kopitubruk.jpg" }
    ];

    // Gabungkan menu yang ada di HTML dengan menu yang ada di local storage
    const allMenus = [...existingMenus, ...menus];

    // Hapus duplikat
    const uniqueMenus = Array.from(new Set(allMenus.map(menu => JSON.stringify(menu))))
                              .map(menu => JSON.parse(menu));

    // Tampilkan menu yang unik
    uniqueMenus.forEach((menu, index) => {
        const box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = `
            <img src="${menu.image}" alt="">
            <h3>${menu.name}</h3>
            <div class="price">Rp. ${menu.price} <span>Rp. ${menu.discountPrice}</span></div>
            <button onclick="editMenu(${index})">Edit</button>
            <button onclick="deleteMenu(${index})">Hapus</button>
        `;
        menuList.appendChild(box);
    });

    // Simpan semua menu yang unik ke local storage
    localStorage.setItem('menus', JSON.stringify(uniqueMenus));
}

function addMenu(event) {
    event.preventDefault();
    const menuName = document.getElementById('menuName').value;
    const menuPrice = document.getElementById('menuPrice').value;
    const menuDiscountPrice = document.getElementById('menuDiscountPrice').value;
    const menuImage = document.getElementById('menuImage').value;

    const menus = JSON.parse(localStorage.getItem('menus')) || [];
    menus.push({ name: menuName, price: menuPrice, discountPrice: menuDiscountPrice, image: menuImage });
    localStorage.setItem('menus', JSON.stringify(menus));
    loadMenu();
    document.getElementById('menuForm').reset();
}

function editMenu(index) {
    const menus = JSON.parse(localStorage.getItem('menus'));
    const menu = menus[index];
    document.getElementById('menuName').value = menu.name;
    document.getElementById('menuPrice').value = menu.price;
    document.getElementById('menuDiscountPrice').value = menu.discountPrice;
    document.getElementById('menuImage').value = menu.image;

    // Hapus menu yang sedang diedit
    menus.splice(index, 1);
    localStorage.setItem('menus', JSON.stringify(menus));
    loadMenu();
}

function deleteMenu(index) {
    const menus = JSON.parse(localStorage.getItem('menus'));
    menus.splice(index, 1);
    localStorage.setItem('menus', JSON.stringify(menus));
    loadMenu();
}