/**
 * Black Beard Barber - Main JavaScript
 * Contém interatividades de UI, navegação e integração simulada.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Menu Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-btn');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !isExpanded);
    }

    hamburger.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 2. Header Dinâmico (Sticky) ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Scroll Suave para Links Internos ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Compensa a altura do header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. Animações ao Entrar na Tela (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: parar de observar após animar uma vez
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- 5. Lógica de Agendamento (WhatsApp Dinâmico) ---
    const agendarBtns = document.querySelectorAll('.btn-agendar');
    const telefoneBarbearia = "5551999999999"; // Número configurado

    agendarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const servico = btn.getAttribute('data-servico');
            const mensagem = `Olá! Gostaria de agendar o serviço ${servico} na Black Beard.`;
            const url = `https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
        });
    });

    // --- 6. Modal da Galeria (Lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const prevLightboxBtn = document.querySelector('.prev-lightbox');
    const nextLightboxBtn = document.querySelector('.next-lightbox');
    
    let currentImageIndex = 0;
    const imagesArray = Array.from(galleryItems);

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = imagesArray[currentImageIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede scroll do body
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        lightboxImg.src = imagesArray[currentImageIndex].src;
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        lightboxImg.src = imagesArray[currentImageIndex].src;
    }

    // Eventos Galeria
    imagesArray.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeLightboxBtn.addEventListener('click', closeLightbox);
    nextLightboxBtn.addEventListener('click', nextImage);
    prevLightboxBtn.addEventListener('click', prevImage);

    // Fechar clicando fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // --- 7. Slider de Depoimentos ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevSlideBtn = document.querySelector('.prev-btn');
    const nextSlideBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Criar indicadores (dots)
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetInterval();
    }

    function nextSlide() {
        let newIndex = (currentSlide + 1) % slides.length;
        goToSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(newIndex);
    }

    // Eventos Slider
    nextSlideBtn.addEventListener('click', nextSlide);
    prevSlideBtn.addEventListener('click', prevSlide);

    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000); // Troca a cada 5s
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval();

    // --- 8. Validação Simples do Formulário de Contato ---
    const form = document.getElementById('agendamento-form');
    const formMsg = document.getElementById('form-msg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Pega valores
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const servico = document.getElementById('servico-select').value;
        const data = document.getElementById('data').value;
        const horario = document.getElementById('horario').value;

        // Validação básica
        if (!nome || !telefone || !servico || !data || !horario) {
            formMsg.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            formMsg.className = 'form-msg error';
            return;
        }

        // Simulação de envio bem-sucedido
        formMsg.innerHTML = `Sucesso, ${nome}! Solicitação enviada.<br><a href="https://wa.me/${telefoneBarbearia}?text=Olá, me chamo ${nome} e acabei de solicitar um agendamento pelo site para ${servico} no dia ${data} às ${horario}." target="_blank" style="color: var(--color-gold); text-decoration: underline; margin-top: 10px; display: inline-block;">Clique aqui para confirmar via WhatsApp</a>`;
        formMsg.className = 'form-msg success';
        
        form.reset(); // Limpa formulário
        
        // Remove mensagem após 10 segundos
        setTimeout(() => {
            formMsg.style.display = 'none';
        }, 10000);
    });

    // --- 9. Botão Voltar ao Topo ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 10. Acessibilidade e Teclado ---
    document.addEventListener('keydown', (e) => {
        // Fechar modais com tecla ESC
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
        
        // Navegação de galeria com setas
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });
});