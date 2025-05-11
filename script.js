const bgLoading = document.querySelector('.bg-loading');
const mainContainer = document.getElementById('main-container');

const items = document.querySelectorAll('.fisheye');

const homeText = document.querySelector('.home-text');
const projectsContainer = document.querySelector('.projects-container');
const techsAndToolsContainer = document.querySelector('.techs-and-tools-container');
const contactContainter = document.querySelector('.contact-container');
const aboutContainer = document.querySelector('.about-container');

const socialLinks = document.querySelectorAll('.social');

const optionHoverSound = document.getElementById('option-hover-sound');
const optionClickSound = document.getElementById('option-click-sound');
const optionCloseSound = document.getElementById('option-close-sound');

const openPlayer = document.getElementById('open-player');
const closePlayer = document.getElementById('close-player');
const playerContainer = document.querySelector('.absolute-player-container');

const statusText = document.querySelector('.status-text');
const dotsAnim = document.querySelector('.dots-anim');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const volume = document.getElementById('volume');

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successDialog = document.getElementById('success-dialog');

const allSections = [homeText, projectsContainer, techsAndToolsContainer, contactContainter, aboutContainer];
let activeSection = null;

window.onload = function() {
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
    setTimeout(() => {
        bgLoading.classList.add('hidden');
    }, 3000);
    setTimeout(() => {
        mainContainer.style.animation = 'slide-in-fwd-center 1s cubic-bezier(.55, .085, .68, .53) both';
        mainContainer.style.zIndex = '10000';
    }, 3000);
    setTimeout(() => {
        bgLoading.style.display = 'none';
    }, 5000);
};

setTimeout(function(){
    document.body.className="";
},500);

// Logica para el reproductor de YouTube

// Cargar la API de YouTube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Variables globales
let player;
let isPlaying = false;

// Función llamada cuando la API está lista
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'kuIZFi9EUBQ',
        playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
            rel: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Cuando el reproductor está listo
function onPlayerReady(event) {
    event.target.setVolume(10);
    
    // Configurar controles
    playBtn.addEventListener('click', function() {
        player.playVideo();
    });
    
    pauseBtn.addEventListener('click', function() {
        player.pauseVideo();
    });
    
    volume.addEventListener('input', function() {
        player.setVolume(this.value);
    });
}

// Lógica para dibujar los puntos

let dots = '';
let timeoutId = null;

function drawPoint(counter) {
    if (counter === null) {
        dots = '';
        clearTimeout(timeoutId);
        return;
    }

    if (counter === 3) {
        dots = '';
        drawPoint(0);
        return;
    }

    if(counter < 3) {
        timeoutId = setTimeout(() => {
            dots += '.';
            dotsAnim.textContent = dots;
            // console.log(dotsAnim.textContent);
            drawPoint(counter + 1);
        }, 800);
    }
}

// Cuando cambia el estado del reproductor
function onPlayerStateChange(event) {
    dotsAnim.textContent = ''; // Limpiar los puntos
    drawPoint(null)
    if (event.data == YT.PlayerState.PAUSED) {
        drawPoint(null);
        statusText.textContent = 'Pausado';
    }

    if (event.data == YT.PlayerState.BUFFERING) {
        isPlaying = true;
        statusText.textContent = 'Cargando';
        drawPoint(0);
    }

    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        statusText.textContent = 'Reproduciendo';
        drawPoint(0);
    }
}


// Logica para las secciones
let clicked = false;
let selectedItem = null;

function showSection(showElement) {
    allSections.forEach(el => el.classList.remove("active"));
    if (activeSection !== showElement) {
        showElement.classList.add("active");
        activeSection = showElement;
        optionClickSound.currentTime = 0;
        optionClickSound.play();
    } else {
        activeSection = null;
        selectedItem = null;
        optionCloseSound.currentTime = 0;
        optionCloseSound.play();
    }
}

