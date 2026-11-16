const products = [
  {id:1,name:"Taladro percutor 650 W",category:"Herramientas",price:70600,stock:8,icon:"🔩",description:"Ideal para perforaciones en madera, metal y mampostería."},
  {id:2,name:"Pack de 100 tornillos autoperforantes",category:"Tornillería",price:6600,stock:24,icon:"🔧",description:"Tornillos para fijaciones y trabajos de montaje."},
  {id:3,name:"Pintura látex interior 20 L",category:"Pintura",price:125000,stock:5,icon:"🪣",description:"Pintura para renovar paredes y ambientes interiores."},
  {id:4,name:"Kit de arreglo de canilla",category:"Plomería",price:11500,stock:12,icon:"🚰",description:"Kit básico para pequeñas reparaciones de grifería."},
  {id:5,name:"Cable unipolar 2,5 mm² (rollo)",category:"Electricidad",price:28500,stock:7,icon:"🔌",description:"Cable para instalaciones eléctricas domiciliarias."},
  {id:6,name:"Pinza universal 8 pulgadas",category:"Herramientas",price:14900,stock:10,icon:"🗜️",description:"Herramienta manual para sujetar, doblar y cortar."},
  {id:7,name:"Cinta aisladora",category:"Electricidad",price:1800,stock:30,icon:"🧰",description:"Cinta aislante para tareas eléctricas."},
  {id:8,name:"Sellador de silicona",category:"Plomería",price:5200,stock:2,icon:"🧴",description:"Sellado de juntas y pequeñas reparaciones."}
];
const money = n => new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);
let cart = [];
let activeCategory = "Todos";
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function renderProducts(){
  const term = searchInput.value.trim().toLowerCase();
  const shown = products.filter(p => (activeCategory==="Todos" || p.category===activeCategory) &&
    (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)));
  if(!shown.length){grid.innerHTML='<div class="empty-results">No encontramos productos con esa búsqueda. Probá con otra palabra.</div>';return;}
  grid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-visual"><span class="product-category">${p.category}</span><span>${p.icon}</span></div>
      <div class="product-info">
        <span class="stock ${p.stock<=3?'low':''}">${p.stock<=3?'● Últimas unidades':'● Disponible'}</span>
        <h3>${p.name}</h3><p>${p.description}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span>
          <button class="add-button" data-add="${p.id}" aria-label="Agregar ${p.name}" ${p.stock===0?'disabled':''}>+</button></div>
      </div>
    </article>`).join("");
}
function notify(message){
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove("show"),2400);
}
function addToCart(id, quantity=1){
  const product=products.find(p=>p.id===id);if(!product)return;
  const current=cart.find(item=>item.id===id);
  if((current?.quantity||0)+quantity>product.stock){notify("No hay más unidades disponibles en este prototipo.");return;}
  if(current)current.quantity+=quantity;else cart.push({id,quantity});
  renderCart();notify("Producto agregado al carrito.");
}
function changeQuantity(id,delta){
  const item=cart.find(i=>i.id===id);if(!item)return;
  const product=products.find(p=>p.id===id);
  item.quantity+=delta;
  if(item.quantity<=0)cart=cart.filter(i=>i.id!==id);
  else if(item.quantity>product.stock){item.quantity=product.stock;notify("Alcanzaste el stock de demostración.");}
  renderCart();
}
function renderCart(){
  const count=cart.reduce((sum,i)=>sum+i.quantity,0);
  document.getElementById("cartCount").textContent=count;
  const total=cart.reduce((sum,i)=>sum+products.find(p=>p.id===i.id).price*i.quantity,0);
  document.getElementById("cartTotal").textContent=money(total);
  const target=document.getElementById("cartItems");
  if(!cart.length){target.innerHTML='<div class="cart-empty">🛒<br><br>Tu carrito está vacío.<br>¡Agregá algunos productos!</div>';document.getElementById("checkoutBtn").disabled=true;return;}
  document.getElementById("checkoutBtn").disabled=false;
  target.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `
    <div class="cart-item"><div class="cart-item-icon">${p.icon}</div><div><strong>${p.name}</strong><small>${money(p.price)} c/u</small>
    <div class="qty-control"><button data-minus="${p.id}" aria-label="Quitar uno">−</button><span>${i.quantity}</span><button data-plus="${p.id}" aria-label="Agregar uno">+</button></div></div>
    <span class="cart-item-price">${money(p.price*i.quantity)}</span></div>`;}).join("");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");cartDrawer.setAttribute("aria-hidden","false");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");cartDrawer.setAttribute("aria-hidden","true");}
document.getElementById("categoryFilters").addEventListener("click",e=>{
  const button=e.target.closest("[data-category]");if(!button)return;
  activeCategory=button.dataset.category;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));renderProducts();
});
searchInput.addEventListener("input",renderProducts);
grid.addEventListener("click",e=>{const button=e.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add));});
document.getElementById("cartItems").addEventListener("click",e=>{
  const plus=e.target.closest("[data-plus]"),minus=e.target.closest("[data-minus]");
  if(plus)changeQuantity(Number(plus.dataset.plus),1);
  if(minus)changeQuantity(Number(minus.dataset.minus),-1);
});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("menuToggle").addEventListener("click",()=>{
  const nav=document.getElementById("mainNav");const opened=nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded",String(opened));
});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));

document.getElementById("calculateBtn").addEventListener("click",()=>{
  const area=Number(document.getElementById("areaInput").value);
  const type=document.getElementById("workType").value;
  const result=document.getElementById("calcResult");
  if(!Number.isFinite(area)||area<=0||area>10000){result.textContent="Ingresá una medida válida mayor que 0.";return;}
  let description="",productId=null,quantity=0;
  if(type==="paint"){
    quantity=Math.ceil(area/10);description=`Para ${area} m² estimamos aproximadamente <strong>${quantity} litro(s)</strong> de pintura por mano (rendimiento orientativo: 10 m²/L). Para dos manos, considerá duplicar la cantidad.`;productId=3;
  }else if(type==="tile"){
    quantity=Math.ceil(area*1.1);description=`Para ${area} m² estimamos <strong>${quantity} m² de cerámicos</strong>, incluyendo un 10 % adicional por cortes y desperdicio. La cantidad de cajas depende del rendimiento indicado por el fabricante.`;
  }else{
    quantity=Math.ceil(Math.sqrt(area*area*2)*1.15);description=`Para una superficie de ${area} m², como referencia inicial estimamos <strong>${quantity} metros de cable</strong>. La instalación real debe calcularse según el recorrido y el diseño eléctrico por un profesional matriculado.`;
  }
  result.innerHTML=description+(productId?`<br><button class="result-add" data-calc-add="${productId}">Agregar pintura al carrito +</button>`:"");
});
document.getElementById("calcResult").addEventListener("click",e=>{
  const button=e.target.closest("[data-calc-add]");if(button){addToCart(Number(button.dataset.calcAdd));openCart();}
});

document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length)return;
  const code=String(Math.floor(100000+Math.random()*900000));
  document.getElementById("pickupCode").textContent=code;
  closeCart();document.getElementById("checkoutModal").classList.add("show");
});
function closeModal(){document.getElementById("checkoutModal").classList.remove("show");cart=[];renderCart();}
document.getElementById("closeModal").addEventListener("click",closeModal);
document.getElementById("finishCheckout").addEventListener("click",closeModal);
document.getElementById("checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")closeModal();});
renderProducts();renderCart();
