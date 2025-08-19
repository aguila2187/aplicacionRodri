// Año dinámico
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Nav toggle
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
if (nav && navToggle) {
	navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
	entries.forEach(e => {
		if (e.isIntersecting) {
			e.target.classList.add('show');
			io.unobserve(e.target);
		}
	});
},{threshold:.12, rootMargin:'0px 0px -8% 0px'});
revealEls.forEach(el=>io.observe(el));

// Parallax mouse move
const layers = document.querySelectorAll('.layer');
window.addEventListener('mousemove', (e) => {
	const x = (e.clientX / window.innerWidth - .5) * 8;
	const y = (e.clientY / window.innerHeight - .5) * 8;
	layers.forEach((l, i) => {
		l.style.transform = `translate(${x * (i+1)}px, ${y * (i+1)}px)`;
	});
});

// Simple carousel auto-slide
const carousel = document.querySelector('.carousel');
if (carousel) {
	let index = 0;
	const slides = Array.from(carousel.children);
	setInterval(()=>{
		index = (index + 1) % slides.length;
		carousel.style.transform = `translateX(-${index * 100}%)`;
	}, 3500);
}

// PWA install prompt
let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
	if (installBtn) installBtn.hidden = false;
});
if (installBtn) {
	installBtn.addEventListener('click', async () => {
		if (!deferredPrompt) return;
		installBtn.disabled = true;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		deferredPrompt = null;
		installBtn.hidden = true;
		console.log('PWA install:', outcome);
	});
}

// Register Service Worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(console.error);
	});
}