function animateItems(current, prevOne, prevTwo, nextOne, nextTwo) {
    gsap.to(current, {
        scale: 1.6, duration: 0.25, z: 0.01, transformOrigin: "0% 50%",
        ease: "none", background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", filter: "brightness(1.2)"
    });
    if (prevOne) gsap.to(prevOne, {
        scale: 1.3, duration: 0.25, z: 0.01, transformOrigin: "0% 50%",
        ease: "none", filter: "brightness(.8)"
    });
    if (nextOne) gsap.to(nextOne, {
        scale: 1.3, duration: 0.25, z: 0.01, transformOrigin: "0% 50%",
        ease: "none", filter: "brightness(.8)"
    });
    if (prevTwo) gsap.to(prevTwo, {
        scale: 1.1, duration: 0.25, z: 0.01, transformOrigin: "0% 50%",
        ease: "none"
    });
    if (nextTwo) gsap.to(nextTwo, {
        scale: 1.1, duration: 0.25, z: 0.01, transformOrigin: "0% 50%",
        ease: "none"
    });
}

function resetItems(elements) {
    elements.forEach(el => {
        if (el) {
            gsap.to(el, {
                scale: 1, duration: 0.25, z: 0.01, transformOrigin: "0% 50%",
                ease: "none", background: "rgba(0, 0, 0, 0)", filter: "brightness(.6)"
            });
        }
    });
}

items.forEach((item, index) => {
    item.setAttribute("data-index", index);
    item.addEventListener("mouseenter", () => {
        const current = item;
        const prevOne = items[index - 1];
        const prevTwo = items[index - 2];
        const nextOne = items[index + 1];
        const nextTwo = items[index + 2];

        // Si hay un seleccionado, quitarle animación temporalmente
        if (selectedItem !== current && selectedItem) {
            const selIndex = parseInt(selectedItem.getAttribute("data-index"));
            resetItems([
                selectedItem,
                items[selIndex - 1],
                items[selIndex - 2],
                items[selIndex + 1],
                items[selIndex + 2],
            ]);
            
        }

        // El audio se reproduce mientras selectedItem sea diferente al item
        if (selectedItem !== current) {
            optionHoverSound.currentTime = 0;
            optionHoverSound.play();
        }

        animateItems(current, prevOne, prevTwo, nextOne, nextTwo);
        // console.log(selectedItem);
        // console.log(current)
    });

    item.addEventListener("mouseleave", () => {
        if(selectedItem !== item) {
            resetItems([
                item,
                items[index - 1],
                items[index - 2],
                items[index + 1],
                items[index + 2],
            ]);
        }
        
        // Si hay un item seleccionado, volver a resaltarlo
        if (selectedItem) {
            const selIndex = parseInt(selectedItem.getAttribute("data-index"));
            animateItems(
                selectedItem,
                items[selIndex - 1],
                items[selIndex - 2],
                items[selIndex + 1],
                items[selIndex + 2]
            );
        }
    });

    item.addEventListener("click", () => {
        selectedItem = item;
        showSection(allSections[index]);
    });
});


socialLinks.forEach(social => {
    social.addEventListener("mouseenter", () => {
        optionHoverSound.currentTime = 0;
        optionHoverSound.play();
    });
})

closePlayer.style.display = "none";
openPlayer.addEventListener("click", () => {
    closePlayer.style.display = "flex";
    openPlayer.style.display = "none";
    optionClickSound.currentTime = 0;
    optionClickSound.play();
    playerContainer.classList.add("active");
})
closePlayer.addEventListener("click", () => {
    openPlayer.style.display = "flex";
    closePlayer.style.display = "none";
    optionCloseSound.currentTime = 0;
    optionCloseSound.play();
    playerContainer.classList.remove("active");
})

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
    successDialog.showModal();
    optionClickSound.currentTime = 0;
    optionClickSound.play();
    setTimeout(() => {
        successDialog.close();
    }, 1500);
})

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );