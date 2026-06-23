// NAVBAR STICKY

window.addEventListener("scroll",()=>{

const nav = document.getElementById("navbar");

if(window.scrollY > 50){
nav.classList.add("scrolled");
}else{
nav.classList.remove("scrolled");
}

});

// CHART

new Chart(
document.getElementById("reclamosChart"),
{
type:"doughnut",

data:{
labels:[
"Pendientes",
"En proceso",
"Resueltos"
],

datasets:[{
data:[386,324,538],
backgroundColor:[
"#0057d8",
"#61a5ff",
"#58c67a"
]
}]
},

options:{
responsive:true
}
}
);

// LEAFLET

const map = L.map('map').setView(
[-34.6534,-58.6197],
13
);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

L.marker(
[-34.6534,-58.6197]
)
.addTo(map)
.bindPopup("Morón Centro");

// CARRUSEL

let index = 0;

const slides =
document.querySelectorAll(".slide");

setInterval(()=>{

slides[index].classList.remove("active");

index++;

if(index >= slides.length){
index = 0;
}

slides[index].classList.add("active");

},4000);

// ANIMACIONES

const observer =
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([
{
opacity:0,
transform:"translateY(50px)"
},
{
opacity:1,
transform:"translateY(0)"
}
],
{
duration:700,
fill:"forwards"
}
);

}

});

});

document
.querySelectorAll(".card,.noticias")
.forEach(el=>observer.observe(el));