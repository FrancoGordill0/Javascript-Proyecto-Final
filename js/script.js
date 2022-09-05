const seccionComidas = document.getElementById('comidas')

const CarroContenedor = document.getElementById('carroContenedor')

const contadorCarrito = document.getElementById('contadorCarro')

const VaciarCarroModal = document.getElementById('vaciarCarro')

const botonMenu = document.getElementById('botonMenu')

const finalizarPedido = document.getElementById('finalizarPedido')

const proxComidas = document.getElementById('proxComidas')



function borrarDatos() {
    localStorage.clear();
}


const Carro = JSON.parse(localStorage.getItem('carrito')) || []



let carrito = []


let stockComidas = [{
        id: 1,
        nombre: 'Sandwich',
        cantidad: 1,
        precio: 700,
        desc: 'Sandwich de Milanesa o Lomito con papas fritas incluidas',
        img: './img/comida0.png'
    },
    {
        id: 2,
        nombre: 'Pizza',
        cantidad: 1,
        precio: 900,
        desc: 'Muzzarella, Napolitana, 4 Quesos, Ternera, Especial.',
        img: './img/comida1.png'
    },
    {
        id: 3,
        nombre: 'Empanadas',
        cantidad: 1,
        precio: 1100,
        desc: 'Carne, Pollo, Jamon y Queso, Verduras y Queso.',
        img: './img/comida2.png'
    },
    {
        id: 4,
        nombre: 'Combo',
        cantidad: 1,
        precio: 1200,
        desc: 'Menu del dia + bebida a elección (Gaseosa linea Pepsi)',
        img: './img/comida3.png'
    }
    
]


stockComidas.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
            <div class="card" style="width: 18rem;">
            <div class="card-body">
                <img src=${producto.img}>
                <h3>${producto.nombre}</h3>
                <p class="precioProducto">Precio:$ ${producto.precio}</p>
                <p>${producto.desc}</p>
                <button id="agregar${producto.id}" class="btn btn-dark btn-sm">Agregar <i class="fas fa-shopping-cart"></i></button>
            </div>
        </div>
            `

    seccionComidas.appendChild(div)


    const boton = document.getElementById(`agregar${producto.id}`)


    boton.addEventListener('click', () => {
        agregarAlCarrito(producto.id)
    })
})




const agregarAlCarrito = (prodId) => {

    const listacarro = carrito.some(prod => prod.id === prodId)

    if (listacarro) {
        const prod = carrito.map(prod => {
            if (prod.id === prodId) {
                prod.cantidad++
            }
        })
    } else {

        const item = stockComidas.find((prod) => prod.id === prodId)
        carrito.push(item)
    }
    actualizarCarro()
}


const vaciarCarrito = (prodId) => {

    const item1 = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item1)

    carrito.splice(indice, 1)

    actualizarCarro()

    borrarDatos()

}


const actualizarCarro = () => {

    CarroContenedor.innerHTML = ""

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="vaciarCarrito(${prod.id})" class="btn btn-outline-danger boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        CarroContenedor.appendChild(div)

        localStorage.setItem('carrito', JSON.stringify(carrito))

    })

    contadorCarrito.innerText = carrito.length


    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
}



// -----------------  Alerts  ------------------ //

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    customClass: {
        popup: 'colored-toast'
      },
    }
  )
  
  Toast.fire({
    icon: 'success',
    iconColor: 'white',
    title: 'Bienvenido/a'
  })

  

  VaciarCarroModal.addEventListener('click', () => {
    
    Swal.fire({
        title: 'Estas seguro de vaciar el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#a5dc86',
        cancelButtonColor: '#f27474',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Tu Carrito se ha vaciado con Exito',
          )
        carrito.length = 0
        actualizarCarro()
        borrarDatos()
        }
      })
        carrito.length = 0
        actualizarCarro()
        borrarDatos()
})


  finalizarPedido.addEventListener('click', () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pedido realizado con exito',
        showConfirmButton: false,
        timer: 1500
      })
      
    carrito.length = 0
    actualizarCarro()
    borrarDatos()
})


  // -----------------------  FETCH  ---------------------- //

  function crearHTML(comidas) {

    proxComidas.innerHTML = ""

    comidas.forEach((producto) => {
        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `
            <div class="card" style="width: 18rem;">
                <div class="card-body" id="items">
                    <img src=${producto.img}>
                    <h3>${producto.nombre}</h3>
                    <p class="precioProducto">Precio: ${producto.precio}</p>
                    <p>${producto.desc}</p>
                </div>
            </div>
                `
    
    proxComidas.appendChild(div)

    })
}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})



const fetchData = async () => {
            
    try {
        const res = await fetch('./js/menu.json')
        const data = await res.json()
        
        crearHTML(data)
        }
     catch (error) {
        console.log(error);
    }
} 