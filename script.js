let navbar = document.querySelector('.navbar');

let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');

// Toggle Buttons

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
};

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
};

document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
};

window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
};

// Admin & Menu

document.addEventListener('DOMContentLoaded', function () {

    const menuForm = document.getElementById('menuForm');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close-btn');
    const loginSubmit = document.getElementById('login-submit');

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    function updateUI() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const menuForm = document.getElementById('menuForm');
        const adminLoginBtn = document.getElementById('admin-login-btn');

        if (isAdmin) {
            menuForm.style.display = 'block';
            adminLoginBtn.textContent = 'Logout';
        } else {
            menuForm.style.display = 'none';
            adminLoginBtn.textContent = 'Login Admin';
        }

        loadMenu();
        updateCartUI();
    }

    adminLoginBtn.addEventListener('click', function () {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        if (isAdmin) {
            localStorage.setItem('isAdmin', 'false');
            updateUI();
        } else {
            loginModal.style.display = 'flex';
        }
    });

    loginSubmit.addEventListener('click', function () {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        fetch('php/login_admin.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    localStorage.setItem('isAdmin', 'true');
                    loginModal.style.display = 'none';
                    updateUI();
                } else {
                    alert(result.message);
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                alert('Terjadi kesalahan saat login.');
            });
    });


    closeBtn.addEventListener('click', function () {
        loginModal.style.display = 'none';
    });

    loginModal.addEventListener('click', function (e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    updateUI();
});

document.addEventListener('DOMContentLoaded', loadMenu);
document.getElementById('menuForm').addEventListener('submit', addMenu);

function loadMenu() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const menuList = document.getElementById('menuList');

    fetch('http://localhost/web_aka/php/menu_read.php')
        .then(response => response.json())
        .then(menus => {
            console.log('Data dari server:', menus);

            menuList.innerHTML = '';

            menus.forEach((menu) => {
                const card = document.createElement('div');
                card.className = 'menu-card';

                card.innerHTML = `
        <img src="${menu.image}" alt="${menu.name}">
        <div class="menu-info">
            <h3>${menu.name}</h3>
            <div class="price-section">
                <span class="current-price">Rp ${menu.price.toLocaleString()}</span>
                <span class="original-price">Rp ${menu.discountPrice.toLocaleString()}</span>
            </div>
            <div class="menu-actions">
                ${isAdmin ?
                        `<button onclick="editMenu(${menu.id}, '${menu.name}', ${menu.price}, ${menu.discountPrice}, '${menu.image}')" class="edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteMenu(${menu.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>` :
                        `<button onclick="addToCart('${menu.name}', ${menu.price}, '${menu.image}')" class="add-to-cart-btn">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>`
                    }
            </div>
        </div>
    `;
                menuList.appendChild(card);
            });

        })
        .catch(error => {
            console.error('Gagal mengambil data menu:', error);
            menuList.innerHTML = '<p>Gagal memuat menu. Coba lagi nanti.</p>';
        });
}



// Add Menu Handler (admin)

function addMenu(e) {
    e.preventDefault();

    const name = document.getElementById('menuName').value;
    const price = document.getElementById('menuPrice').value;
    const discountPrice = document.getElementById('menuDiscountPrice').value;
    const image = document.getElementById('menuImage').value;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("image", image);

    fetch('http://localhost/web_aka/php/menu_add.php', {
        method: 'POST',
        body: formData
    })

        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Menu berhasil ditambahkan!");
                document.getElementById('menuForm').reset();
                loadMenu(); // reload dari database
            } else {
                alert("Gagal menambahkan menu: " + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Terjadi kesalahan saat menambahkan menu.");
        });
}


// Add to Cart

function addToCart(name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items-container');

    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <span class="fas fa-times" onclick="removeFromCart(${index})"></span>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <div class="price">Rp. ${item.price.toLocaleString()}</div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    if (cart.length > 0) {
        const checkoutBtn = document.createElement('a');
        checkoutBtn.href = '#';
        checkoutBtn.className = 'btn';
        checkoutBtn.textContent = 'Checkout';
        cartContainer.appendChild(checkoutBtn);
    }
}

function editMenu(id, name, price, discountPrice, image) {
    const newName = prompt('Edit nama menu:', name);
    const newPrice = prompt('Edit harga normal:', price);
    const newDiscountPrice = prompt('Edit harga diskon:', discountPrice);
    const newImage = prompt('Edit URL gambar:', image);

    if (newName && newPrice && newDiscountPrice && newImage) {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", newName);
        formData.append("price", newPrice);
        formData.append("discountPrice", newDiscountPrice);
        formData.append("image", newImage);

        fetch('php/menu_edit.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                alert(result.message);
                loadMenu();
            })
            .catch(err => {
                alert('Terjadi kesalahan saat edit menu');
                console.error(err);
            });
    }
}


function deleteMenu(id) {
    const confirmDelete = confirm('Yakin ingin menghapus menu ini?');
    if (confirmDelete) {
        const formData = new FormData();
        formData.append("id", id);

        fetch('php/menu_delete.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                alert(result.message);
                loadMenu();
            })
            .catch(err => {
                alert('Terjadi kesalahan saat menghapus menu');
                console.error(err);
            });
    }
}

